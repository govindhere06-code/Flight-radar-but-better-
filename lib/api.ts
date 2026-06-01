import axios from 'axios'
import { type Flight, type SearchParams } from '@/types/flight'

const OPENSKY_API_URL = process.env.NEXT_PUBLIC_OPENSKY_API_URL || 'https://opensky-network.org/api'
const AVIATIONSTACK_API_URL = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_URL || 'http://api.aviationstack.com/v1'

const OPENSKY_USERNAME = process.env.NEXT_PUBLIC_OPENSKY_USERNAME
const OPENSKY_PASSWORD = process.env.NEXT_PUBLIC_OPENSKY_PASSWORD
const AVIATIONSTACK_API_KEY = process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY

// Create axios instances
const openSkyClient = axios.create({
  baseURL: OPENSKY_API_URL,
  auth:
    OPENSKY_USERNAME && OPENSKY_PASSWORD
      ? {
          username: OPENSKY_USERNAME,
          password: OPENSKY_PASSWORD,
        }
      : undefined,
})

const aviationStackClient = axios.create({
  baseURL: AVIATIONSTACK_API_URL,
  params: {
    access_key: AVIATIONSTACK_API_KEY,
  },
})

interface OpenSkyState {
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

interface OpenSkyResponse {
  time: number
  states: OpenSkyState[] | null
}

interface AviationStackFlight {
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

async function getFlightsByFlightNumber(
  flightNumber: string
): Promise<AviationStackFlight[]> {
  try {
    if (!AVIATIONSTACK_API_KEY) {
      console.warn('Aviationstack API key not configured')
      return []
    }

    // Search for flights using flight number
    const response = await aviationStackClient.get<{
      data: AviationStackFlight[]
    }>('/flights', {
      params: {
        flight_iata: flightNumber.toUpperCase(),
        limit: 10,
      },
    })

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching from Aviationstack:', error)
    throw new Error('Failed to fetch flight data from Aviationstack')
  }
}

async function getFlightsByAirline(airlineName: string): Promise<AviationStackFlight[]> {
  try {
    if (!AVIATIONSTACK_API_KEY) {
      console.warn('Aviationstack API key not configured')
      return []
    }

    const response = await aviationStackClient.get<{
      data: AviationStackFlight[]
    }>('/flights', {
      params: {
        airline_iata: airlineName.toUpperCase(),
        limit: 10,
      },
    })

    return response.data.data || []
  } catch (error) {
    console.error('Error fetching from Aviationstack:', error)
    throw new Error('Failed to fetch flight data')
  }
}

async function getFlightsByRegistration(
  registration: string
): Promise<OpenSkyState[]> {
  try {
    // First, we need to get all states and filter by registration
    // This is a limitation of OpenSky API - it doesn't directly search by registration
    const response = await openSkyClient.get<OpenSkyResponse>('/states/all')

    if (!response.data.states) {
      return []
    }

    // Filter states by the callsign (which may contain registration info)
    return response.data.states.filter(
      (state) =>
        state.callsign?.toLowerCase().includes(registration.toLowerCase()) ||
        state.icao24?.toLowerCase().includes(registration.toLowerCase())
    )
  } catch (error) {
    console.error('Error fetching from OpenSky:', error)
    throw new Error('Failed to fetch flight data from OpenSky')
  }
}

function mapAviationStackFlightToFlight(
  flight: AviationStackFlight,
  index: number
): Flight {
  const registration = flight.aircraft?.registration || 'Unknown'
  const aircraftType = flight.aircraft?.iata || flight.aircraft?.icao || 'Unknown'

  return {
    id: `${flight.flight.iata}-${index}-${Date.now()}`,
    flightNumber: `${flight.airline.iata}${flight.flight.number}`,
    airline: flight.airline.name,
    aircraftType: aircraftType,
    registration: registration,
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

function mapOpenSkyFlightToFlight(
  state: OpenSkyState,
  index: number
): Flight {
  // Extract flight number from callsign
  const callsign = state.callsign?.trim() || 'Unknown'
  const icao24 = state.icao24 || 'Unknown'

  return {
    id: `${icao24}-${index}-${Date.now()}`,
    flightNumber: callsign,
    airline: state.origin_country || 'Unknown',
    aircraftType: 'Unknown', // OpenSky doesn't provide aircraft type directly
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

export async function searchFlights(params: SearchParams): Promise<Flight[]> {
  const flights: Flight[] = []

  try {
    if (params.flightNumber) {
      // Search by flight number using Aviationstack
      const aviationFlights = await getFlightsByFlightNumber(params.flightNumber)
      flights.push(...aviationFlights.map((f, i) => mapAviationStackFlightToFlight(f, i)))
    }

    if (params.airline) {
      // Search by airline using Aviationstack
      const aviationFlights = await getFlightsByAirline(params.airline)
      flights.push(...aviationFlights.map((f, i) => mapAviationStackFlightToFlight(f, i)))
    }

    if (params.registration) {
      // Search by registration using OpenSky
      const openSkyFlights = await getFlightsByRegistration(params.registration)
      flights.push(...openSkyFlights.map((state, i) => mapOpenSkyFlightToFlight(state, i)))
    }

    // Remove duplicates based on flight number
    const uniqueFlights = Array.from(
      new Map(flights.map((f) => [f.flightNumber, f])).values()
    )

    return uniqueFlights.slice(0, 50) // Limit to 50 results
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}
