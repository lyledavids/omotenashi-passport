"use client"

import { useState } from "react"
import "../styles/MintSection.css"

const MintSection = ({ contract, account, fetchUserTokens }) => {
  const [minting, setMinting] = useState(false)
  const [mintSuccess, setMintSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleMint = async () => {
    setMinting(true)
    setError("")
    setMintSuccess(false)

    try {
      const tx = await contract.mintPassport()
      await tx.wait()

      setMintSuccess(true)
      fetchUserTokens()
    } catch (err) {
      console.error("Error minting passport:", err)
      setError("Failed to mint passport. Please try again.")
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="mint-section">
      <div className="mint-container">
        <div className="mint-content">
          <h2>Begin Your Journey Through Japan</h2>
          <p>Mint your Omotenashi Passport NFT to start collecting stamps from hidden gems across Japan.</p>

          <div className="passport-preview">
            <div className="passport-cover">
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
            </div>
          </div>

          <button className={`mint-button ${minting ? "minting" : ""}`} onClick={handleMint} disabled={minting}>
            {minting ? "Minting..." : "Mint Passport"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {mintSuccess && (
            <div className="success-message">
              <p>Passport minted successfully!</p>
              <p>Your journey through Japan's hidden gems awaits.</p>
            </div>
          )}
        </div>

        <div className="mint-info">
          <h3>What is the Omotenashi Passport?</h3>
          <p>
            The Omotenashi Passport is a dynamic NFT that evolves as you explore Japan's hidden gems. Each location you
            visit adds a unique stamp to your passport, unlocking special perks and telling the story of your journey.
          </p>

          <h3>How it works:</h3>
          <ol>
            <li>Mint your passport NFT</li>
            <li>Visit hidden gems across Japan</li>
            <li>Check in at each location to collect stamps</li>
            <li>Watch your passport evolve with each new stamp</li>
            <li>Unlock special perks as you collect more stamps</li>
          </ol>

          <div className="japan-decoration">
            <img src="/images/mt-fuji.svg" alt="Mount Fuji" className="fuji-decoration" />
            <img src="/images/cherry-blossom.svg" alt="Cherry Blossom" className="sakura-decoration" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintSection

