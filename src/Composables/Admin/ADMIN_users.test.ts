import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_admin_users } from './ADMIN_users'
import { api } from '../apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('../apiConnect', () => ({
  api: {
    patch: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_admin_users', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('toggleUserStatus envoie le nouveau statut en PATCH', async () => {
    mockedApi.patch.mockResolvedValue({ data: { id: 4, statut: 'desactive' } })

    const { toggleUserStatus } = B_admin_users()
    const result = await toggleUserStatus(4, 'desactive')

    expect(mockedApi.patch).toHaveBeenCalledWith('/users/4', { statut: 'desactive' })
    expect(result.statut).toBe('desactive')
  })
})
