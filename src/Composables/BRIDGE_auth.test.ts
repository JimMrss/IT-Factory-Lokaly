import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_auth } from './BRIDGE_auth'
import { api } from './apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('./apiConnect', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login retire le user_id du payload (champ non autorise)', async () => {
    mockedApi.post.mockResolvedValue({ data: { name: 'Aissam' } })

    const { login } = B_auth()
    await login({ mail: 'a@b.fr', password: 'secret', user_id: 7 })

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login/', {
      mail: 'a@b.fr',
      password: 'secret',
    })
  })

  it('register met permissions a 0 par defaut', async () => {
    mockedApi.post.mockResolvedValue({ data: {} })

    const { register } = B_auth()
    await register({ name: 'Test', mail: 't@t.fr', password: 'x' })

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register/', {
      name: 'Test',
      mail: 't@t.fr',
      password: 'x',
      permissions: 0,
    })
  })

  it('register garde les permissions si elles sont fournies', async () => {
    mockedApi.post.mockResolvedValue({ data: {} })

    const { register } = B_auth()
    await register({ name: 'Admin', mail: 'a@a.fr', password: 'x', permissions: 1 })

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register/', {
      name: 'Admin',
      mail: 'a@a.fr',
      password: 'x',
      permissions: 1,
    })
  })

  it('logout appelle la bonne URL', async () => {
    mockedApi.post.mockResolvedValue({ data: {} })

    const { logout } = B_auth()
    await logout()

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout/')
  })
})
