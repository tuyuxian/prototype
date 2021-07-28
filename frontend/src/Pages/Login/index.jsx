import React from "react";
import { withRouter } from "react-router";
import './index.css';
import '../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import ApiUtil from '../../Utils/ApiUtils';
import HttpUtil from '../../Utils/HttpUtils';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    };
    // Validation
    // const { register, handleSubmit, formState: { errors } } = useForm();
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    var values = { email: this.state.email, password: this.state.password };
    event.preventDefault();
    HttpUtil.post(ApiUtil.API_Login_Post, values)
      .then(
        response => {
          console.log(response['status']);
          console.log(response['message']);
          this.props.history.push('/Status', response) // send the email and account status T/F to front-end
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.type;
    this.setState({
      [name]: value
    });
  }
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
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" type="email"
                            value={this.state.email}
                            // {...register("email", {
                            //   validate: (value) => value !== "bill"
                            // })}
                            onChange={this.handleChange}
                            placeholder="Enter email" autoFocus />

                          {/* {errors.firstName && <p>Your name is not bill</p>} */}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control className="inputbar" type="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
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
                        <Button className="btn-submit" onClick={this.handleClick} >
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