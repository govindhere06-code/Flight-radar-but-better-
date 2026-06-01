'use client'

import { FlightCard } from './flight-card'
import { type Flight } from '@/types/flight'

interface FlightResultsProps {
  flights: Flight[]
}

export function FlightResults({ flights }: FlightResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  )
}
