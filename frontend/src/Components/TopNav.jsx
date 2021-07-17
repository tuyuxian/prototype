import React from "react";
import { withRouter } from "react-router";
import "../assets/style.css";
import {useLocation} from 'react-router-dom';
import {
Navbar, 
Container,
Nav,
Button
} from 'react-bootstrap';

const TopNav = () => {
  let location = useLocation().pathname
  
  return (
    <>
      <Navbar className="nav-main" collapseOnSelect fixed="Top" expand="sm">
        <Container fluid>
          <Navbar.Brand href="/">
            <Navbar.Text className="logo">ICON</Navbar.Text>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
            <Nav>
              { location === "/" &&
                <Nav.Link className="mr-2 ml-1" href="#"> About </Nav.Link>
              }
              { (location === "/" || location === "/Register") &&
                <Button className="btn-nav mx-1 my-1" href="/Login">Login</Button>
              }
              { (location === "/" || location === "/Login") &&
                <Button className="btn-nav mx-1 my-1" href="/Register">Sign Up</Button>
              }
              { (location.startsWith("/Profile") || location.startsWith("/Edit")) &&
                <Button className="btn-nav mx-1 my-1" href="/Status">Change</Button>
              }
              { (location.startsWith("/Profile") || location.startsWith("/Edit")) &&
                <Button className="btn-nav mx-1 my-1" href="/">Logout</Button>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default withRouter(TopNav)