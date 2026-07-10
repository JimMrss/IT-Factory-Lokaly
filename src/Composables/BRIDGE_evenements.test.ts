import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_Evenements } from './BRIDGE_evenements'
import { api } from './apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('./apiConnect', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_Evenements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getAllEvenements renvoie la liste de l API', async () => {
    const evenements = [{ id: 1, name: 'Fete des voisins', date: '2026-07-15' }]
    mockedApi.get.mockResolvedValue({ data: evenements })

    const { getAllEvenements } = B_Evenements()
    const result = await getAllEvenements()

    expect(mockedApi.get).toHaveBeenCalledWith('/evenements/')
    expect(result).toEqual(evenements)
  })
})
