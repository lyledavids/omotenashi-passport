import { useState, useEffect } from 'react'
import '../styles/RedeemPerks.css'

const RedeemPerks = ({ contract, userTokens }) => {
  const [passportPerks, setPassportPerks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPerk, setSelectedPerk] = useState(null)
  const [showRedeemModal, setShowRedeemModal] = useState(false)

  useEffect(() => {
    const fetchPerks = async () => {
      if (userTokens.length === 0) {
        setPassportPerks([])
        setLoading(false)
        return
      }

      try {
        const perksData = await Promise.all(
          userTokens.map(async (tokenId) => {
            const unlockedPerks = await contract.getUnlockedPerks(tokenId)
            const visitedLocations = await contract.getVisitedLocations(tokenId)
            
            return {
              tokenId,
              unlockedPerks,
              stampsCount: visitedLocations.length
            }
          })
        )
        
        setPassportPerks(perksData)
      } catch (error) {
        console.error("Error fetching perks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPerks()
  }, [contract, userTokens])

  const handleRedeemClick = (perk, tokenId) => {
    setSelectedPerk({
      perk,
      tokenId,
      timestamp: new Date().toISOString(),
      redemptionCode: generateRandomCode()
    })
    setShowRedeemModal(true)
  }

  const closeRedeemModal = () => {
    setShowRedeemModal(false)
    setSelectedPerk(null)
  }

  // Generate a random redemption code
  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  if (loading) {
    return (
      <div className="redeem-perks">
        <h2>Redeem Perks</h2>
        <div className="loading-spinner">Loading your perks...</div>
      </div>
    )
  }

  if (passportPerks.length === 0) {
    return (
      <div className="redeem-perks empty-perks">
        <h2>Redeem Perks</h2>
        <div className="empty-message">
          <p>You don't have any passports yet. Mint one to start unlocking perks!</p>
          <button onClick={() => window.location.hash = '#mint'}>Mint a Passport</button>
        </div>
      </div>
    )
  }

  // Sample perks based on stamps collected
  const availablePerks = [
    { id: 1, name: "10% Off at Matcha Café", description: "Show your passport with 2+ stamps for 10% off at participating matcha cafés", requiredStamps: 2 },
    { id: 2, name: "Free Onsen Towel", description: "Receive a complimentary towel at participating onsen with 3+ stamps", requiredStamps: 3 },
    { id: 3, name: "Exclusive Souvenir", description: "Claim a special handcrafted souvenir with 5+ stamps", requiredStamps: 5 },
    { id: 4, name: "Traditional Tea Ceremony", description: "Experience a free traditional tea ceremony with 7+ stamps", requiredStamps: 7 },
    { id: 5, name: "VIP Temple Access", description: "Get special access to restricted areas in select temples with 10+ stamps", requiredStamps: 10 }
  ]

  return (
    <div className="redeem-perks">
      <h2>Redeem Perks</h2>
      
      <div className="perks-container">
        {passportPerks.map((passport) => (
          <div key={passport.tokenId} className="passport-perks">
            <h3>Passport #{passport.tokenId} - {passport.stampsCount} Stamps Collected</h3>
            
            <div className="perks-list">
              {availablePerks.map((perk) => {
                const isUnlocked = passport.stampsCount >= perk.requiredStamps
                
                return (
                  <div 
                    key={perk.id} 
                    className={`perk-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="perk-icon">
                      {isUnlocked ? '🎁' : '🔒'}
                    </div>
                    <div className="perk-details">
                      <h4>{perk.name}</h4>
                      <p>{perk.description}</p>
                      <div className="perk-requirements">
                        <span>Required stamps: {perk.requiredStamps}</span>
                        {!isUnlocked && (
                          <span className="stamps-needed">
                            {perk.requiredStamps - passport.stampsCount} more needed
                          </span>
                        )}
                      </div>
                    </div>
                    {isUnlocked && (
                      <button 
                        className="redeem-button"
                        onClick={() => handleRedeemClick(perk, passport.tokenId)}
                      >
                        Redeem
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      
      {showRedeemModal && selectedPerk && (
        <div className="qr-modal">
          <div className="qr-content">
            <button className="close-button" onClick={closeRedeemModal}>×</button>
            
            <h3>Redeem: {selectedPerk.perk.name}</h3>
            <p>Show this redemption code to the staff to redeem your perk</p>
            
            <div className="redemption-code">
              <div className="code-display">
                {selectedPerk.redemptionCode}
              </div>
            </div>
            
            <div className="redemption-details">
              <p><strong>Passport:</strong> #{selectedPerk.tokenId}</p>
              <p><strong>Perk:</strong> {selectedPerk.perk.name}</p>
              <p><strong>Valid until:</strong> {new Date(new Date().getTime() + 24*60*60*1000).toLocaleDateString()}</p>
            </div>
            
            <p className="disclaimer">This code is valid for one-time use only and expires in 24 hours.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RedeemPerks
