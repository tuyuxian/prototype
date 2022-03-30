import React from "react";
import { withRouter } from "react-router";
import "../assets/style.css";
import logo from '../assets/logo.png';
import { useLocation } from 'react-router-dom';
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
      <Navbar className="nav-main" collapseOnSelect expand="sm" fixed="top" style={{ height: "72px" }}>
        <Container fluid>
          <Navbar.Brand href="/">
            <img
              src={logo}
              className="d-inline-block align-top logo-brand"
              alt="logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" bg="black">
            <Nav>
              {location === "/" &&
                <Nav.Link href="#"> About </Nav.Link>
              }
              {(location === "/" || location === "/Register" || location === "/register") &&
                <Button className="btn-nav mx-1 my-1" href="/Login">Login</Button>
              }
              {(location === "/" || location === "/Login" || location === "/login") &&
                <Button className="btn-nav mx-1 my-1" href="/Register">Sign Up</Button>
              }
              {(location.startsWith("/Profile") || location.startsWith("/profile") || location.startsWith("/Edit") || location.startsWith("/edit")) &&
                <Button className="btn-nav mx-1 my-1" href="/Status">Change</Button>
              }
              {(location.startsWith("/Profile") || location.startsWith("/profile") || location.startsWith("/Edit") || location.startsWith("/edit")) &&
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