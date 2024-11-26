import React, { useState, useEffect } from "react";
import "./signup.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function SignUpPage({ show, onClose }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(""); // Clear error if form is valid
    // Handle sign-up logic here
    console.log("Signing up with:", firstName, lastName, email, password);
    onClose(); // Close the popup after submitting
  };

  if (!show) return null;

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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          
          <div className="form-row">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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

          <Button variant="primary" type="submit" block>
            Sign Up
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
