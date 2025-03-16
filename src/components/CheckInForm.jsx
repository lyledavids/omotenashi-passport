import { useState } from 'react'
import '../styles/CheckInForm.css'

const CheckInForm = ({ contract, userTokens, fetchUserTokens }) => {
  const [selectedTokenId, setSelectedTokenId] = useState('')
  const [locationCode, setLocationCode] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [animation, setAnimation] = useState(false)

  const handleTokenSelect = (e) => {
    setSelectedTokenId(e.target.value)
    setSuccess(false)
    setError('')
  }

  const handleLocationCodeChange = (e) => {
    setLocationCode(e.target.value)
    setSuccess(false)
    setError('')
  }

  const handleCheckIn = async (e) => {
    e.preventDefault()
    
    if (!selectedTokenId) {
      setError('Please select a passport')
      return
    }
    
    if (!locationCode) {
      setError('Please enter a location code')
      return
    }
    
    setIsChecking(true)
    setError('')
    setSuccess(false)
    
    try {
      const tx = await contract.addStamp(selectedTokenId, locationCode)
      await tx.wait()
      
      setSuccess(true)
      setAnimation(true)
      setTimeout(() => setAnimation(false), 3000)
      fetchUserTokens()
      
      // Clear form
      setLocationCode('')
    } catch (err) {
      console.error("Error checking in:", err)
      if (err.message.includes("already visited")) {
        setError("You've already visited this location!")
      } else if (err.message.includes("invalid location")) {
        setError("Invalid location code. Please check and try again.")
      } else {
        setError("Failed to check in. Please try again.")
      }
    } finally {
      setIsChecking(false)
    }
  }

  if (userTokens.length === 0) {
    return (
      <div className="check-in-form empty-passports">
        <h2>Check-in to Locations</h2>
        <div className="empty-message">
          <p>You don't have any passports yet. Mint one to start collecting stamps!</p>
          <button onClick={() => window.location.hash = '#mint'}>Mint a Passport</button>
        </div>
      </div>
    )
  }

  return (
    <div className="check-in-form">
      <h2>Check-in to Locations</h2>
      
      <div className="check-in-container">
        <div className="form-section">
          <form onSubmit={handleCheckIn}>
            <div className="form-group">
              <label htmlFor="passport-select">Select Passport</label>
              <select 
                id="passport-select" 
                value={selectedTokenId} 
                onChange={handleTokenSelect}
                required
              >
                <option value="">-- Select a passport --</option>
                {userTokens.map((tokenId) => (
                  <option key={tokenId} value={tokenId}>
                    Passport #{tokenId}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="location-code">Location Code</label>
              <input 
                type="text" 
                id="location-code" 
                placeholder="Enter the location code (e.g., FUSHIMI01)" 
                value={locationCode}
                onChange={handleLocationCodeChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`check-in-button ${isChecking ? 'checking' : ''}`}
              disabled={isChecking}
            >
              {isChecking ? 'Checking in...' : 'Check In'}
            </button>
            
            {error && <p className="error-message">{error}</p>}
            {success && (
              <div className="success-message">
                <p>Successfully checked in!</p>
                <p>A new stamp has been added to your passport.</p>
              </div>
            )}
          </form>
        </div>
        
        <div className="info-section">
          <h3>How to Check In</h3>
          <ol>
            <li>Find a participating location in Japan</li>
            <li>Look for the Omotenashi Passport QR code or sign</li>
            <li>Get the unique location code</li>
            <li>Select your passport and enter the code above</li>
            <li>Click "Check In" to add a stamp to your passport</li>
          </ol>
          
          <div className="location-examples">
            <h4>Sample Location Codes (for demo):</h4>
            <ul>
              <li><strong>FUSHIMI01</strong> - Fushimi Inari Shrine</li>
              <li><strong>ARASHIYAMA</strong> - Arashiyama Bamboo Grove</li>
              <li><strong>GION1234</strong> - Gion District</li>
              <li><strong>NISHIKI01</strong> - Nishiki Market</li>
              <li><strong>KIYOMIZU1</strong> - Kiyomizu-dera Temple</li>
            </ul>
          </div>
        </div>
      </div>
      
      {animation && (
        <div className="stamp-animation">
          <div className="stamp-effect">
            <img src="/images/stamp-effect.svg" alt="Stamp" />
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckInForm
