import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [location, setLocation] = useState(null)
  const [coordinates, setCoordinates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [movieTime, setMovieTime] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showLocationEdit, setShowLocationEdit] = useState(false)

  // Function to fetch real sunset/twilight times from API
  const fetchSunsetData = async (latitude, longitude, date) => {
    try {
      const dateStr = date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${dateStr}&formatted=0`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch sunset data')
      }
      
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error('API returned error status')
      }
      
      const results = data.results
      
      // Convert UTC times to local time
      const formatTime = (utcTimeString) => {
        const date = new Date(utcTimeString)
        return date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        })
      }
      
      // Calculate recommended start time (15 minutes after civil twilight end)
      const civilTwilightEnd = new Date(results.civil_twilight_end)
      const recommendedStart = new Date(civilTwilightEnd.getTime() + 15 * 60 * 1000)
      
      return {
        sunset: formatTime(results.sunset),
        civilTwilight: formatTime(results.civil_twilight_end),
        recommendedStart: formatTime(recommendedStart.toISOString()),
        location: location || "San Francisco, CA"
      }
    } catch (error) {
      console.error('Error fetching sunset data:', error)
      // Fallback to mock data if API fails
      return getMockData(date)
    }
  }

  // Fallback mock data function
  const getMockData = (date) => {
    const month = date.getMonth()
    const day = date.getDate()
    
    // Simulate seasonal variation in sunset times
    const baseHour = 18 + Math.sin((month - 2) * Math.PI / 6) * 2 // 16-20 hour range
    const baseMinute = 30 + (day % 30) * 2 // Add some day-to-day variation
    
    const sunsetHour = Math.floor(baseHour)
    const sunsetMinute = baseMinute % 60
    
    // Civil twilight is typically 30 minutes after sunset
    const civilHour = sunsetHour + Math.floor((sunsetMinute + 30) / 60)
    const civilMinute = (sunsetMinute + 30) % 60
    
    // Recommended start is 15 minutes after civil twilight
    const recommendedHour = civilHour + Math.floor((civilMinute + 15) / 60)
    const recommendedMinute = (civilMinute + 15) % 60
    
    const formatTime = (hour, minute) => {
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
    }
    
    return {
      sunset: formatTime(sunsetHour, sunsetMinute),
      civilTwilight: formatTime(civilHour, civilMinute),
      recommendedStart: formatTime(recommendedHour, recommendedMinute),
      location: location || "San Francisco, CA"
    }
  }

  // Update movie times when date or coordinates change
  useEffect(() => {
    if (coordinates) {
      const fetchTimes = async () => {
        setLoading(true)
        try {
          const times = await fetchSunsetData(coordinates.lat, coordinates.lng, selectedDate)
          setMovieTime(times)
        } catch (error) {
          console.error('Error fetching times:', error)
          setError('Failed to fetch sunset data. Using fallback times.')
          const times = getMockData(selectedDate)
          setMovieTime(times)
        } finally {
          setLoading(false)
        }
      }
      
      fetchTimes()
    }
  }, [selectedDate, coordinates])


  const getCurrentLocation = async () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })
        
        try {
          // Reverse geocode to get city/state name
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
          
          if (response.ok) {
            const data = await response.json()
            // Use the most specific location available (neighborhood > city > locality)
            const specificLocation = data.locality || data.city || 'Unknown City'
            const state = data.principalSubdivision || 'Unknown State'
            setLocation(`${specificLocation}, ${state}`)
          } else {
            setLocation("Current Location")
          }
        } catch (error) {
          console.error('Error reverse geocoding:', error)
          setLocation("Current Location")
        }
        
        setLoading(false)
        setShowLocationEdit(false)
        // The useEffect will automatically fetch times when coordinates are set
      },
      (error) => {
        setError("Unable to retrieve your location. Please try entering a zipcode.")
        setLoading(false)
      }
    )
  }

  const handleZipcodeSubmit = async (zipcode) => {
    setLoading(true)
    setError(null)
    
    if (zipcode.length === 5 && /^\d+$/.test(zipcode)) {
      try {
        // Use a free geocoding service to convert zipcode to coordinates
        const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`)
        
        if (!response.ok) {
          throw new Error('Invalid zipcode')
        }
        
        const data = await response.json()
        
        if (!data.places || data.places.length === 0) {
          throw new Error('No location data found for this zipcode')
        }
        
        const place = data.places[0]
        const { latitude, longitude } = place
        const city = place['place name'] || 'Unknown City'
        const state = place['state'] || 'Unknown State'
        
        setCoordinates({ lat: parseFloat(latitude), lng: parseFloat(longitude) })
        setLocation(`${city}, ${state}`)
        setLoading(false)
        setShowLocationEdit(false)
        // The useEffect will automatically fetch times when coordinates are set
      } catch (error) {
        console.error('Error geocoding zipcode:', error)
        setError("Invalid zipcode. Please try again.")
        setLoading(false)
      }
    } else {
      setError("Please enter a valid 5-digit zipcode.")
      setLoading(false)
    }
  }

  // Date navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }

  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // Location editing functions
  const startLocationEdit = () => {
    setShowLocationEdit(true)
    setError(null)
  }

  const cancelLocationEdit = () => {
    setShowLocationEdit(false)
    setError(null)
  }

  const clearLocation = () => {
    setLocation(null)
    setCoordinates(null)
    setMovieTime(null)
    setShowLocationEdit(false)
    setError(null)
  }

  // Format date for display
  const formatDate = (date) => {
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    const isTomorrow = date.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()
    
    if (isToday) return "Today"
    if (isTomorrow) return "Tomorrow"
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }


  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 Outdoor Movie Time</h1>
          <div className="header-subtitle">
            <span>Movie Times</span>
            <div className="date-navigation">
              <button 
                className="nav-btn" 
                onClick={goToPreviousDay}
                title="Previous day"
              >
                ←
              </button>
              <button 
                className="date-display" 
                onClick={goToToday}
                title="Go to today"
              >
                {formatDate(selectedDate)}
              </button>
              <button 
                className="nav-btn" 
                onClick={goToNextDay}
                title="Next day"
              >
                →
              </button>
            </div>
          </div>
        </div>
        <div className="moon-icon">🌙</div>
      </header>

      <main className="app-main">
        {/* Section 01: Current Status */}
        <section className="section">
          <div className="section-header">
            <span className="section-number">01</span>
            <h2>Current Status</h2>
          </div>
          <div className="section-content">
            {location && !showLocationEdit ? (
              <div className="location-info">
                <div className="location-display">
                  <div className="location">📍 {location}</div>
                  <button 
                    className="edit-location-btn"
                    onClick={startLocationEdit}
                    title="Change location"
                  >
                    ✏️
                  </button>
                </div>
                <div className="date-info">
                  {formatDate(selectedDate)} - {selectedDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            ) : (
              <div className="location-prompt">
                <p>Get your optimal movie start time</p>
                <div className="location-actions">
                  <button 
                    className="location-btn"
                    onClick={getCurrentLocation}
                    disabled={loading}
                  >
                    {loading ? "Getting Location..." : "Get My Location"}
                  </button>
                  <div className="or-divider">or</div>
                  <div className="zipcode-input">
                    <input 
                      type="text" 
                      placeholder="Enter zipcode"
                      maxLength="5"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleZipcodeSubmit(e.target.value)
                        }
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        const input = e.target.previousElementSibling
                        handleZipcodeSubmit(input.value)
                      }}
                      disabled={loading}
                    >
                      Go
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {showLocationEdit && (
              <div className="location-edit">
                <div className="edit-header">
                  <h3>Change Location</h3>
                  <button 
                    className="cancel-btn"
                    onClick={cancelLocationEdit}
                  >
                    ✕
                  </button>
                </div>
                <div className="edit-actions">
                  <button 
                    className="location-btn"
                    onClick={getCurrentLocation}
                    disabled={loading}
                  >
                    {loading ? "Getting Location..." : "Use Current Location"}
                  </button>
                  <div className="or-divider">or</div>
                  <div className="zipcode-input">
                    <input 
                      type="text" 
                      placeholder="Enter zipcode"
                      maxLength="5"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleZipcodeSubmit(e.target.value)
                        }
                      }}
                    />
                    <button 
                      onClick={(e) => {
                        const input = e.target.previousElementSibling
                        handleZipcodeSubmit(input.value)
                      }}
                      disabled={loading}
                    >
                      Go
                    </button>
                  </div>
                </div>
                <button 
                  className="clear-location-btn"
                  onClick={clearLocation}
                >
                  Clear Location
                </button>
              </div>
            )}
            
            {error && (
              <div className="error">
                {error}
              </div>
            )}
          </div>
        </section>

        {/* Section 02: Sunset & Twilight Times */}
        {movieTime && (
          <section className="section">
            <div className="section-header">
              <span className="section-number">02</span>
              <h2>Sunset & Twilight Times</h2>
            </div>
            <div className="section-content">
              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <span>Loading sunset data...</span>
                </div>
              ) : (
                <div className="time-info">
                  <div className="time-item">
                    <span className="time-label">🌅 Sunset:</span>
                    <span className="time-value">{movieTime.sunset}</span>
                  </div>
                  <div className="time-item">
                    <span className="time-label">🌆 Civil Twilight:</span>
                    <span className="time-value">{movieTime.civilTwilight}</span>
                  </div>
                  <div className="time-item recommended">
                    <span className="time-label">🎬 Recommended Start:</span>
                    <span className="time-value">{movieTime.recommendedStart}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 03: Settings */}
        <section className="section">
          <div className="section-header">
            <span className="section-number">03</span>
            <h2>Settings</h2>
          </div>
          <div className="section-content">
            <p className="coming-soon">Coming soon...</p>
          </div>
        </section>

        {/* Section 04: About */}
        <section className="section">
          <div className="section-header">
            <span className="section-number">04</span>
            <h2>About</h2>
          </div>
          <div className="section-content">
            <p className="coming-soon">Coming soon...</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
