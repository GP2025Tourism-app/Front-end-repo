import React from "react";
import "./Recommendations.css";

const recommendationData = [
  { name: "Abu Simbel", type: "Historical Site", image: "https://cdn.britannica.com/49/189749-050-EDADDEC0/Great-Temple-of-Ramses-II-temples-larger.jpg" },
  { name: "Salah El-din Palace", type: "Historical Site", image: "https://www.cairo.gov.eg/ar/Imp%20Information/tourism_pictures/cultural/salah%20al-%20din%20citadel/al%20qal3a1.jpg" },
  { name: "Luxor Temple", type: "Historical Site", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTzpbQ_SoQK9Nzi5w3dBzfrQJKDzV8aINzog&s" },
  { name: "Karnak Temple", type: "Historical Site", image: "https://cdn.mos.cms.futurecdn.net/5HrnHp9ybAqYrtruKAsfkN-1200-80.jpg" },
  { name: "Valley of the Kings", type: "Historical Site", image: "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/tomb-of-ramses-vi.jpg" },
  { name: "Siwa Oasis", type: "Natural Wonder", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHTqPFhEUvVdp4W2qpDzz2jmQ1w_7cKkzMsw&s" },
  { name: "Red Sea Coral Reef", type: "Natural Wonder", image: "https://www.al-monitor.com/sites/default/files/styles/article_header/public/2022-09/GettyImages-1409779114.jpg?h=1d34674f&itok=VGoTLYQZ" },
  { name: "Mount Sinai", type: "Historical and Religious Site", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mount_Moses.jpg/1200px-Mount_Moses.jpg" },
  { name: "Philae Temple", type: "Historical Site", image: "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/49581/file-manager/egypt-philae-temple.jpg" },
]

function Recommendations() {
    return (
      <section className="recommendations">
        <h3 className="recommendations-title">Recommendations</h3>
        <div className="recommendation-grid">
          {recommendationData.map((item, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-image" style={{ backgroundImage: `url(${item.image})` }}>
                
              </div>
              <div className="recommendation-info">
                <h4>{item.name}</h4>
                <p>{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default Recommendations;