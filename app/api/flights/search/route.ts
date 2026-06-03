import { NextResponse } from 'next/server'
import { type Flight, type SearchParams } from '@/types/flight'

type OpenSkyState = {
  icao24: string
  callsign: string | null
  origin_country: string
  time_position: number | null
  last_contact: number
  longitude: number | null
  latitude: number | null
  baro_altitude: number | null
  on_ground: boolean
  velocity: number | null
  true_track: number | null
  vertical_rate: number | null
  sensors: number[] | null
  geo_altitude: number | null
  squawk: string | null
  spi: boolean
  position_source: number
}

type OpenSkyResponse = {
  time: number
  states: OpenSkyState[] | null
}

type AviationStackFlight = {
  flight_date: string
  flight_status: string
  departure: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string | null
    gate: string | null
    delay: number | null
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway: string | null
    actual_runway: string | null
  }
  arrival: {
    airport: string
    timezone: string
    iata: string
    icao: string
    terminal: string | null
    gate: string | null
    baggage: string | null
    delay: number | null
    scheduled: string
    estimated: string
    actual: string | null
    estimated_runway: string | null
    actual_runway: string | null
  }
  airline: {
    name: string
    iata: string
    icao: string
  }
  aircraft: {
    registration: string
    iata: string
    icao: string
    icao24: string
  } | null
  flight: {
    number: string
    iata: string
    icao: string
  }
}

const OPENSKY_API_URL = process.env.OPENSKY_API_URL || process.env.NEXT_PUBLIC_OPENSKY_API_URL || 'https://opensky-network.org/api'
const AVIATIONSTACK_API_URL = process.env.AVIATIONSTACK_API_URL || process.env.NEXT_PUBLIC_AVIATIONSTACK_API_URL || 'http://api.aviationstack.com/v1'
const OPENSKY_USERNAME = process.env.OPENSKY_USERNAME || process.env.NEXT_PUBLIC_OPENSKY_USERNAME
const OPENSKY_PASSWORD = process.env.OPENSKY_PASSWORD || process.env.NEXT_PUBLIC_OPENSKY_PASSWORD
const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY || process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY

function mapAviationStackFlightToFlight(flight: AviationStackFlight, index: number): Flight {
  const registration = flight.aircraft?.registration || 'Unknown'
  const aircraftType = flight.aircraft?.iata || flight.aircraft?.icao || 'Unknown'

  return {
    id: `${flight.flight.iata}-${index}-${Date.now()}`,
    flightNumber: `${flight.airline.iata}${flight.flight.number}`,
    airline: flight.airline.name,
    aircraftType,
    registration,
    status: flight.flight_status,
    departure: {
      iata: flight.departure.iata,
      icao: flight.departure.icao,
      airport: flight.departure.airport,
      scheduledTime: flight.departure.scheduled,
      actualTime: flight.departure.actual,
    },
    arrival: {
      iata: flight.arrival.iata,
      icao: flight.arrival.icao,
      airport: flight.arrival.airport,
      scheduledTime: flight.arrival.scheduled,
      actualTime: flight.arrival.actual,
    },
    altitude: null,
    speed: null,
    heading: null,
    latitude: null,
    longitude: null,
    lastUpdate: new Date().toISOString(),
  }
}

function mapOpenSkyFlightToFlight(state: OpenSkyState, index: number): Flight {
  const callsign = state.callsign?.trim() || 'Unknown'
  const icao24 = state.icao24 || 'Unknown'

  return {
    id: `${icao24}-${index}-${Date.now()}`,
    flightNumber: callsign,
    airline: state.origin_country || 'Unknown',
    aircraftType: 'Unknown',
    registration: icao24,
    status: state.on_ground ? 'On Ground' : 'In Air',
    departure: {
      iata: 'Unknown',
      icao: 'Unknown',
      airport: 'Unknown',
      scheduledTime: null,
      actualTime: null,
    },
    arrival: {
      iata: 'Unknown',
      icao: 'Unknown',
      airport: 'Unknown',
      scheduledTime: null,
      actualTime: null,
    },
    altitude: state.baro_altitude,
    speed: state.velocity,
    heading: state.true_track,
    latitude: state.latitude,
    longitude: state.longitude,
    lastUpdate: new Date(state.last_contact * 1000).toISOString(),
  }
}

