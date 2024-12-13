import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import backgroundImage from "../../assets/images/LandingPage1.png";

function Header({ onLoginClick, onSinupClick }) {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh", // Ensure the header takes full screen height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust opacity for darkness
          zIndex: 1,
        }}
      />

      {/* Navbar Section */}
      <Navbar expand="md" className="mb-3" style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}>
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="https://via.placeholder.com/30"
              alt="Logo"
              style={{ marginRight: "10px", width: "30px", height: "30px" }}
            />
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#fff" }}>Logo</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-md"
            aria-labelledby="offcanvasNavbarLabel-expand-md"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 pe-3">
                <Nav.Link href="#about-us" style={{ color: "#fff", fontSize: "1rem" }}>
                  About Us
                </Nav.Link>
                <Nav.Link href="#blogs" style={{ color: "#fff", fontSize: "1rem" }}>
                  Blogs
                </Nav.Link>
                <Nav.Link href="#trips" style={{ color: "#fff", fontSize: "1rem" }}>
                  Trips
                </Nav.Link>
              </Nav>
              <div>
                {/* Login Button */}
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={onLoginClick} // Trigger onLoginClick passed as prop
                  style={{ backgroundColor: "#17A2B8", border: "none" }}
                >
                  Login
                </Button>
                {/* Signup Button */}
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={onSinupClick}
                  style={{
                    backgroundColor: "#6c757d",
                    border: "none",
                  }}
                >
                  Signup
                </Button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* Header Main Content */}
      <div style={{ textAlign: "center", zIndex: 2, position: "relative", padding: "0 20px" }}>
        <h1
          style={{
            color: "#fff", // White text for visibility on dark background
            fontSize: "4rem",
            fontWeight: "bold",
            margin: "0",
          }}
        >
          Discover Egypt Like Never Before
        </h1>
        <p
          style={{
            color: "#fff", // White text for visibility
            fontSize: "1.2rem",
            marginTop: "20px",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          Your personal virtual tour guide, local experts, and seamless travel experiences—all in one website.
        </p>
        <Button
          variant="primary"
          style={{
            marginTop: "20px",
            fontSize: "1.2rem",
            padding: "10px 20px",
            backgroundColor: "#17A2B8",
            border: "none",
          }}
        >
          Explore Now
        </Button>
      </div>
    </div>
  );
}

export default Header;
