import React from "react";
import "./DiscoverCities.css"

const DicoverCitiesData = [
  { name: "Cairo",  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Cairo_From_Tower_%28cropped%29.jpg/640px-Cairo_From_Tower_%28cropped%29.jpg" },
  { name: "Alexandria ", image: "https://www.propertyfinder.eg/blog/wp-content/uploads/2021/08/shutterstock_71593240-1-800x512.jpg" },
  { name: "Dahab", image: "https://www.propertyfinder.eg/blog/wp-content/uploads/2020/10/shutterstock_1396879814-1-800x534.jpg" },
  { name: "Sharm elSheikh",  image: "https://assets.enuygun.com/media/lib/570x400/uploads/image/sharm-el-sheikh-58429.jpeg" },
  { name: "Siwa",  image: "https://tourism-villages.unwto.org/wp-content/uploads/2023/10/FSj0CC6XIAAAtDP-2048x1533-1.jpeg" },
  { name: "Luxor",  image: "https://betamedia.experienceegypt.eg/media/experienceegypt/img/Original/2022/8/7/2022_8_7_18_34_27_517.jpeg" },
  
];

function DiscoverCities() {
  return (
    <section className="Discover-cities">
      <h3 className="Discover-cities-title">Discover Cities</h3>
      <div className="Discover-cities-grid">
        {DicoverCitiesData.map((City, index) => (
          <div key={index} className="Discover-cities-card">
            <div className="Discover-cities-image" style={{ backgroundImage: `url(${City.image})` }}>
              <div className="Discover-cities-info">
                <h4>{City.name}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverCities;
