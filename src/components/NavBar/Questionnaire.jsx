import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import React from 'react';
import './QuestionnaireNavbar.css';  

function QuestionnaireNavbar() {
  return (
    <>
      <Navbar className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Logo
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}

export default QuestionnaireNavbar;
