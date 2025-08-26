// Simple CLI helper to seed AI generated courses.
// Usage: pnpm courses:seed:ai

const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function main() {
  const resp = await fetch(base + '/api/ai-courses/seed', { method: 'POST' })
  const js = await resp.json().catch(()=>({}))
  console.log('[ai-seed] status', resp.status, js)
}

main().catch(e => { console.error(e); process.exit(1) })
