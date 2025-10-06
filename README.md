# Ein tierischer Segelsommer 2012 🐾⛵

[![Netlify Status](https://api.netlify.com/api/v1/badges/666f8a79-a58c-4981-b24e-01bedcfe1a4a/deploy-status)](https://app.netlify.com/sites/pedantic-bose-aa3de2/deploys)

An interactive web application visualizing a 2012 sailing journey through the Baltic Sea. Built with SvelteKit and OpenLayers, the application combines an interactive map with a blog-style logbook to tell the story of a memorable sailing adventure.

🌐 **Live Site**: [www.ein-tierischer-segelsommer.de](https://www.ein-tierischer-segelsommer.de)

## Features

- 🗺️ **Interactive Map** - Navigate the complete sailing route with OpenLayers
- 📍 **Clustered Markers** - Logbook entries displayed as intelligent clusters
- 🧭 **Nautical Charts** - OpenSeaMap overlay for authentic maritime visualization
- 📖 **Timeline View** - Chronological journey through all entries
- 🖼️ **Image Galleries** - Swiper-powered photo slideshows
- 📱 **Responsive Design** - Optimized for desktop and mobile devices
- ⚡ **Static Generation** - Pre-rendered for optimal performance

## Technology Stack

- **Framework**: [SvelteKit 2.x](https://kit.svelte.dev/) with Svelte 5 (runes API)
- **Mapping**: [OpenLayers 10.x](https://openlayers.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: SCSS with modern CSS
- **Testing**: Vitest + Testing Library
- **Deployment**: Netlify (static site)

## Project Structure

```
src/
├── lib/
│   ├── components/     # Svelte UI components
│   ├── ol/            # OpenLayers configuration (layers, overlays, map)
│   ├── utils/         # Utility functions
│   ├── types.ts       # TypeScript definitions
│   └── stores.ts      # State management
├── routes/            # SvelteKit file-based routing
│   ├── +page.svelte          # Map view (home)
│   ├── log/[id]/+page.svelte # Individual logbook entry
│   └── timeline/+page.svelte  # Timeline view
└── tools/             # Build scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jansinger/tss2012.git
cd tss2012

# Install dependencies
npm install
```

### Development

Start the development server:

```bash
npm run dev

# Or open in browser automatically
npm run dev -- --open
```

The app will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests in watch mode
npm run check        # TypeScript + Svelte validation
npm run lint         # Run ESLint + Prettier checks
npm run format       # Auto-format code with Prettier
npm run build-ci     # Full CI build (build + test)
```

## Building for Production

```bash
npm run build
```

The static site will be generated in the `build/` directory, ready for deployment.

> **Note**: The preview command (`npm run preview`) is for local testing only and should not be used in production.

## Testing

The project uses Vitest with Testing Library for component and unit testing:

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run build-ci
```

## Deployment

The application is automatically deployed to Netlify on every push to the main branch:

1. Code pushed to GitHub
2. Netlify runs `npm run build-ci` (includes tests)
3. Static files from `build/` are deployed
4. CSP headers configured in [netlify.toml](netlify.toml)

## Documentation

For detailed technical documentation, architecture guidelines, and development patterns, see [CLAUDE.md](CLAUDE.md).

Topics covered:

- Architecture & design patterns (DRY, KISS, SOLID)
- OpenLayers integration guide
- State management (Svelte 5 runes + stores)
- Component structure and conventions
- Data flow diagrams
- Troubleshooting guide

## Data Sources

- **Logbook Entries**: GeoJSON format in `/static/data/logbook_geo.json`
- **Sailing Track**: KML format in `/static/data/segelsommer2012.kml`
- **Images**: Static files in `/static/images/`

## Map Layers

1. **OpenStreetMap** - Base map tiles
2. **OpenSeaMap** - Nautical chart overlay
3. **Track Layer** - Sailing route (red line)
4. **Logbook Layer** - Clustered entry markers

## Browser Support

Modern browsers with ES2021 support:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- Tests pass (`npm run test`)
- Code is formatted (`npm run format`)
- TypeScript validation passes (`npm run check`)

## License

This project is personal/private. Please contact the repository owner for licensing information.

## Acknowledgments

- [OpenLayers](https://openlayers.org/) - Powerful mapping library
- [SvelteKit](https://kit.svelte.dev/) - Amazing framework
- [OpenSeaMap](https://www.openseamap.org/) - Nautical charts
- [OpenStreetMap](https://www.openstreetmap.org/) - Map data

---

**Built with** ❤️ **using SvelteKit and OpenLayers**
