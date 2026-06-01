export interface Flight {
  id: string
  flightNumber: string
  airline: string
  aircraftType: string
  registration: string
  status: string
  departure: {
    iata: string
    icao: string
    airport: string
    scheduledTime: string | null
    actualTime: string | null
  }
  arrival: {
    iata: string
    icao: string
    airport: string
    scheduledTime: string | null
    actualTime: string | null
  }
  altitude: number | null
  speed: number | null
  heading: number | null
  latitude: number | null
  longitude: number | null
  lastUpdate: string
}

export interface SearchParams {
  flightNumber?: string
  airline?: string
  registration?: string
}
