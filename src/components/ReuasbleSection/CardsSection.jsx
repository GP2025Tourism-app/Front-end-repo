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
          overflowX: 'auto',  
          paddingBottom: '20px',  
          gap: '20px',  
          width: '100%',  
          scrollbarWidth: 'none',
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              minWidth: '250px',  
              flex: '0 0 auto',   
            }}
          >
            <Card style={{ width: '250px', height: '350px' }}>
              <Card.Img variant="top" src={card.imageSrc} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body style={{ height: '100px', overflow: 'hidden' }}>
                <Card.Title>{card.title}</Card.Title>
                <Card.Text style={{ fontSize: '1rem' }}>{card.description}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CardsSection;
