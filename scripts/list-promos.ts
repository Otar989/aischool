// List active promo codes (hashed) with usage stats.
// Usage: npx ts-node scripts/list-promos.ts
import { createClient } from '@supabase/supabase-js';

async function main() {
  if (!process.env.SUPABASE_URL || !(process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    console.error('Missing SUPABASE_URL and service role env vars');
    process.exit(1);
  }
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE!;
  const supabase = createClient(process.env.SUPABASE_URL, service);
  const { data, error } = await supabase.from('promo_codes').select('id,label,max_uses,used_count,active,expires_at,created_at');
  if (error) { console.error(error); process.exit(1); }
  console.table(data);
}

main().catch(e=>{ console.error(e); process.exit(1); });
