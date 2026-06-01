'use client'

import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { type Flight } from '@/types/flight'
import { MapPin, Clock, Plane } from 'lucide-react'

interface FlightCardProps {
  flight: Flight
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'in air':
    case 'airborne':
      return 'bg-green-500/20 text-green-700 dark:text-green-400'
    case 'scheduled':
    case 'active':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-400'
    case 'landed':
    case 'completed':
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-400'
    case 'cancelled':
      return 'bg-red-500/20 text-red-700 dark:text-red-400'
    default:
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
  }
}

export function FlightCard({ flight }: FlightCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border/40 h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {flight.flightNumber}
            </h3>
            <p className="text-sm text-muted-foreground">{flight.airline}</p>
          </div>
          <Badge className={getStatusColor(flight.status)}>
            {flight.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-4">
        {/* Aircraft Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Plane className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{flight.aircraftType}</p>
              <p className="text-xs text-muted-foreground">Registration: {flight.registration}</p>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {flight.departure.iata || flight.departure.icao} → {flight.arrival.iata || flight.arrival.icao}
              </p>
              <p className="text-xs text-muted-foreground">
                {flight.departure.airport} to {flight.arrival.airport}
              </p>
            </div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">DEPARTURE</p>
            {flight.departure.scheduledTime ? (
              <>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(flight.departure.scheduledTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(flight.departure.scheduledTime).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium mb-1">ARRIVAL</p>
            {flight.arrival.scheduledTime ? (
              <>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(flight.arrival.scheduledTime).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(flight.arrival.scheduledTime).toLocaleDateString()}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">N/A</p>
            )}
          </div>
        </div>

        {/* Flight Metrics */}
        {flight.altitude !== null || flight.speed !== null ? (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
            {flight.altitude !== null && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">ALTITUDE</p>
                <p className="text-sm font-semibold text-foreground">{flight.altitude} ft</p>
              </div>
            )}
            {flight.speed !== null && (
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">SPEED</p>
                <p className="text-sm font-semibold text-foreground">{Math.round(flight.speed)} knots</p>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
