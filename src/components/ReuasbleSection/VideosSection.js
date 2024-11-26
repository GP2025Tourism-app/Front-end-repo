import React from 'react';

function VideosSection({ title, description, images }) {
  return (
    <section
      style={{
        marginTop: '50px',
        padding: '50px 20px',
        backgroundColor: '#757272',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' ,color:'white'}}>{title}</h2>

      {/* Description */}
      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '800px',
          marginBottom: '120px',
          color:'white',
        }}
      >
        {description}
      </p>

      {/* Images */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',  // 4 images per row
          gridGap: '20px',
          width: '100%',  // Ensure full width for the grid container
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '100%',
              height: 0,
              paddingBottom: '75%', // Maintain aspect ratio (3:4)
              transform: index % 2 === 0 ? 'translateY(-50px)' : 'none', // Lift 1st and 3rd images
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid green', // Border for debugging
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default VideosSection;
