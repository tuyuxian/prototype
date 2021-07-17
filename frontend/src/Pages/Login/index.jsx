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

class Login extends React.Component {
  render() {
    return (
      <>
        <div class="main">
          <Container fluid>
            <div className="login-form">
              <Modal.Dialog size="lg" centered>
                <Modal.Body>
                  <Row className="justify-content-center">
                    <Col>
                      <h2 className="banner text-center mt-3"> Welcome Back! </h2>
                    </Col>
                  </Row>
                  <Form>
                    <Row  className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" type="email" placeholder="Enter email" autoFocus/>
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

                    <Row className="mb-3 justify-content-end">
                      <Col md={{ span: 4, offset: 8 }} xs={{ span: 6, offset: 6 }}>
                        <a href="/forget">Forget Password?</a>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        {/* <Button className="btn-submit" type="submit">
                          Log In
                        </Button> */}
                        <Button className="btn-submit" href="/Profile">
                          Log In
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

export default withRouter(Login)