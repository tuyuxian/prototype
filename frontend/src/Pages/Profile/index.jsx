import React from "react";
import { withRouter } from "react-router";
import SideNav from "../../Components/SideNav"
import {
Container, 
Row, 
Col
} from "react-bootstrap";

const Profile = props => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">      
            <SideNav />
          </Col>
          <Col  xs={10} id="page-content-wrapper">
            this is a test
          </Col> 
        </Row>
      </Container>
    </>
  );
};

export default withRouter(Profile)