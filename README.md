# 🎬 Outdoor Movie Time

A simple, responsive web application that determines when it's dark enough to start an outdoor movie based on location and provides optimal start times.

## 🌟 Features

- **Location Detection**: Browser geolocation or manual zipcode entry
- **Accurate Timing**: Civil twilight calculations for optimal movie viewing
- **Real-time Countdown**: Live countdown to movie start time
- **Mobile-First Design**: Dark theme optimized for outdoor evening use
- **Weather Integration**: Cloud cover considerations for viewing conditions

## 🚀 Quick Start

1. Clone the repository
2. Open `index.html` in your browser
3. Allow location access or enter your zipcode
4. Get your optimal movie start time!

## 🛠️ Development

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes

### Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd outdoor-movie-time

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "Add your feature"

# Push and create pull request
git push origin feature/your-feature-name
```

## 📱 Design

Inspired by the Opal Technical Specifications app with:
- Dark theme for low-light outdoor use
- Expandable sections for organized information
- Clean typography and minimalist aesthetic
- Mobile-first responsive design

## 🌐 APIs Used

- Browser Geolocation API
- Sunset/Sunrise API (sunset-sunrise.org)
- Zipcode to coordinates conversion
- Weather data for cloud cover

## 📄 License

MIT License - see LICENSE file for details
