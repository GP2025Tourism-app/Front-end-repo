import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./LoginPage.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function LoginPage({ show, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disable scrolling on the body when the popup is shown
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signin", {
        username,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
              // Save the token to localStorage
      const token = response.data.token; 
      localStorage.setItem("authToken", token);

      // Save user data if needed
      localStorage.setItem("userData", JSON.stringify(response.data));
      onClose(); // Close the popup after successful login
      }
    } catch (err) {
      console.error("Error during login:", err);
      if (err.response) {
        // Server responded with an error
        setError(err.response.data.message || "Login failed. Please try again.");
      } else {
        // Network or other errors
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null; 

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Login</h3>
        {error && <div className="error-message">{error}</div>} 
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          <Button variant="primary" type="submit" style={{ display: "block", width: "100%" }} disabled={loading}>
              {loading ? "logging in..." : "Login"}
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
