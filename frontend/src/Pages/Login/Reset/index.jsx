import React from "react";
import { withRouter } from "react-router";
import '../index.css';
import '../../../assets/style.css';
import { 
Container, 
Row, 
Col,
Form,
Button,
Modal
} from "react-bootstrap";

class Reset extends React.Component {
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
                      <h2 className="banner text-center"> Welcome Back! </h2>
                    </Col>
                  </Row>
                  <Form>
                    <Row  className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control className="inputbar" type="password" placeholder="Password" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" type="submit">
                          Reset
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

export default withRouter(Reset)