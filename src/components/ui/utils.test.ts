import { describe, it, expect } from 'vitest'
import { cn } from './utils'

// Tests de l'utilitaire cn() qui combine les classes CSS (clsx + tailwind-merge)
describe('cn', () => {
  it('concatene plusieurs classes', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('ignore les valeurs falsy (conditions)', () => {
    const estCache = false as boolean
    expect(cn('btn', estCache && 'hidden', undefined, null)).toBe('btn')
  })

  it('garde la derniere classe en cas de conflit tailwind', () => {
    // p-2 et p-4 sont en conflit : tailwind-merge doit garder p-4
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('renvoie une chaine vide sans argument', () => {
    expect(cn()).toBe('')
  })
})
