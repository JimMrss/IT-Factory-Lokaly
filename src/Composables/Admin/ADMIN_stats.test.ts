import { describe, it, expect, vi, beforeEach } from 'vitest'
import { B_admin_stats } from './ADMIN_stats'
import { B_Annonces } from '../BRIDGE_annonces'
import { B_groupes } from '../BRIDGE_groupe'
import { B_users } from '../BRIDGE_users'
import { B_Evenements } from '../BRIDGE_evenements'

// On mocke les bridges pour ne pas appeler la vraie API
vi.mock('../BRIDGE_annonces', () => ({ B_Annonces: vi.fn() }))
vi.mock('../BRIDGE_groupe', () => ({ B_groupes: vi.fn() }))
vi.mock('../BRIDGE_users', () => ({ B_users: vi.fn() }))
vi.mock('../BRIDGE_evenements', () => ({ B_Evenements: vi.fn() }))

const mockedAnnonces = vi.mocked(B_Annonces)
const mockedGroupes = vi.mocked(B_groupes)
const mockedUsers = vi.mocked(B_users)
const mockedEvenements = vi.mocked(B_Evenements)

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

  it('getStatsByGroup compte annonces et membres par groupe', async () => {
    mockedGroupes.mockReturnValue({
      getAllGroups: vi.fn().mockResolvedValue([
        { name: 'Quartier Nord', annonces: [{ id: 1 }, { id: 2 }], members: [{ id: 1 }] },
        { name: 'Quartier Sud' },
      ]),
    } as never)

    const { getStatsByGroup } = B_admin_stats()
    const result = await getStatsByGroup()

    expect(result).toEqual([
      { name: 'Quartier Nord', annonces: 2, membres: 1 },
      { name: 'Quartier Sud', annonces: 0, membres: 0 },
    ])
  })

  it('getDashboardStats totalise chaque ressource', async () => {
    mockedAnnonces.mockReturnValue({
      getAllAnnonces: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }, { id: 3 }]),
    } as never)
    mockedUsers.mockReturnValue({
      getAllUsers: vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    } as never)
    mockedGroupes.mockReturnValue({
      getAllGroups: vi.fn().mockResolvedValue([{ id: 1 }]),
    } as never)
    mockedEvenements.mockReturnValue({
      getAllEvenements: vi.fn().mockResolvedValue([]),
    } as never)

    const { getDashboardStats } = B_admin_stats()
    const result = await getDashboardStats()

    expect(result).toEqual({
      total_annonces: 3,
      total_users: 2,
      total_groupes: 1,
      total_evenements: 0,
      taux_participation: 0,
    })
  })

  it('getMonthlyActivity regroupe annonces et evenements par mois', async () => {
    mockedAnnonces.mockReturnValue({
      getAllAnnonces: vi.fn().mockResolvedValue([
        { id: 1, date: '2026-07-01' },
        { id: 2, date: '2026-07-15' },
      ]),
    } as never)
    mockedEvenements.mockReturnValue({
      getAllEvenements: vi.fn().mockResolvedValue([{ id: 1, date: '2026-09-02' }]),
    } as never)

    const { getMonthlyActivity } = B_admin_stats()
    const result = await getMonthlyActivity()

    expect(result).toEqual([
      { mois: 'Juil', annonces: 2, evenements: 0 },
      { mois: 'Sept', annonces: 0, evenements: 1 },
    ])
  })
})
