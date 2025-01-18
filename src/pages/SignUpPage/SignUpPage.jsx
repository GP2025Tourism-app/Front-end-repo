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
  
  // State for individual error messages
  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [usernameError, setUsernameError] = useState(""); 
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
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

    // Clear all error messages
    setFirstnameError("");
    setLastnameError("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validate fields
    if (!firstname) {
      setFirstnameError("First name is required.");
    }
    if (!lastname) {
      setLastnameError("Last name is required.");
    }
    if (!username) {
      setUsernameError("Username is required.");
    }
    if (!email) {
      setEmailError("Email is required.");
    }
    if (!password) {
      setPasswordError("Password is required.");
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    }

    // If there are any validation errors, stop the submit process
    if (
      !firstname || 
      !lastname || 
      !username || 
      !email || 
      !password || 
      password !== confirmPassword
    ) {
      return;
    }

    setLoading(true);

    try {

      const signupResponse = await axios.post("http://localhost:8080/api/auth/signup", {
        firstname,          
        lastname,          
        username,          
        email,              
        password,           
      });

      if (signupResponse.status === 200) {
        console.log("User registered successfully:", signupResponse.data);

        // Once signup is successful, try to log the user in
        const loginResponse = await axios.post("http://localhost:8080/api/auth/signin", {
          username,  
          password,  
        });

        if (loginResponse.status === 200) {
          const token = loginResponse.data.token;
          localStorage.setItem('authToken', token);  
          console.log("token", loginResponse.data.token);
          console.log(localStorage.getItem("authToken"));

          navigate("/questionnaire");
        }
      }
    } catch (err) {
      console.error("Error during sign-up or login:", err);

      // Check if the error response exists and set individual field errors
      if (err.response && err.response.data) {
        const errorData = err.response.data;

        if (errorData.password) {
          setPasswordError(errorData.password); 
        }
        if (errorData.email) {
          setEmailError(errorData.email); 
        }
        if (errorData.username) {
          setUsernameError(errorData.username); 
        }
      } else {
        // Handle network or other errors
        setEmailError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
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

        <div className="or-login-with">
          <div className="line"></div>
          <span>or sign up with</span>
          <div className="line"></div>
        </div>

        <div className="social-login">
          <button className="social-btn google-btn">
            <i className="fab fa-google"></i> 
          </button>
          <button className="social-btn facebook-btn">
            <i className="fab fa-facebook-f"></i> 
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
