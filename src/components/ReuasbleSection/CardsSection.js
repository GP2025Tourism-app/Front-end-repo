// CardsSection.js
import React from 'react';
import Card from 'react-bootstrap/Card';

function CardsSection({ title, description, cards }) {
  return (
    <section
      style={{
        marginTop: '50px',
        padding: '50px 20px',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '50px' }}>
        {title}
      </h2>

      {/* Cards */}
      <div
        style={{

          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',  // 4 cards per row
          gridGap: '20px',
          width: '100%',  // Ensure full width for the grid container
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
         // Lift 1st and 3rd cards
            }}
          >
            <Card style={{ width: '100%' }}>
              <Card.Img variant="top" src={card.imageSrc} />
              <Card.Body>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text>{card.description}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardsSection;
