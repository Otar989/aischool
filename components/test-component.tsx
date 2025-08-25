import React from 'react'

export function TestComponent({ count }: { count: number }) {
  return <div data-testid="counter">Count: {count}</div>
}
