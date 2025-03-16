import "../styles/LocationsGuide.css"

const LocationsGuide = () => {
  // Sample locations data
  const locations = [
    {
      id: 1,
      name: "Fushimi Inari Shrine",
      description:
        "Famous for its thousands of vermilion torii gates, this shrine is dedicated to Inari, the Shinto god of rice.",
      code: "FUSHIMI01",
      region: "Kyoto",
      image: "/images/locations/fushimi-inari.jpg",
      stampDescription: "A torii gate stamp with a fox, Inari's messenger",
    },
    {
      id: 2,
      name: "Arashiyama Bamboo Grove",
      description:
        "A natural forest of bamboo that creates an otherworldly atmosphere as sunlight filters through the tall stalks.",
      code: "ARASHIYAMA",
      region: "Kyoto",
      image: "/images/locations/bamboo-grove.jpg",
      stampDescription: "A bamboo forest stamp with a crescent moon",
    },
    {
      id: 3,
      name: "Gion District",
      description:
        "Kyoto's most famous geisha district, filled with traditional wooden machiya houses, teahouses, and exclusive restaurants.",
      code: "GION1234",
      region: "Kyoto",
      image: "/images/locations/gion.jpg",
      stampDescription: "A geisha silhouette stamp with cherry blossoms",
    },
    {
      id: 4,
      name: "Nishiki Market",
      description:
        "Known as 'Kyoto's Kitchen', this lively market stretches for five blocks and features over 100 shops and restaurants.",
      code: "NISHIKI01",
      region: "Kyoto",
      image: "/images/locations/nishiki.jpg",
      stampDescription: "A food market stamp with fish and vegetables",
    },
    {
      id: 5,
      name: "Kiyomizu-dera Temple",
      description:
        "A UNESCO World Heritage site famous for its wooden stage that offers spectacular views of cherry and maple trees.",
      code: "KIYOMIZU1",
      region: "Kyoto",
      image: "/images/locations/kiyomizu.jpg",
      stampDescription: "A temple pagoda stamp with maple leaves",
    },
  ]

  return (
    <div className="locations-guide">
      <h2>Hidden Gems of Japan</h2>
      <p className="guide-intro">
        Discover these special locations and collect unique stamps for your Omotenashi Passport.
      </p>

      <div className="locations-filter">
        <div className="filter-label">Filter by region:</div>
        <select className="region-select">
          <option value="all">All Regions</option>
          <option value="kyoto">Kyoto</option>
          <option value="tokyo">Tokyo</option>
          <option value="osaka">Osaka</option>
          <option value="hokkaido">Hokkaido</option>
        </select>
      </div>

      <div className="locations-list">
        {locations.map((location) => (
          <div key={location.id} className="location-card">
            <div className="location-image">
              <div className="image-placeholder">
                <span>{location.name}</span>
              </div>
            </div>

            <div className="location-details">
              <h3>{location.name}</h3>
              <p className="location-region">{location.region}</p>
              <p className="location-description">{location.description}</p>

              <div className="stamp-preview">
                <h4>Stamp Preview</h4>
                <div className="stamp-image">
                  <div className="stamp-placeholder"></div>
                </div>
                <p className="stamp-description">{location.stampDescription}</p>
              </div>

              <div className="location-footer">
                <div className="location-code">
                  <span>Location Code:</span>
                  <strong>{location.code}</strong>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocationsGuide

