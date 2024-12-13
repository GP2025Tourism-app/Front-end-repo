// ReusableSection.js
import React from 'react';

const getTextColor = (backgroundColor) => {
  // If the background is white, set text color to black, otherwise set to white
  return backgroundColor === '#fff' ? '#333' : '#fff';
};

function ReusableSection({ title, description, images, backgroundColor = '#757272' }) {
  const textColor = getTextColor(backgroundColor);
  
  return (
    <section
      style={{
        marginTop: '30px',
        padding: '80px 20px',
        textAlign: 'center',
        backgroundColor: backgroundColor,
      }}
    >
      {/* Title */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: textColor }}>{title}</h2>

      {/* Description */}
      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '800px',
          margin: '0 auto 30px auto',
          color: textColor,
        }}
      >
        {description}
      </p>

      {/* Images */}
      <div
        style={{
          marginTop: '50px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gridGap: '20px',
        }}
      >
        {/* Middle Image */}
        <div
          style={{
            gridColumn: '1 / 3',
            gridRow: '1 / 3',
            position: 'relative',
          }}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            style={{
              width: '30%', // Increased width from 25% to 30%
              height: '85%', // Increased height from 80% to 85%
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          {/* Bottom Left Image */}
          <img
            src={images[1].src}
            alt={images[1].alt}
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '230px',
              width: '30%', // Increased width from 25% to 30%
              height: '85%', // Increased height from 80% to 85%
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          {/* Bottom Right Image */}
          <img
            src={images[2].src}
            alt={images[2].alt}
            style={{
              position: 'absolute',
              bottom: '-40px',
              right: '230px',
              width: '30%', // Increased width from 25% to 30%
              height: '85%', // Increased height from 80% to 85%
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default ReusableSection;
