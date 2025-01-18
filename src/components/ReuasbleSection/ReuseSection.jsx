import React from 'react';

const getTextColor = (backgroundColor) => {
  return backgroundColor === '#fff' ? '#333' : '#fff';
};

function ReusableSection({ title, description, images, backgroundColor = '#587E84' }) {
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
        {/* Image container */}
        <div
          style={{
            gridColumn: '1 / 3',
            gridRow: '1 / 3',
            position: 'relative',
          }}
        >
          {/* Decrease size of the center image */}
          <img
            src={images[0].src}
            alt={images[0].alt}
            style={{
              width: '40%',  // Decreased size from 50% to 40%
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '8px',
              margin: '0 auto',
            }}
          />

          {/* Render additional images only if there are more than one */}
          {images.length === 3 && (
            <>
              {/* Bottom Left Image */}
              <img
                src={images[1].src}
                alt={images[1].alt}
                style={{
                  position: 'absolute',
                  bottom: '-40px',
                  left: '15%',
                  width: '30%',
                  height: 'auto',
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
                  right: '15%',
                  width: '30%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default ReusableSection;
