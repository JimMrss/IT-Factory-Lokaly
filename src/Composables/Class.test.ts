import { describe, it, expect } from 'vitest'
import { Client, Group, Annonce } from './Class'

// Tests des factories de Class.ts : chaque appel doit renvoyer un objet neuf
describe('Class.ts (factories)', () => {
  it('Client() renvoie un objet avec des tableaux vides', () => {
    const c = Client()
    expect(c.groups).toEqual([])
    expect(c.activities).toEqual([])
  })

  it('deux appels ne partagent pas le meme tableau (pas de reference commune)', () => {
    const a = Client()
    const b = Client()
    a.groups.push(1)
    expect(b.groups).toEqual([])
  })

  it('Group() et Annonce() exposent bien les champs attendus', () => {
    expect(Object.keys(Group())).toContain('members')
    expect(Object.keys(Annonce())).toContain('interested_users')
  })
})
