'use client'

import { SearchPanel } from '@/components/search-panel'
import { FlightResults } from '@/components/flight-results'
import { LoadingSpinner } from '@/components/loading-spinner'
import { ErrorAlert } from '@/components/error-alert'
import { useFlightSearch } from '@/hooks/use-flight-search'

export default function Home() {
  const {
    results,
    loading,
    error,
    searchFlights,
  } = useFlightSearch()

  const handleSearch = async (searchParams: {
    flightNumber?: string
    airline?: string
    registration?: string
  }) => {
    await searchFlights(searchParams)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Flight Radar
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search and track flights in real-time using flight number, airline name, or aircraft registration
          </p>
        </div>

        {/* Search Panel */}
        <div className="mb-12">
          <SearchPanel onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                Found {results.length} flight{results.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <FlightResults flights={results} />
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">✈️</div>
            <p className="text-xl text-muted-foreground mb-2">No flights found</p>
            <p className="text-sm text-muted-foreground">
              Try searching with a flight number, airline name, or aircraft registration
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
