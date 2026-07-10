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

  it('getEvenements recupere un evenement par son id', async () => {
    const evenement = { id: 7, name: 'Vide-grenier', date: '2026-09-01' }
    mockedApi.get.mockResolvedValue({ data: evenement })

    const { getEvenements } = B_Evenements()
    const result = await getEvenements(7)

    expect(mockedApi.get).toHaveBeenCalledWith('/evenements/7')
    expect(result).toEqual(evenement)
  })

  it('createEvenement ne garde que les champs autorises', async () => {
    mockedApi.post.mockResolvedValue({ data: { id: 10 } })

    const { createEvenement } = B_Evenements()
    await createEvenement({
      name: 'Atelier compost',
      date: '2026-08-20',
      champInterdit: 'ne doit pas passer',
    } as never)

    expect(mockedApi.post).toHaveBeenCalledWith('/evenements/', {
      name: 'Atelier compost',
      date: '2026-08-20',
    })
  })
})
