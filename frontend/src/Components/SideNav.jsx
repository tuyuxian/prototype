import React from "react";
import { withRouter } from "react-router";
import './SideNav.css'
import {
Nav
} from "react-bootstrap";
import { BsBook, BsQuestion } from 'react-icons/bs';
import { AiOutlineBars, AiOutlineCheck } from 'react-icons/ai';
import { RiBarChart2Fill } from 'react-icons/ri';

const SideNav = (props) => {
  return (
    <>
      <Nav className="col-2 col-sm-1 d-block sidebar">
        <div className="sidebar-sticky"></div>
          <Nav.Item>
            <Nav.Link href="/"> <BsBook /> </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/"> <AiOutlineBars /> </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/"> <AiOutlineCheck /> </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/"> <BsQuestion /> </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/"> <RiBarChart2Fill /> </Nav.Link>
          </Nav.Item>
      </Nav>
    </>
  );
};

export default withRouter(SideNav)