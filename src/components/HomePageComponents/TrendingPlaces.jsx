import React from "react";
import "./trendingplaces.css"

const trendingData = [
  { name: "Pyramids", location: "Cairo", image: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F99fb9468-4b44-406d-a4c2-5646791b6367.jpg?crop=1600%2C900%2C0%2C0" },
  { name: "Castle Zmana", location: "Dahab", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu5l0gBUBZIYbu_4kBQYBe8hIcUDltcUFzgQ&s" },
  { name: "Blue Hole", location: "Dahab", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM8pLcBQLGoH-IQNWX_Wjxm5awPvW1cYBvHA&s" },
  { name: "Salah eldin Castle", location: "Cairo", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DXHPiggZnALRfimZ9qj1V46rtGtSMmPg3A&s" },
  { name: "saint catherine mountain", location: "Sainai", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj-sG1Vrw9Q50PPYjZ6jl9BKaRg3O-yXzjKw&s" },
  { name: "Alexandria Library", location: "Alexandria", image: "https://www.traveltoegypt.net/front/images/blog/Alexandria-Library.jpg" },
  
];

function TrendingPlaces() {
  return (
    <section className="trending-places">
      <h3 className="trending-places-title">Trending Places</h3>
      <div className="places-grid">
        {trendingData.map((place, index) => (
          <div key={index} className="place-card">
            <div className="place-image" style={{ backgroundImage: `url(${place.image})` }}>
              <div className="place-info">
                <h4>{place.name}</h4>
                <p>{place.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrendingPlaces;
