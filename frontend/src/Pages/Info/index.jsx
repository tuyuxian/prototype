import React from "react";
import { withRouter } from "react-router";
import avatar from '../../assets/avatar.png';
import './index.css';
import '../../assets/style.css';
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";

class Info extends React.Component {
  render() {
    return (
      <>
        <div>
          <Container fluid>
            <Row>
              <Image src={avatar} roundedCircle></Image>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Username: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Control
                    className="inputbar"
                    type="text"
                    name="Username"
                    placeholder="Username" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> New password: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicNewpassword">
                  <Form.Control
                    className="inputbar"
                    type="password"
                    name="New password"
                    placeholder="New password" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Old password: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicOldpassword">
                  <Form.Control
                    className="inputbar"
                    type="password"
                    name="Old password"
                    placeholder="Old password" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Phone: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Control
                    className="inputbar"
                    type="text"
                    name="Phone"
                    placeholder="Phone number" />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Add status: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-2" controlId="formBasicStatus">
                  <Row className="justify-content-center">
                    <Col xs={4} sm={3}>
                      <Form.Check
                        inline
                        label="Tutor"
                        name="tutor"
                        value='tutor'
                        type="checkbox"
                      />
                    </Col>
                    <Col xs={4} sm={3}>
                      <Form.Check
                        inline
                        label="Student"
                        name="student"
                        value='student'
                        type="checkbox"
                      />
                    </Col>
                    <Col xs={4} sm={3}>
                      <Form.Check
                        inline
                        label="Parent"
                        name="parents"
                        value="parents"
                        type="checkbox"
                        className="ml-3"
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={{span: 2, offset: 10}}>
                <Button className="btn-confirm mx-1 my-1">Confirm</Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Info)