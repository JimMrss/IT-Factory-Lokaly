import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_admin_validation } from './ADMIN_validation'
import { api } from '../apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('../apiConnect', () => ({
  api: {
    patch: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_admin_validation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('validateHabitant passe le statut a valide', async () => {
    mockedApi.patch.mockResolvedValue({ data: { id: 8, statut: 'valide' } })

    const { validateHabitant } = B_admin_validation()
    const result = await validateHabitant(8)

    expect(mockedApi.patch).toHaveBeenCalledWith('/users/8', { statut: 'valide' })
    expect(result.statut).toBe('valide')
  })
})
