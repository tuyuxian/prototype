import React from "react";
import { withRouter } from "react-router";
import './index.css';
import '../index.css';
import '../../../assets/style.css';
import {
  Container,
  Row,
  Col
} from "react-bootstrap";

class Status extends React.Component {
  render() {
    return (
      <>
        <div className="sub">
          <Container fluid>
            <Row className="justify-content-center">
              <Col>
                <h1 className="banner text-center">Today, I'm</h1>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col xs={4}>
                <div className="circle-tutor mx-auto d-block"></div>
              </Col>
              <Col xs={4}>
                <div className="circle-student mx-auto d-block"></div>
              </Col>
              <Col xs={4}>
                <div className="circle-parent mx-auto d-block"></div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Status)