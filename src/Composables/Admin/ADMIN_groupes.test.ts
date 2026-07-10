import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_admin_groupes } from './ADMIN_groupes'
import { api } from '../apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('../apiConnect', () => ({
  api: {
    get: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_admin_groupes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllGroupsAdmin renvoie la liste des groupes', async () => {
    const groupes = [{ group_id: 1, name: 'Quartier Nord' }]
    mockedApi.get.mockResolvedValue({ data: groupes })

    const { getAllGroupsAdmin } = B_admin_groupes()
    const result = await getAllGroupsAdmin()

    expect(mockedApi.get).toHaveBeenCalledWith('/groupes/')
    expect(result).toEqual(groupes)
  })

  // Le composable doit proteger les pages admin d une reponse vide
  it('getAllGroupsAdmin renvoie un tableau vide si l API renvoie null', async () => {
    mockedApi.get.mockResolvedValue({ data: null })

    const { getAllGroupsAdmin } = B_admin_groupes()
    const result = await getAllGroupsAdmin()

    expect(result).toEqual([])
  })
})
