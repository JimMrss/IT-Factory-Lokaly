import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_Annonces } from './BRIDGE_annonces'
import { api } from './apiConnect'

// On mocke l'instance axios pour ne pas appeler la vraie API pendant les tests
vi.mock('./apiConnect', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_Annonces', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createAnnonce ne garde que les champs autorises du payload', async () => {
    mockedApi.post.mockResolvedValue({ data: { annonce_id: 1 } })

    const { createAnnonce } = B_Annonces()
    await createAnnonce({
      name: 'Cours de guitare',
      type: 'service',
      // champ non autorise : il ne doit PAS partir vers l'API
      is_admin: true,
    } as never)

    expect(mockedApi.post).toHaveBeenCalledWith('/annonces/', {
      name: 'Cours de guitare',
      type: 'service',
    })
  })

  it('createAnnonce renvoie les donnees de la reponse API', async () => {
    mockedApi.post.mockResolvedValue({ data: { annonce_id: 42, name: 'Test' } })

    const { createAnnonce } = B_Annonces()
    const result = await createAnnonce({ name: 'Test' })

    expect(result).toEqual({ annonce_id: 42, name: 'Test' })
  })

  it('updateAnnonce filtre aussi les champs non autorises', async () => {
    mockedApi.put.mockResolvedValue({ data: {} })

    const { updateAnnonce } = B_Annonces()
    await updateAnnonce(7, { state: 'fermee', hack: 'oui' } as never)

    expect(mockedApi.put).toHaveBeenCalledWith('/annonces/7', { state: 'fermee' })
  })

  it('toggleInterest envoie le bon user_id et l id en query', async () => {
    mockedApi.post.mockResolvedValue({ data: { interested_users: [3] } })

    const { toggleInterest } = B_Annonces()
    const result = await toggleInterest(5, 3)

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/annonces/5/interest/',
      { user_id: 3 },
      { params: { annonceId: 5 } },
    )
    expect(result).toEqual({ interested_users: [3] })
  })
})
