'use client'

import { useState } from 'react'
import { type Flight, type SearchParams } from '@/types/flight'
import { searchFlights } from '@/lib/api'

export function useFlightSearch() {
  const [results, setResults] = useState<Flight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (params: SearchParams) => {
    setLoading(true)
    setError(null)
    setResults([])

    try {
      const flights = await searchFlights(params)
      setResults(flights)

      if (flights.length === 0) {
        setError('No flights found. Try a different search.')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search flights'
      setError(message)
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    results,
    loading,
    error,
    searchFlights: search,
  }
}
