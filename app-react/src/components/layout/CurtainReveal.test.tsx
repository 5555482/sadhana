import { render, screen } from '@testing-library/react'
import { describe, it, expect, afterEach } from 'vitest'
import { __setReducedMotion } from '../../test/mocks/framer-motion'
import { CurtainReveal } from './CurtainReveal'

afterEach(() => __setReducedMotion(false))

describe('CurtainReveal', () => {
  it('renders both the base and overlay content', () => {
    render(<CurtainReveal base={<div>BASE_CONTENT</div>} overlay={<div>OVERLAY_CONTENT</div>} />)
    expect(screen.getByText('BASE_CONTENT')).toBeInTheDocument()
    expect(screen.getByText('OVERLAY_CONTENT')).toBeInTheDocument()
  })

  it('pins the base as a one-screen sticky panel', () => {
    const { container } = render(<CurtainReveal base={<div>BASE</div>} overlay={<div>OVER</div>} />)
    const sticky = container.querySelector('.sticky')
    expect(sticky).not.toBeNull()
    expect(sticky?.className).toContain('top-0')
    expect(sticky?.className).toContain('h-[100svh]')
  })

  it('gives the overlay a rounded-top curtain surface', () => {
    const { container } = render(<CurtainReveal base={<div>BASE</div>} overlay={<div>OVER</div>} />)
    expect(container.querySelector('.rounded-t-3xl')).not.toBeNull()
  })

  it('still renders both panels under reduced motion', () => {
    __setReducedMotion(true)
    render(<CurtainReveal base={<div>BASE_RM</div>} overlay={<div>OVER_RM</div>} />)
    expect(screen.getByText('BASE_RM')).toBeInTheDocument()
    expect(screen.getByText('OVER_RM')).toBeInTheDocument()
  })
})
