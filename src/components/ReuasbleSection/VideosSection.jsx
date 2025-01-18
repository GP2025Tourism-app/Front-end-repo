import React from 'react';

function VideosSection({ title, description, images, videos }) {
  return (
    <section
      style={{
        marginTop: '50px',
        padding: '50px 20px',
        backgroundColor: '#587E84',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title */}
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'white' }}>
        {title}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '1.2rem',
          maxWidth: '800px',
          marginBottom: '120px',
          color: 'white',
        }}
      >
        {description}
      </p>

      {/* Videos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', // 4 videos per row
          gridGap: '20px',
          width: '100%', // Ensure full width for the grid container
        }}
      >
        {videos.map((videoUrl, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              width: '100%',
              height: 0,
              paddingBottom: '75%', // Maintain aspect ratio (16:9 for videos)
              transform: index % 2 === 0 ? 'translateY(-50px)' : 'none', // Lift 1st and 3rd videos
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoUrl}`}
              title={`YouTube video ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            ></iframe>
          </div>
        ))}
      </div>
    </section>
  );
}

export default VideosSection;
