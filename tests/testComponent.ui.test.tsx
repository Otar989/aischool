import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TestComponent } from '../components/test-component'

describe('TestComponent', () => {
  it('renders count', () => {
    render(<TestComponent count={5} />)
    expect(screen.getByTestId('counter').textContent).toContain('5')
  })
})
