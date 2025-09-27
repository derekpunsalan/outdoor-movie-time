import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [movieTime, setMovieTime] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showLocationEdit, setShowLocationEdit] = useState(false)

  // Function to calculate sunset/twilight times for a given date
  const calculateTimesForDate = (date) => {
    // Mock calculation - in real implementation, this would use actual sunset API
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

  // Update movie times when date or location changes
  useEffect(() => {
    if (location) {
      const times = calculateTimesForDate(selectedDate)
      setMovieTime(times)
    }
  }, [selectedDate, location])


  const getCurrentLocation = () => {
    setLoading(true)
    setError(null)
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.")
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Mock success - will implement real geocoding later
        setLocation("San Francisco, CA")
        setLoading(false)
        setShowLocationEdit(false)
        // The useEffect will automatically calculate times when location is set
      },
      (error) => {
        setError("Unable to retrieve your location. Please try entering a zipcode.")
        setLoading(false)
      }
    )
  }

  const handleZipcodeSubmit = (zipcode) => {
    setLoading(true)
    setError(null)
    
    // Mock zipcode validation and geocoding
    if (zipcode.length === 5 && /^\d+$/.test(zipcode)) {
      setLocation("San Francisco, CA")
      setLoading(false)
      setShowLocationEdit(false)
      // The useEffect will automatically calculate times when location is set
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
