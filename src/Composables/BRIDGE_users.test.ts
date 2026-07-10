import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_users } from './BRIDGE_users'
import { api } from './apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('./apiConnect', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getUser appelle la bonne URL et renvoie les donnees', async () => {
    mockedApi.get.mockResolvedValue({ data: { user_id: 12, name: 'Aissam' } })

    const { getUser } = B_users()
    const result = await getUser(12)

    expect(mockedApi.get).toHaveBeenCalledWith('/users/12')
    expect(result).toEqual({ user_id: 12, name: 'Aissam' })
  })

  it('updateUser ne garde que les champs autorises', async () => {
    mockedApi.patch.mockResolvedValue({ data: {} })

    const { updateUser } = B_users()
    await updateUser(3, {
      bio: 'Salut',
      statut: 'valide',
      // champs interdits : ils ne doivent pas partir vers l'API
      user_id: 999,
      permissions: 1,
    } as never)

    expect(mockedApi.patch).toHaveBeenCalledWith('/users/3', {
      bio: 'Salut',
      statut: 'valide',
    })
  })

  it('updateUser accepte les tableaux (competences, centresInteret)', async () => {
    mockedApi.patch.mockResolvedValue({ data: {} })

    const { updateUser } = B_users()
    await updateUser(5, { competences: ['bricolage'], centresInteret: ['jardinage'] })

    expect(mockedApi.patch).toHaveBeenCalledWith('/users/5', {
      competences: ['bricolage'],
      centresInteret: ['jardinage'],
    })
  })
})
