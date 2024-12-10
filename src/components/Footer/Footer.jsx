import React from 'react';

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#333333',
        color: '#ffffff',
        padding: '50px 20px',
      }}
    >
      {/* Top Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <img src="logo.png" alt="Logo" style={{ height: '30px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="Enter your email to get the latest news..."
            style={{
              backgroundColor: '#f2f2f2',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          />
          <button
            style={{
              backgroundColor: '#0055b8',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Subscribe
          </button>
        </div>
      </div>

      <hr style={{ borderColor: '#555555', marginBottom: '30px' }} />

      {/* Bottom Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          marginBottom: '30px',
        }}
      >
        <div>
          <h4 style={{ marginBottom: '10px' }}>ABOUT US</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><a href="/our-team" style={{ color: '#ffffff', textDecoration: 'none' }}>Our team</a></li>
            <li><a href="/our-story" style={{ color: '#ffffff', textDecoration: 'none' }}>Our Story</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '10px' }}>BLOG</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><a href="/egypt-solo-trip" style={{ color: '#ffffff', textDecoration: 'none' }}>Egypt SoloTrip</a></li>
            <li><a href="/aswan" style={{ color: '#ffffff', textDecoration: 'none' }}>Aswan</a></li>
            <li><a href="/dahab-diving" style={{ color: '#ffffff', textDecoration: 'none' }}>Dahab Diving</a></li>
            <li><a href="/pyramids" style={{ color: '#ffffff', textDecoration: 'none' }}>Pyramids</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '10px' }}>INFO</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li><a href="/terms-and-conditions" style={{ color: '#ffffff', textDecoration: 'none' }}>Terms & Conditions</a></li>
            <li><a href="/privacy-policy" style={{ color: '#ffffff', textDecoration: 'none' }}>Privacy Policy</a></li>
            <li><a href="/safety-tips" style={{ color: '#ffffff', textDecoration: 'none' }}>Safety tips</a></li>
            <li><a href="/community-guidelines" style={{ color: '#ffffff', textDecoration: 'none' }}>Community Guidelines</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '10px' }}>Join Us</h4>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <a
              href="https://www.facebook.com"
              style={{
                color: '#ffffff',
                backgroundColor: '#3b5998',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com"
              style={{
                color: '#ffffff',
                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.linkedin.com"
              style={{
                color: '#ffffff',
                backgroundColor: '#0077b5',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p>Join As a Tour Guide.</p>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: '#555555', marginBottom: '30px' }} />

      {/* Copyright */}
      <div style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
        <p>CompanyName © 2023. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <span>Eleven</span>
          <span>Twelve</span>
          <span>Thirteen</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;