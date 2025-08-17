import { describe, it, expect, beforeAll } from 'vitest'
import { newDb } from 'pg-mem'
import { query, __setPool } from '@/lib/db'

beforeAll(async () => {
  const db = newDb()
  const { Pool } = db.adapters.createPg()
  const pool = new Pool()
  __setPool(pool as any)
  await query(`CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT, name TEXT);`)
  await query(`CREATE TABLE courses (id SERIAL PRIMARY KEY, title TEXT);`)
  await query(`CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id INT, amount_cents INT, status TEXT);`)
})

describe('database queries', () => {
  it('inserts and retrieves users', async () => {
    await query('INSERT INTO users (email, name) VALUES ($1, $2)', ['test@example.com', 'Tester'])
    const { rows } = await query('SELECT * FROM users WHERE email = $1', ['test@example.com'])
    expect(rows[0]).toMatchObject({ email: 'test@example.com', name: 'Tester' })
  })

  it('returns courses', async () => {
    await query('INSERT INTO courses (title) VALUES ($1), ($2)', ['Course 1', 'Course 2'])
    const { rows } = await query('SELECT * FROM courses')
    expect(rows).toHaveLength(2)
  })

  it('filters orders by status', async () => {
    await query('INSERT INTO orders (user_id, amount_cents, status) VALUES ($1, $2, $3)', [1, 5000, 'paid'])
    const { rows } = await query('SELECT * FROM orders WHERE status = $1', ['paid'])
    expect(rows[0]).toMatchObject({ user_id: 1, amount_cents: 5000, status: 'paid' })
  })
})
