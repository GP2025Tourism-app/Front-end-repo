import React from "react";
import "./ExploreTourGuides.css"

const ExploreTourGuidesData = [
  { name: "Adham",  image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMC2LPWinJXv_YDQERAfQCFG37V6PiBn_d4A&s" },
  { name: "Ahmed ", image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg" },
  { name: "Islam", image: "https://media.istockphoto.com/id/842181676/photo/tourist-surfing-the-net-outdoors.jpg?s=612x612&w=0&k=20&c=_D3G_VqswUqUZSU-xa0r88dgYHfLhIGU2A1rXgmaxZs=" },
  { name: "Maged",  image: "https://images.stockcake.com/public/e/e/8/ee823b4a-99ef-4575-9fe4-0b8fdc84cb75_large/tour-guide-explaining-stockcake.jpg" },
  { name: "Mary",  image: "https://media.istockphoto.com/id/1410995177/photo/having-a-tour-through-the-city.jpg?s=612x612&w=0&k=20&c=IOWPFZVVQVGdQnJV1vaNFyJ5RFJJiN6X-xxnQZRr4_I=" },
  { name: "Sarah",  image: "https://img.freepik.com/premium-photo/shot-young-female-tour-guide-leading-her-group-walking-tour-created-with-generative-ai_762026-49920.jpg" },
  
];

function ExploreTourGuides() {
  return (
    <section className="ExploreTourGuides">
      <h3 className="ExploreTourGuides-title">Explore Tour Guides</h3>
      <div className="ExploreTourGuides-grid">
        {ExploreTourGuidesData.map((Guide, index) => (
          <div key={index} className="ExploreTourGuides-card">
            <div className="ExploreTourGuides-image" style={{ backgroundImage: `url(${Guide.image})` }}>
              <div className="ExploreTourGuides-info">
                <h4>{Guide.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExploreTourGuides;
