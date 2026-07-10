import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_admin_stats } from './ADMIN_stats'
import { B_Annonces } from '../BRIDGE_annonces'
import { B_groupes } from '../BRIDGE_groupe'

// On mocke les bridges pour ne pas appeler la vraie API
vi.mock('../BRIDGE_annonces', () => ({ B_Annonces: vi.fn() }))
vi.mock('../BRIDGE_groupe', () => ({ B_groupes: vi.fn() }))
vi.mock('../BRIDGE_users', () => ({ B_users: vi.fn() }))
vi.mock('../BRIDGE_evenements', () => ({ B_Evenements: vi.fn() }))

const mockedAnnonces = vi.mocked(B_Annonces)
const mockedGroupes = vi.mocked(B_groupes)

describe('B_admin_stats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getStatsByCategory compte les annonces par type', async () => {
    mockedAnnonces.mockReturnValue({
      getAllAnnonces: vi.fn().mockResolvedValue([
        { id: 1, type: 'Vente' },
        { id: 2, type: 'Don' },
        { id: 3, type: 'Vente' },
        { id: 4 },
      ]),
    } as never)

    const { getStatsByCategory } = B_admin_stats()
    const result = await getStatsByCategory()

    expect(result).toEqual([
      { name: 'Vente', value: 2 },
      { name: 'Don', value: 1 },
      { name: 'Autre', value: 1 },
    ])
  })
})