async function getFlightsByFlightNumber(flightNumber: string): Promise<AviationStackFlight[]> {
  if (!AVIATIONSTACK_API_KEY) {
    throw new Error('Missing AVIATIONSTACK_API_KEY. Create a .env.local file and add your Aviationstack API key.')
  }

  const url = new URL('/flights', AVIATIONSTACK_API_URL)
  url.searchParams.set('access_key', AVIATIONSTACK_API_KEY)
  url.searchParams.set('flight_iata', flightNumber.toUpperCase())
  url.searchParams.set('limit', '10')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Aviationstack request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as { data?: AviationStackFlight[]; error?: { message?: string } }
  if (payload.error?.message) {
    throw new Error(payload.error.message)
  }

  return payload.data || []
}

async function getFlightsByAirline(airlineName: string): Promise<AviationStackFlight[]> {
  if (!AVIATIONSTACK_API_KEY) {
    throw new Error('Missing AVIATIONSTACK_API_KEY. Create a .env.local file and add your Aviationstack API key.')
  }

  const url = new URL('/flights', AVIATIONSTACK_API_URL)
  url.searchParams.set('access_key', AVIATIONSTACK_API_KEY)
  url.searchParams.set('airline_iata', airlineName.toUpperCase())
  url.searchParams.set('limit', '10')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`Aviationstack request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as { data?: AviationStackFlight[]; error?: { message?: string } }
  if (payload.error?.message) {
    throw new Error(payload.error.message)
  }

  return payload.data || []
}

async function getFlightsByRegistration(registration: string): Promise<OpenSkyState[]> {
  if (!OPENSKY_USERNAME || !OPENSKY_PASSWORD) {
    throw new Error('Missing OPENSKY_USERNAME or OPENSKY_PASSWORD. Create a .env.local file and add your OpenSky credentials.')
  }

  const url = new URL('/states/all', OPENSKY_API_URL)
  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Basic ${Buffer.from(`${OPENSKY_USERNAME}:${OPENSKY_PASSWORD}`).toString('base64')}`,
    },
  })

  if (!response.ok) {
    throw new Error(`OpenSky request failed with status ${response.status}`)
  }

  const payload = (await response.json()) as OpenSkyResponse
  if (!payload.states) {
    return []
  }

  return payload.states.filter(
    (state) =>
      state.callsign?.toLowerCase().includes(registration.toLowerCase()) ||
      state.icao24?.toLowerCase().includes(registration.toLowerCase())
  )
}

export async function POST(request: Request) {
  try {
    const params = (await request.json()) as SearchParams
    const flights: Flight[] = []

    if (params.flightNumber) {
      const aviationFlights = await getFlightsByFlightNumber(params.flightNumber)
      flights.push(...aviationFlights.map((flight, index) => mapAviationStackFlightToFlight(flight, index)))
    }

    if (params.airline) {
      const aviationFlights = await getFlightsByAirline(params.airline)
      flights.push(...aviationFlights.map((flight, index) => mapAviationStackFlightToFlight(flight, index)))
    }

    if (params.registration) {
      const openSkyFlights = await getFlightsByRegistration(params.registration)
      flights.push(...openSkyFlights.map((state, index) => mapOpenSkyFlightToFlight(state, index)))
    }

    const uniqueFlights = Array.from(new Map(flights.map((flight) => [flight.flightNumber, flight])).values())

    return NextResponse.json({ flights: uniqueFlights.slice(0, 50) })
  } catch (error) {
    console.error('Flight search route error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch flight data',
      },
      { status: 500 }
    )
  }
}
