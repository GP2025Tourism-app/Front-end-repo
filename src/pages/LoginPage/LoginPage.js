import React, { useState } from "react";
import { useEffect } from "react";
import "./LoginPage.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function LoginPage({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    // Disable scrolling on the body when the popup is shown
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    setError(""); // Clear error if the form is valid
    // Handle login logic here
    console.log("Logging in with:", email, password);
    onClose(); // Close the popup after submitting
  };

  if (!show) return null; // Do not render if not visible

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Login</h3>
        {error && <div className="error-message">{error}</div>} {/* Display error message */}
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-row">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button variant="primary" type="submit" block>
            Login
          </Button>
        </Form>

        {/* 'Or login with' Section */}
        <div className="or-login-with">
          <div className="line"></div>
          <span>or login with</span>
          <div className="line"></div>
        </div>

        {/* Social login buttons */}
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

export default LoginPage;
