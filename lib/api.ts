import { type Flight, type SearchParams } from '@/types/flight'

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  try {
    const response = await fetch('/api/flights/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      throw new Error(payload?.error || 'Failed to fetch flight data')
    }

    const payload = (await response.json()) as { flights?: Flight[] }
    return payload.flights ?? []
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}
