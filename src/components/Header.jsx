"use client"

import { useState } from "react"
import { shortenAddress } from "../utils/helpers"
import "../styles/Header.css"

const Header = ({ account, connectWallet, activeTab, setActiveTab }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-container">
          <div className="logo">
            <img src="/images/torii-gate.svg" alt="Torii Gate" className="logo-icon" />
            <h1>Omotenashi Passport</h1>
          </div>
        </div>

        <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            <li className={activeTab === "mint" ? "active" : ""}>
              <button onClick={() => handleTabClick("mint")}>Mint Passport</button>
            </li>
            <li className={activeTab === "passport" ? "active" : ""}>
              <button onClick={() => handleTabClick("passport")}>My Passports</button>
            </li>
            <li className={activeTab === "checkin" ? "active" : ""}>
              <button onClick={() => handleTabClick("checkin")}>Check-in</button>
            </li>
            <li className={activeTab === "perks" ? "active" : ""}>
              <button onClick={() => handleTabClick("perks")}>Redeem Perks</button>
            </li>
            <li className={activeTab === "locations" ? "active" : ""}>
              <button onClick={() => handleTabClick("locations")}>Locations Guide</button>
            </li>
          </ul>
        </nav>

        <div className="wallet-container">
          {account ? (
            <div className="wallet-info">
              <div className="wallet-address">{shortenAddress(account)}</div>
              <div className="wallet-icon">
                <img src="/images/wallet.svg" alt="Wallet" />
              </div>
            </div>
          ) : (
            <button className="connect-wallet-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>

        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header

