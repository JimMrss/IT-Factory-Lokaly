import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_groupes } from './BRIDGE_groupe'
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

describe('B_groupes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('createGroup filtre les champs non autorises', async () => {
    mockedApi.post.mockResolvedValue({ data: { group_id: 1 } })

    const { createGroup } = B_groupes()
    await createGroup({
      name: 'Jardinage',
      category: 'loisirs',
      // champ interdit : ne doit pas partir vers l'API
      group_id: 42,
    } as never)

    expect(mockedApi.post).toHaveBeenCalledWith('/groupes/', {
      name: 'Jardinage',
      category: 'loisirs',
    })
  })

  it('updateGroup passe par PATCH avec le payload filtre', async () => {
    mockedApi.patch.mockResolvedValue({ data: {} })

    const { updateGroup } = B_groupes()
    await updateGroup(8, { niveau: '2', pirate: true } as never)

    expect(mockedApi.patch).toHaveBeenCalledWith('/groupes/8', { niveau: '2' })
  })

  it('addMemberToGroup envoie le bon user_id sur la bonne URL', async () => {
    mockedApi.post.mockResolvedValue({ data: { members: [4] } })

    const { addMemberToGroup } = B_groupes()
    const result = await addMemberToGroup(2, 4)

    expect(mockedApi.post).toHaveBeenCalledWith('/groupes/2/add_member/', { user_id: 4 })
    expect(result).toEqual({ members: [4] })
  })

  it('removeMemberFromGroup envoie le bon user_id sur la bonne URL', async () => {
    mockedApi.post.mockResolvedValue({ data: { members: [] } })

    const { removeMemberFromGroup } = B_groupes()
    await removeMemberFromGroup(2, 4)

    expect(mockedApi.post).toHaveBeenCalledWith('/groupes/2/remove_member/', { user_id: 4 })
  })

  it('deleteGroup appelle DELETE sur la bonne URL', async () => {
    mockedApi.delete.mockResolvedValue({ data: {} })

    const { deleteGroup } = B_groupes()
    await deleteGroup(9)

    expect(mockedApi.delete).toHaveBeenCalledWith('/groupes/9')
  })
})
