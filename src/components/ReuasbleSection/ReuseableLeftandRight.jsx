import React from 'react';

// Function to determine the text color based on the background color
const getTextColor = (backgroundColor) => {
  // If the background is white, set text color to black, otherwise set to white
  return backgroundColor === '#fff' ? '#333' : '#fff';
};

function LeftImagesRightTextSection({ title, description, images, reverseLayout = false, backgroundColor = '#757272' }) {
  // Determine the text color based on the background color
  const textColor = getTextColor(backgroundColor);

  return (
    <section
      style={{
        marginTop: '80px',
        padding: '180px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'left',
        backgroundColor: backgroundColor,
        flexDirection: reverseLayout ? 'row-reverse' : 'row', // Dynamically reverse the layout
      }}
    >
      {/* Images on the Left or Right */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '20px',
          marginRight: reverseLayout ? '0' : '30px',
          marginLeft: reverseLayout ? '30px' : '0',
        }}
      >
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
              width: '40%',
              height: '80%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <img
            src={images[1].src}
            alt={images[1].alt}
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '150px',
              width: '40%',
              height: '80%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
          <img
            src={images[2].src}
            alt={images[2].alt}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '150px',
              width: '40%',
              height: '80%',
              objectFit: 'cover',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>

      {/* Text on the Right or Left */}
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
}

export default LeftImagesRightTextSection;
