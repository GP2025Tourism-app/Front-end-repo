import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import logo from '../../assets/images/RoamRightLogo.svg';
import './QuestionnaireNavbar.css';  

function QuestionnaireNavbar() {
  return (
    <>
      <Navbar className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="100"
              height="40"
              className="d-inline-block align-top"
            />{' '}
           
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default QuestionnaireNavbar;
