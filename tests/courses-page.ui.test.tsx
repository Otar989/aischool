// UI test (jsdom)
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

vi.mock('@/lib/db', () => ({
  getCourses: vi.fn((search = '', limit = 20, offset = 0) => {
    const all = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      slug: `course-${i + 1}`,
      title: `Course ${i + 1}`,
      description: 'Test course',
      price: 1000,
      image_url: '/image.png',
      is_published: true,
    }))
    return Promise.resolve(all.slice(offset, offset + limit))
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  cleanup()
})

describe('CoursesPage', () => {
  it('renders a list of course cards', async () => {
    const Page = (await import('@/app/courses/page')).default
    const ui = await Page({ searchParams: {} })
    render(ui)
    expect(screen.getAllByTestId('course-card').length).toBe(12)
  })

  it('shows next page of courses', async () => {
    const Page = (await import('@/app/courses/page')).default
    const ui = await Page({ searchParams: { page: '2' } })
    render(ui)
    expect(screen.getByText('Course 13')).toBeInTheDocument()
    expect(screen.queryByText('Course 1')).not.toBeInTheDocument()
  })
})
