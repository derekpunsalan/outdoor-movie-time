# Outdoor Movie Time - Web App Plan

## 🎯 **Core Concept**
A simple, responsive web application that determines when it's dark enough to start an outdoor movie based on location (zipcode or browser geolocation) and provides optimal start times.

## 🏗️ **Technology Stack**
- **Frontend**: HTML5, CSS3, JavaScript (React/Vue))
- **APIs**: 
  - Geolocation API (browser native)
  - Sunset/Sunrise API (Sunset API, OpenWeatherMap, or similar)
  - Zipcode to coordinates conversion (if needed)
- **Deployment**: Static hosting (GitHub Pages)

## ✨ **Key Features**

### **Location Input Methods**
1. **Browser Geolocation** (primary)
   - One-click "Use My Location" button
   - Automatic permission request
   - Fallback to manual zipcode entry

2. **Manual Zipcode Entry**
   - Input field with validation (only accept zipcodes)
   - Auto-complete suggestions, zipcodes should autocomplete to town/city name to be more human readable
   - Error handling for invalid zipcodes

### **Darkness Calculation Logic**
- **Civil Twilight End**: When sun is 6° below horizon (recommended for outdoor movies)
- **Nautical Twilight End**: When sun is 12° below horizon (darker option)
- **Astronomical Twilight End**: When sun is 18° below horizon (very dark)

### **Time Display & Recommendations**
- **Optimal Start Time**: Civil twilight end + 15-30 minutes buffer
- **Alternative Times**: Show all three twilight options
- **Countdown Timer**: "Movie time in X hours Y minutes"
- **Weather Consideration**: Basic cloud cover impact

## 🎨 **User Interface Design**

### **Design Inspiration: Opal Technical Specifications App**
Based on the Opal app's dark, minimalist design with expandable sections and clean typography.

### **Main Screen Layout (Mobile-First)**
```
┌─────────────────────────────────────┐
│  🎬 Outdoor Movie Time        [🌙]  │
│  Today's Movie Times        01-09   │
├─────────────────────────────────────┤
│  01 Current Status                  │
│     📍 San Francisco, CA            │
│     ⏰ 2h 15m until movie time      │
│     [Get My Location]               │
├─────────────────────────────────────┤
│  02 Sunset & Twilight Times         │
│     🌅 Sunset: 7:23 PM              │
│     🌆 Civil Twilight: 7:50 PM      │
│     🎬 Recommended Start: 8:05 PM   │
├─────────────────────────────────────┤
│  03 Tomorrow's Forecast             │
│  04 Settings                        │
│  05 About                           │
└─────────────────────────────────────┘
```

### **Design System (Inspired by Opal)**
- **Background**: Dark charcoal (#1A1A1A) for low-light outdoor use
- **Typography**: Clean sans-serif (Inter/SF Pro) with clear hierarchy
- **Sections**: Expandable/collapsible numbered sections (01, 02, 03...)
- **Icons**: Minimalist line art icons (moon, projector, clock)
- **Interactive Elements**: Pill-shaped buttons with white background
- **Color Palette**: 
  - Primary: White text on dark background
  - Secondary: Light gray for labels
  - Accent: White buttons with dark text
  - Status: Green for "ready", orange for "soon", red for "not yet"

### **Key UI Elements**
- **Header**: App name + custom icon (moon/projector symbol)
- **Expandable Sections**: Collapsible content areas with + / - indicators
- **Location Display**: Clean city/state format with zipcode fallback
- **Time Display**: Large, bold times with clear labels
- **Call-to-Action**: Prominent "Get Movie Time" button
- **Visual Hierarchy**: Clear information priority with consistent spacing

## 🔧 **Technical Implementation**

### **Phase 1: Core Functionality**
1. Location detection (geolocation + zipcode)
2. Sunset/sunrise API integration
3. Basic darkness calculation
4. Simple time display

### **Phase 2: Enhanced Features**
1. Multiple twilight options
2. Weather integration
3. Countdown timer
4. Local storage for preferences

### **Phase 3: Polish & Optimization**
1. Responsive design refinement
2. Error handling improvements
3. Performance optimization
4. PWA features (offline capability)

## 📱 **User Experience Flow**

1. **Landing**: User opens app, sees location prompt
2. **Location**: Either auto-detect or manual entry
3. **Results**: Display optimal movie start time with countdown
4. **Refresh**: Update times as day progresses
5. **Share**: Send movie time to friends

## 🌐 **APIs & Data Sources**

### **Sunset/Sunrise Data**
- **Sunset API** (sunset-sunrise.org) - Free tier available
- **OpenWeatherMap** - Includes weather + sunset data
- **TimeZoneDB** - For accurate timezone handling

### **Location Services**
- **Browser Geolocation API** - Native browser support
- **Zipcode API** - Convert zipcode to lat/lng coordinates
- **Reverse Geocoding** - Convert coordinates to location names

## 🎯 **Success Metrics**
- Fast load time (< 3 seconds)
- Accurate time calculations (±5 minutes)
- Works offline (cached data)
- Mobile-friendly interface
- Easy sharing functionality

## 🚀 **Deployment Strategy**
- Static site hosting (Netlify/Vercel)
- Custom domain (optional)
- HTTPS required for geolocation
- Progressive Web App features

## 📝 **Notes**
- This plan can be modified and updated as needed
- Consider adding features like:
  - Movie recommendations based on time available
  - Integration with weather apps
  - Social sharing with movie details
  - Calendar integration for planning
