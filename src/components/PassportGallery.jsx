"use client"

import { useState, useEffect } from "react"
import "../styles/PassportGallery.css"

const PassportGallery = ({ contract, userTokens }) => {
  const [passports, setPassports] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPassport, setSelectedPassport] = useState(null)

  useEffect(() => {
    const fetchPassports = async () => {
      if (userTokens.length === 0) {
        setPassports([])
        setLoading(false)
        return
      }

      try {
        const passportData = await Promise.all(
          userTokens.map(async (tokenId) => {
            const tokenURI = await contract.tokenURI(tokenId)
            const metadata = parseTokenURI(tokenURI)
            const adventurerLevel = await contract.passports(tokenId)
            const visitedLocations = await contract.getVisitedLocations(tokenId)

            return {
              tokenId,
              metadata,
              adventurerLevel: adventurerLevel.toString(),
              visitedLocations,
            }
          }),
        )

        setPassports(passportData)
        if (passportData.length > 0 && !selectedPassport) {
          setSelectedPassport(passportData[0])
        }
      } catch (error) {
        console.error("Error fetching passport data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPassports()
  }, [contract, userTokens, selectedPassport])

  const parseTokenURI = (tokenURI) => {
    // Token URI is in format: data:application/json;base64,<base64-encoded-json>
    try {
      const base64Data = tokenURI.split(",")[1]
      const jsonString = atob(base64Data)
      return JSON.parse(jsonString)
    } catch (error) {
      console.error("Error parsing token URI:", error)
      return { name: "Error", description: "Could not parse metadata", image: "" }
    }
  }

  const handlePassportClick = (passport) => {
    setSelectedPassport(passport)
  }

  if (loading) {
    return (
      <div className="passport-gallery">
        <div className="loading-spinner">Loading your passports...</div>
      </div>
    )
  }

  if (passports.length === 0) {
    return (
      <div className="passport-gallery empty-gallery">
        <div className="empty-message">
          <h3>No Passports Found</h3>
          <p>You don't have any Omotenashi Passports yet. Mint one to start your journey!</p>
          <button onClick={() => (window.location.hash = "#mint")}>Mint a Passport</button>
        </div>
      </div>
    )
  }

  return (
    <div className="passport-gallery">
      <h2>My Omotenashi Passports</h2>

      <div className="gallery-container">
        <div className="passport-list">
          {passports.map((passport) => (
            <div
              key={passport.tokenId}
              className={`passport-item ${selectedPassport?.tokenId === passport.tokenId ? "selected" : ""}`}
              onClick={() => handlePassportClick(passport)}
            >
              <div className="passport-thumbnail">
                <div className="passport-cover-mini">
                  <span>#{passport.tokenId}</span>
                  <span>Stamps: {passport.visitedLocations.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedPassport && (
          <div className="passport-detail">
            <div className="passport-book">
              <div className="passport-cover-front">
                <div className="passport-emblem"></div>
                <h3>
                  日本国
                  <br />
                  JAPAN
                </h3>
                <h4>
                  おもてなしパスポート
                  <br />
                  OMOTENASHI PASSPORT
                </h4>
                <p className="passport-id">No. {selectedPassport.tokenId}</p>
              </div>

              <div className="passport-pages">
                <div className="passport-page passport-info-page">
                  <h3>Adventurer Details</h3>
                  <div className="passport-info">
                    <p>
                      <strong>Adventurer Level:</strong> {selectedPassport.adventurerLevel}
                    </p>
                    <p>
                      <strong>Stamps Collected:</strong> {selectedPassport.visitedLocations.length}
                    </p>
                    <p>
                      <strong>Journey Started:</strong>{" "}
                      {selectedPassport.metadata.attributes?.find((attr) => attr.trait_type === "Created")?.value ||
                        "Unknown"}
                    </p>
                  </div>

                  <div className="passport-owner-section">
                    <div className="owner-photo"></div>
                    <div className="owner-signature">
                      <p>SIGNATURE OF BEARER / 所有者の署名</p>
                    </div>
                  </div>
                </div>

                <div className="passport-page passport-stamps-page">
                  <h3>Collected Stamps</h3>
                  {selectedPassport.visitedLocations.length > 0 ? (
                    <div className="stamps-container">
                      {selectedPassport.metadata.image && (
                        <div
                          className="passport-svg-container"
                          dangerouslySetInnerHTML={{ __html: atob(selectedPassport.metadata.image.split(",")[1]) }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="empty-stamps">
                      <p>No stamps collected yet.</p>
                      <p>Visit locations and check in to collect stamps!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PassportGallery

