import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./LoginPage.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function LoginPage({ show, onClose }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { username: "", password: "", general: "" };

    if (!username) {
      newErrors.username = "Username is required.";
      hasError = true;
    }

    if (!password) {
      newErrors.password = "Password is required.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ username: "", password: "", general: "" });
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/auth/signin", {
        username,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        const token = response.data.token;
        const userid=response.data.id;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId",userid)

        localStorage.setItem("userData", JSON.stringify(response.data));

        requestLocation(token);

        onClose(); // Close login popup
      }
    } catch (err) {
      console.error("Error during login:", err);
      if (err.response) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          general: err.response.data.message || "Login failed. Please try again.",
        }));
      } else {
        setErrors({ ...errors, general: "An error occurred. Please try again later." });
      }
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = (authToken) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Send location to backend
            const params = new URLSearchParams();
            params.append("latitude", latitude);
            params.append("longitude", longitude);

            await axios.put("http://localhost:8080/api/clients/location", params, {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            });

            console.log("Location sent successfully");
            navigate("/homepage"); // Navigate after location update
          } catch (err) {
            console.error("Error sending location:", err);
            navigate("/homepage"); // Navigate even if location fails
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          navigate("/homepage"); // Navigate even if geolocation fails
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      navigate("/homepage"); // Navigate even if geolocation is not supported
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
        {errors.general && <div className="error-message">{errors.general}</div>} 
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isInvalid={!!errors.username}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>
          <div className="form-row">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          <Button variant="primary" type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
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
