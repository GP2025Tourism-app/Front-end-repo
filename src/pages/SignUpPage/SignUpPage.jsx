import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
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
  
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [usernameError, setUsernameError] = useState(""); 
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [clientId, setclientId] = useState(null); 

  const token = localStorage.getItem("authToken");
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
  
    setFirstnameError("");
    setLastnameError("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  
    if (!firstname) setFirstnameError("First name is required.");
    if (!lastname) setLastnameError("Last name is required.");
    if (!username) setUsernameError("Username is required.");
    if (!email) setEmailError("Email is required.");
    if (!password) setPasswordError("Password is required.");
    if (password !== confirmPassword) setConfirmPasswordError("Passwords do not match.");
  
    if (!firstname || !lastname || !username || !email || !password || password !== confirmPassword) {
      return;
    }
  
    setLoading(true);
  
    try {
      // Step 1: Sign up the user
      const signupResponse = await axios.post("http://localhost:8080/api/auth/signup", {
        firstname,
        lastname,
        username,
        email,
        password,
      });
  
      if (signupResponse.status === 200) {
        console.log("User registered successfully:", signupResponse.data);
  
        // Step 2: Log in the user immediately after signing up
        const loginResponse = await axios.post("http://localhost:8080/api/auth/signin", {
          username,
          password,
        });
  
        if (loginResponse.status === 200) {
          const authToken = loginResponse.data.token; // Extract the token
          localStorage.setItem("authToken", authToken); // Store it in localStorage
          console.log("User logged in successfully:", authToken);
  
          setShowLocationPopup(true); // Show location request popup
        }
      }
    } catch (err) {
      console.error("Error during sign-up or login:", err);
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.password) setPasswordError(errorData.password);
        if (errorData.email) setEmailError(errorData.email);
        if (errorData.username) setUsernameError(errorData.username);
      } else {
        setEmailError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const requestLocation = async () => {
    const authToken = localStorage.getItem("authToken"); // Retrieve the token
  
    if (!authToken) {
      console.error("No auth token found. Please log in.");
      return;
    }
  
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            // Use URLSearchParams to send as form-encoded data
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
            setShowLocationPopup(false);
            navigate("/questionnaire");
          } catch (err) {
            console.error("Error sending location:", err);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setShowLocationPopup(false);
          navigate("/questionnaire");
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setShowLocationPopup(false);
      navigate("/questionnaire");
    }
  };
  
  
  
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-card-signup">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Sign Up</h3>
        <Form onSubmit={handleSubmit}>
          <div className="form-row">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={firstname}
              onChange={(e) => setfirstname(e.target.value)}
            />
            {firstnameError && <div className="error-message">{firstnameError}</div>}
          </div>
          
          <div className="form-row">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastname}
              onChange={(e) => setlastname(e.target.value)}
            />
            {lastnameError && <div className="error-message">{lastnameError}</div>}
          </div>

          <div className="form-row">
            <Form.Label>Username</Form.Label> 
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <div className="error-message">{usernameError}</div>}
          </div>

          <div className="form-row">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="error-message">{emailError}</div>}
          </div>

          <div className="form-row">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="error-message">{passwordError}</div>}
          </div>

          <div className="form-row">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
          </div>

          <Button variant="primary" type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Form>
      </div>

      {showLocationPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h4>Allow Location Access?</h4>
            <p>We need your live location to enhance your experience.</p>
            <Button variant="success" onClick={requestLocation}>Allow</Button>
            <Button variant="danger" onClick={() => { setShowLocationPopup(false); navigate("/questionnaire"); }}>
              Deny
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUpPage;
