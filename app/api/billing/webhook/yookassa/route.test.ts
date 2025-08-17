import { describe, it, expect, vi } from 'vitest'
import { createHmac } from 'node:crypto'
import { NextRequest } from 'next/server'
import { POST } from './route'

vi.mock('@/lib/db', () => ({ query: vi.fn() }))

describe('YooKassa webhook signature', () => {
  it('accepts valid signature', async () => {
    process.env.YOOKASSA_WEBHOOK_SECRET = 'test_secret'
    const body = JSON.stringify({ event: 'test.event', object: {} })
    const signature = createHmac('sha1', 'test_secret').update(body).digest('base64')
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
        'content-hmac': signature,
      },
    })

    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('rejects missing signature', async () => {
    process.env.YOOKASSA_WEBHOOK_SECRET = 'test_secret'
    const body = JSON.stringify({ event: 'test.event', object: {} })
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body,
      headers: { 'content-type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects invalid signature', async () => {
    process.env.YOOKASSA_WEBHOOK_SECRET = 'test_secret'
    const body = JSON.stringify({ event: 'test.event', object: {} })
    const req = new NextRequest('http://localhost', {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/json',
        'content-hmac': 'invalid',
      },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})
