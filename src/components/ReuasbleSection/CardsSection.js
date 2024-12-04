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

      {/* Cards Container with Horizontal Scroll */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',  // Enables horizontal scrolling
          paddingBottom: '20px',  // To prevent content being cut off at the bottom
          gap: '20px',  // Space between cards
          width: '100%',  // Ensure full width
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              minWidth: '250px',  // Ensures each card has a consistent width
              flex: '0 0 auto',   // Prevent cards from shrinking or growing
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
