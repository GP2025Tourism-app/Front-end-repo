import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React from 'react';

// Replace this with your actual image URL
const backgroundImageUrl = 'https://via.placeholder.com/1920x1080'; // Example image URL

function Header() {
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImageUrl})`, // Set the background image
          backgroundSize: 'cover', // Ensure the image covers the entire container
          backgroundPosition: 'center', // Center the image
          height: '100vh', // Make it take up the full viewport height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Vertically center the content
          alignItems: 'center', // Horizontally center the content
          position: 'relative',
        }}
      >
        <Navbar expand="md" className="mb-3" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          <Container fluid>
            {/* Logo with an Image beside it */}
            <Navbar.Brand href="#">
              <img
                src="https://via.placeholder.com/30" // Replace with your logo image URL
                alt="Logo"
                style={{ marginRight: '10px', width: '30px', height: '30px' }}
              />
              Logo
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-md"
              aria-labelledby="offcanvasNavbarLabel-expand-md"
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-center flex-grow-1 pe-3">
                  <Nav.Link href="#action1">About Us</Nav.Link>
                  <Nav.Link href="#action2">Blogs</Nav.Link>
                  <Nav.Link href="#action3">Trips</Nav.Link>
                </Nav>
                <Button variant="primary" className="ms-2">
                  Login
                </Button>

                <Button variant="primary" className="ms-2">
                  Signup
                </Button>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        {/* Centered Title */}
        <h1 style={{
          color: '#000', 
          fontSize: '4rem', // Make the font size relative to the viewport width
          zIndex: 1,
          position: 'absolute', // Ensures it's over the background image
        }}>
         Discover Egypt Like Never Before
        </h1>
        <p style={{
          color: '#000', 
          fontSize: '1.2rem',  // Make the font size relative to the viewport width
          zIndex: 1,
          position: 'absolute', // Ensures it's over the background image
          top: '50%', // Adjust the position of the second heading (your personal)
          textAlign: 'center', // Center the text horizontally
          maxWidth: '80%', // Ensure the text doesn't overflow
          marginTop: '45px', // Add space between the two texts
        }}>
          Your personal virtual tour guide, local experts, and seamless travel experiences—all in one Website.
        </p>
        <Button
          variant="primary"
          style={{
            marginTop: '40px', // Space between subtitle and button
            fontSize: '1.2rem', // Adjust size
            padding: '10px 20px', // Padding for button
            zIndex: 1,
            position: 'absolute',
            bottom: '20%', // Adjust the position from the bottom of the screen
          }}
        >
          Explore Now
        </Button>
      </div>
    </>
  );
}

export default Header;
