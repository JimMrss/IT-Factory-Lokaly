import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_notifications } from './BRIDGE_notifications'
import { api } from './apiConnect'

// On mocke axios pour ne pas appeler la vraie API
vi.mock('./apiConnect', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
    put: vi.fn(),
  },
}))

const mockedApi = vi.mocked(api)

describe('B_notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getNotifications renvoie la liste de l API', async () => {
    const notifs = [{ id: 1, type: 'info', message: 'Bienvenue', lu: false, date: '2026-07-10' }]
    mockedApi.get.mockResolvedValue({ data: notifs })

    const { getNotifications } = B_notifications()
    const result = await getNotifications()

    expect(mockedApi.get).toHaveBeenCalledWith('/notifications/')
    expect(result).toEqual(notifs)
  })

  it('markAsRead passe lu a true via PATCH', async () => {
    mockedApi.patch.mockResolvedValue({ data: { id: 3, lu: true } })

    const { markAsRead } = B_notifications()
    const result = await markAsRead(3)

    expect(mockedApi.patch).toHaveBeenCalledWith('/notifications/3', { lu: true })
    expect(result.lu).toBe(true)
  })

  it('markAllAsRead appelle la bonne URL en PUT', async () => {
    mockedApi.put.mockResolvedValue({ data: {} })

    const { markAllAsRead } = B_notifications()
    await markAllAsRead()

    expect(mockedApi.put).toHaveBeenCalledWith('/notifications/readAll')
  })
})
