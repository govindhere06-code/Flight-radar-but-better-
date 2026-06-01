'use client'

import { useState } from 'react'
import { Search, AlertCircle } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface SearchPanelProps {
  onSearch: (params: {
    flightNumber?: string
    airline?: string
    registration?: string
  }) => void
  isLoading: boolean
}

export function SearchPanel({ onSearch, isLoading }: SearchPanelProps) {
  const [activeTab, setActiveTab] = useState('flight-number')
  const [flightNumber, setFlightNumber] = useState('')
  const [airline, setAirline] = useState('')
  const [registration, setRegistration] = useState('')

  const handleSearch = () => {
    const params: any = {}

    if (activeTab === 'flight-number' && flightNumber.trim()) {
      params.flightNumber = flightNumber.trim()
    } else if (activeTab === 'airline' && airline.trim()) {
      params.airline = airline.trim()
    } else if (activeTab === 'registration' && registration.trim()) {
      params.registration = registration.trim()
    }

    if (Object.keys(params).length > 0) {
      onSearch(params)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className="border-border/40 shadow-lg">
      <CardHeader>
        <CardTitle>Search Flights</CardTitle>
        <CardDescription>
          Find flights by flight number, airline name, or aircraft registration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="flight-number">Flight Number</TabsTrigger>
            <TabsTrigger value="airline">Airline</TabsTrigger>
            <TabsTrigger value="registration">Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="flight-number" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Flight Number
              </label>
              <Input
                placeholder="e.g., BA123, AA456, DL789"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Enter the flight number (airline code + numeric code)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="airline" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Airline Name
              </label>
              <Input
                placeholder="e.g., British Airways, American Airlines"
                value={airline}
                onChange={(e) => setAirline(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Enter the airline name or IATA code
              </p>
            </div>
          </TabsContent>

          <TabsContent value="registration" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Aircraft Registration
              </label>
              <Input
                placeholder="e.g., N1234, G-ABCD, D-AIRB"
                value={registration}
                onChange={(e) => setRegistration(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="bg-input"
              />
              <p className="text-xs text-muted-foreground">
                Enter the aircraft registration number
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/40 flex gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm text-foreground">
            <p className="font-semibold mb-1">💡 Tip:</p>
            <p>
              For best results, use flight numbers (e.g., <span className="font-mono bg-background px-1 rounded">BA123</span>) or
              aircraft registration (e.g., <span className="font-mono bg-background px-1 rounded">N1234</span>)
            </p>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full mt-6 h-10 gap-2"
          size="lg"
        >
          <Search className="w-4 h-4" />
          {isLoading ? 'Searching...' : 'Search Flights'}
        </Button>
      </CardContent>
    </Card>
  )
}
