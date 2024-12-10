import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./signup.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SignUpPage({ show, onClose }) {
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear error if form is valid
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signup", {
        firstname,          
        lastname,          
        username,          
        email,              
        password,           
      });

      
      if (response.status === 200) {
        console.log("User registered successfully:", response.data);
        onClose(); // Close the popup after successful sign-up
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      if (err.response) {
        setError(err.response.data.message || "Sign-up failed. Please try again.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; // Do not render if not visible

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Sign Up</h3>
        {error && <div className="error-message">{error}</div>} {/* Display error message */}
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
            />
          </div>
          
          <div className="form-row">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
            />
          </div>

          <div className="form-row">
            <Form.Label>Username</Form.Label> {/* New field for username */}
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-row">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-row">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-row">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button variant="primary" type="submit" style={{ display: "block", width: "100%" }} disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
          </Button>

        </Form>

        <div className="or-login-with">
          <div className="line"></div>
          <span>or sign up with</span>
          <div className="line"></div>
        </div>

        <div className="social-login">
          <button className="social-btn google-btn">
            <i className="fab fa-google"></i> {/* Google icon */}
          </button>
          <button className="social-btn facebook-btn">
            <i className="fab fa-facebook-f"></i> {/* Facebook icon */}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
