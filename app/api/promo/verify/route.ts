import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';
import { signPromoJwt } from '@/lib/jwt';
import { z } from 'zod';
import { rl } from '@/lib/ratelimit';

export const runtime = 'nodejs';

const schema = z.object({ code: z.string().min(3).max(64) });

export async function POST(req: NextRequest) {
  // Диагностика конфигурации Supabase (если переменные не заданы, supabaseAdmin будет стабом)
  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE)
  if (!supabaseConfigured) {
    return NextResponse.json({ error: 'Сервер: Supabase не настроен' }, { status: 500 })
  }

  const ip = req.headers.get('x-forwarded-for') ?? (req as any).ip ?? '0.0.0.0';
  const { success } = await rl.limit(`promo:${ip}`);
  if (!success) return NextResponse.json({ error: 'Слишком много попыток' }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parse = schema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: 'Некорректный формат' }, { status: 400 });

  const code = parse.data.code.trim();

  // Bypass для отладки: если установлен PROMO_BYPASS_CODE и код совпадает — сразу успех
  if (process.env.PROMO_BYPASS_CODE && code === process.env.PROMO_BYPASS_CODE) {
    console.warn('[promo] BYPASS success (PROMO_BYPASS_CODE) — удалить в продакшене после теста')
    const jwt = await signPromoJwt({ bypass: true })
    const res = NextResponse.json({ ok: true, bypass: true })
    res.cookies.set('promo_session', jwt, {
      httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 30
    })
    return res
  }

  const { data: rows, error } = await supabaseAdmin
    .from('promo_codes')
    .select('id, code_hash, max_uses, used_count, expires_at, active')
    .eq('active', true);

  if (error) {
    console.error('[promo] select error', error)
    return NextResponse.json({ error: 'Ошибка сервера (select)' }, { status: 500 })
  }
  if (!rows) {
    console.error('[promo] rows undefined')
    return NextResponse.json({ error: 'Ошибка сервера (no data)' }, { status: 500 })
  }
  if (rows.length === 0) {
    return NextResponse.json({ error: 'Нет активных промокодов' }, { status: 404 })
  }

  let matched: any = null;
  for (const r of rows) {
    let plainOk = false
    let bcryptOk = false
    try {
      plainOk = r.code_hash === code
      if (!plainOk && r.code_hash.startsWith('$2')) {
        bcryptOk = await bcrypt.compare(code, r.code_hash)
      }
    } catch (e) {
      console.error('[promo] compare error', e)
    }
    console.log('[promo][compare]', { id: r.id, plainOk, bcryptOk, hashPrefix: r.code_hash.slice(0, 10) })
    if (plainOk || bcryptOk) { matched = r; break }
  }

  if (!matched) return NextResponse.json({ error: 'Неверный промокод' }, { status: 401 });

  if (matched.expires_at && new Date(matched.expires_at) < new Date())
    return NextResponse.json({ error: 'Срок действия истёк' }, { status: 401 });

  if (matched.used_count >= matched.max_uses)
    return NextResponse.json({ error: 'Лимит использований исчерпан' }, { status: 401 });

  const insertRes = await supabaseAdmin.from('promo_redemptions').insert({
    code_id: matched.id,
    ip,
    user_agent: req.headers.get('user-agent') ?? '',
  })
  if (insertRes.error) {
    console.error('[promo] redemption insert error', insertRes.error)
  }
  const incRes = await supabaseAdmin.rpc('increment_promo_use', { p_code_id: matched.id })
  if (incRes.error) {
    console.warn('[promo] rpc increment failed, fallback update')
    await supabaseAdmin.from('promo_codes')
      .update({ used_count: matched.used_count + 1 })
      .eq('id', matched.id)
  }

  const jwt = await signPromoJwt({ code_id: matched.id });
  const res = NextResponse.json({ ok: true });

  res.cookies.set('promo_session', jwt, {
    httpOnly: true, secure: true, sameSite: 'strict', path: '/', maxAge: 60 * 60 * 24 * 30
  });

  return res;
}
