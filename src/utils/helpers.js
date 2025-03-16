// Helper function to shorten Ethereum addresses
export const shortenAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }
  
  // Helper function to format date
  export const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }
  
  // Helper function to decode base64 SVG
  export const decodeSVG = (base64String) => {
    if (!base64String) return ""
    try {
      // Remove data:image/svg+xml;base64, prefix if present
      const base64Data = base64String.includes("base64,") ? base64String.split("base64,")[1] : base64String
  
      return atob(base64Data)
    } catch (error) {
      console.error("Error decoding SVG:", error)
      return ""
    }
  }
  
  // Helper function to get adventurer level title
  export const getAdventurerTitle = (level) => {
    const levelNum = Number.parseInt(level)
  
    if (levelNum === 0) return "Novice Explorer"
    if (levelNum === 1) return "Curious Traveler"
    if (levelNum === 2) return "Hidden Gem Seeker"
    if (levelNum === 3) return "Cultural Enthusiast"
    if (levelNum === 4) return "Seasoned Adventurer"
    if (levelNum >= 5) return "Omotenashi Master"
  
    return "Traveler"
  }
  
  