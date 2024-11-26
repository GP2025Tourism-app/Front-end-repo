
import React from 'react';

// Function to determine the text color based on the background color
const getTextColor = (backgroundColor) => {
  return backgroundColor === '#fff' ? '#333' : '#fff';
};

function OneImageRightTextSection({ title, description, images, backgroundColor = '#757272' }) {

  const textColor = getTextColor(backgroundColor);

  return (
    <section
      style={{
        marginTop: '50px',  // Reduced margin-top for testing
        padding: '50px 20px',  // Reduced padding
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'left',
        backgroundColor: backgroundColor,
      }}
    >
      {/* Image on the Left */}
      <div
        style={{
          flex: 1,
          marginRight: '20px',  // Reduced margin
        }}
      >
        <img
          src={images[0].src}
          alt={images[0].alt}
          style={{
            width: '80%',
            height: 'auto',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </div>
  
      {/* Text on the Right */}
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: textColor }}>{title}</h2>
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
      </div>
    </section>
  );
  
};

export default OneImageRightTextSection;
