import React from "react";
import { withRouter } from "react-router";
import './index.css';
import '../../assets/style.css';
import { 
Container, 
Row, 
Col,
Form,
Button,
Modal
} from "react-bootstrap";

class Register extends React.Component {
  render() {
    return (
      <>
        <div class="main">
          <Container fluid>
            <div className="register-form">
              <Modal.Dialog size="lg" centered>
                <Modal.Body>
                  <Row className="justify-content-center">
                    <Col>
                      <h2 className="banner text-center mt-3"> Lets Go! </h2>
                    </Col>
                  </Row>
                  <Form>
                    <Row  className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Username</Form.Label>
                          <Form.Control className="inputbar" type="text" placeholder="Username" autoFocus/>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row  className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" type="email" placeholder="Enter email"/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row  className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control className="inputbar" type="password" placeholder="Password" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-2" controlId="formBasicPassword">
                          <Form.Label>You are</Form.Label>
                          <Row className="justify-content-center">
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Tutor"
                                type="checkbox"
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Student"
                                type="checkbox"
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Parent"
                                type="checkbox"
                                className="ml-3"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" type="submit">
                          Sign Up
                        </Button>
                      </Col>  
                    </Row>
                  </Form>
                </Modal.Body>
              </Modal.Dialog>
            </div>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Register)