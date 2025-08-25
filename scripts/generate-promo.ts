// Usage: npx ts-node scripts/generate-promo.ts "VIP-START-2025" --max=100 --label="Промо запуск"
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const [,, rawCode, ...rest] = process.argv;
if (!rawCode) { console.error('Usage: ts-node scripts/generate-promo.ts "<CODE>" [--max=10] [--label="..."]'); process.exit(1);} // no raw code logged

const max = Number((rest.find(x=>x.startsWith('--max='))||'--max=1').split('=')[1]);
const label = (rest.find(x=>x.startsWith('--label='))||'--label=').split('=')[1] || null;

(async () => {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);
  const code_hash = await bcrypt.hash(rawCode, 12);
  const { error } = await supabase.from('promo_codes').insert({ code_hash, max_uses: max, label });
  if (error) { console.error(error); process.exit(1); }
  console.log('Промокод создан:', rawCode); // only plain code output
})();
