import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

const backgroundImageUrl = "https://via.placeholder.com/1920x1080";

function Header({ onLoginClick , onSinupClick}) {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Navbar Section */}
      <Navbar expand="md" className="mb-3" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="https://via.placeholder.com/30"
              alt="Logo"
              style={{ marginRight: "10px", width: "30px", height: "30px" }}
            />
            <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#000" }}>Egypt Tours</span>
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
                <Nav.Link href="#about-us" style={{ color: "#000", fontSize: "1rem" }}>
                  About Us
                </Nav.Link>
                <Nav.Link href="#blogs" style={{ color: "#000", fontSize: "1rem" }}>
                  Blogs
                </Nav.Link>
                <Nav.Link href="#trips" style={{ color: "#000", fontSize: "1rem" }}>
                  Trips
                </Nav.Link>
              </Nav>
              <div>
                {/* Login Button */}
                <Button
                  variant="primary"
                  className="ms-2"
                  onClick={onLoginClick} // Trigger onLoginClick passed as prop
                  style={{ backgroundColor: "#007bff", border: "none" }}
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
      <div style={{ textAlign: "center", zIndex: 1, position: "relative" }}>
        <h1 style={{ color: "#000", fontSize: "4rem", fontWeight: "bold" }}>
          Discover Egypt Like Never Before
        </h1>
        <p
          style={{
            color: "#000",
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
            backgroundColor: "#007bff",
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
