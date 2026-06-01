# Flight Radar - Better Edition

A modern, beautifully designed flight tracking website built with Next.js, Tailwind CSS, and shadcn/ui.

## Features

✈️ **Real-time Flight Tracking**
- Search flights by flight number, airline name, or aircraft registration
- Get detailed flight information including status, altitude, speed, and more

🎨 **Modern UI with Theme Support**
- Beautiful, responsive design
- Dark and light theme toggle
- Smooth animations and transitions

📱 **Responsive Design**
- Works perfectly on desktop, tablet, and mobile devices
- Optimized performance with Next.js

🔄 **Real-time Data**
- Integration with OpenSky Network API for live flight data
- Integration with Aviationstack API for flight schedules and airline information

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Hooks
- **API Integration**: Axios
- **Theming**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Flight-radar-but-better-.git
cd Flight-radar-but-better-
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your API credentials:

**OpenSky Network API:**
- Sign up at: https://opensky-network.org/
- Add your username and password:
```
NEXT_PUBLIC_OPENSKY_USERNAME=your_username
NEXT_PUBLIC_OPENSKY_PASSWORD=your_password
```

**Aviationstack API:**
- Sign up at: https://aviationstack.com/
- Get your free API key
- Add to `.env.local`:
```
NEXT_PUBLIC_AVIATIONSTACK_API_KEY=your_api_key
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Keys

### Free APIs Used

1. **OpenSky Network** - Free with registration
   - Provides real-time ADS-B aircraft data
   - Limit: 4,000 requests/day for registered users
   - No commercial restrictions for non-commercial use
   - Website: https://opensky-network.org/

2. **Aviationstack** - Free tier available
   - Provides flight schedules and detailed flight information
   - Limit: 100 requests/month on free tier
   - Website: https://aviationstack.com/

## Project Structure

```
.
├── app/
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Home page with search and results
│   └── globals.css          # Global styles and theme colors
├── components/
│   ├── ui/                  # shadcn/ui components (button, input, card, etc.)
│   ├── navbar.tsx           # Navigation bar with theme toggle
│   ├── search-panel.tsx     # Search interface
│   ├── flight-results.tsx   # Results grid
│   ├── flight-card.tsx      # Individual flight card
│   ├── loading-spinner.tsx  # Loading state
│   ├── error-alert.tsx      # Error message
│   └── theme-*.tsx          # Theme provider components
├── hooks/
│   └── use-flight-search.ts # Custom hook for flight search
├── lib/
│   ├── api.ts               # API integration with OpenSky and Aviationstack
│   └── utils.ts             # Utility functions
├── types/
│   └── flight.ts            # TypeScript types and interfaces
├── .env.local.example       # Example environment variables
└── README.md                # This file
```

## Usage

1. **Search by Flight Number**
   - Enter the flight number (e.g., BA123, AA456)
   - Click "Search Flights"

2. **Search by Airline**
   - Switch to the "Airline" tab
   - Enter airline name or IATA code
   - Click "Search Flights"

3. **Search by Aircraft Registration**
   - Switch to the "Registration" tab
   - Enter aircraft registration (e.g., N1234, G-ABCD)
   - Click "Search Flights"

## Features Explained

### Flight Card Information

- **Flight Number**: Unique identifier for the flight
- **Airline**: Operating airline name
- **Aircraft Type**: Type of aircraft operating the flight
- **Registration**: Aircraft registration number
- **Status**: Current flight status (In Air, Landed, Scheduled, etc.)
- **Route**: Departure and arrival airports
- **Times**: Scheduled and actual departure/arrival times
- **Altitude**: Current altitude (if airborne)
- **Speed**: Current ground speed in knots (if airborne)

### Theme System

- Click the sun/moon icon in the top-right to toggle themes
- Preference is automatically saved
- System preference is respected on first visit

## Limitations

- OpenSky API has a 4,000 requests/day limit for free tier
- Aviationstack free tier is limited to 100 requests/month
- Real-time aircraft position data is only available for flights with ADS-B transponders
- Some airlines may not have detailed flight information available

## Future Enhancements

- [ ] Add flight history/statistics
- [ ] Save favorite flights and airlines
- [ ] Email notifications for flight status changes
- [ ] Advanced filtering options
- [ ] Flight comparison tool
- [ ] API caching layer for better performance

## Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Disclaimer

This project uses publicly available APIs. Please respect the terms of service for each API:
- OpenSky Network: https://opensky-network.org/about/terms-of-service
- Aviationstack: https://aviationstack.com/

Make sure to obtain proper API keys and follow their respective terms of service.
