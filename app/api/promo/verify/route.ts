import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';
import { signPromoJwt } from '@/lib/jwt';
import { z } from 'zod';
import { rl } from '@/lib/ratelimit';

export const runtime = 'nodejs';

const schema = z.object({ code: z.string().min(3).max(64) });

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? (req as any).ip ?? '0.0.0.0';
  const { success } = await rl.limit(`promo:${ip}`);
  if (!success) return NextResponse.json({ error: 'Слишком много попыток' }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parse = schema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: 'Некорректный формат' }, { status: 400 });

  const code = parse.data.code.trim();

  const { data: rows, error } = await supabaseAdmin
    .from('promo_codes')
    .select('id, code_hash, max_uses, used_count, expires_at, active')
    .eq('active', true);

  if (error || !rows) return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });

  let matched: any = null;
  for (const r of rows) {
    if (await bcrypt.compare(code, r.code_hash)) { matched = r; break; }
  }

  if (!matched) return NextResponse.json({ error: 'Неверный промокод' }, { status: 401 });

  if (matched.expires_at && new Date(matched.expires_at) < new Date())
    return NextResponse.json({ error: 'Срок действия истёк' }, { status: 401 });

  if (matched.used_count >= matched.max_uses)
    return NextResponse.json({ error: 'Лимит использований исчерпан' }, { status: 401 });

  await supabaseAdmin.from('promo_redemptions').insert({
    code_id: matched.id,
    ip,
    user_agent: req.headers.get('user-agent') ?? '',
  });
  await supabaseAdmin.rpc('increment_promo_use', { p_code_id: matched.id }).catch(async () => {
    await supabaseAdmin.from('promo_codes')
      .update({ used_count: matched.used_count + 1 })
      .eq('id', matched.id);
  });

  const jwt = await signPromoJwt({ code_id: matched.id });
  const res = NextResponse.json({ ok: true });

  res.cookies.set('promo_session', jwt, {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 30
  });

  return res;
}
