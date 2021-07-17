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

class Forget extends React.Component {
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
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" type="email" placeholder="Enter email" autoFocus/>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" href="/Reset">
                          Send me the link
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

export default withRouter(Forget)