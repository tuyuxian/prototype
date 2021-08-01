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
      fields: {},
      errors: {}
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      var values = { email: this.state.fields.email, password: this.state.fields.password };
      HttpUtil.post(ApiUtil.API_Login_Post, values)
        .then(
          response => {
            if (this.validateLogin(response)) {
              let fields = {};
              fields["email"] = "";
              fields["password"] = "";
              this.setState({ fields: fields });
              this.props.history.push('/Status', response) // send the email and account status T/F to front-end
            }
          }
        )
        .catch(error => {
          //message.error(error.message);
        });
    }
  }

  handleChange(event) {
    let fields = this.state.fields;
    fields[event.target.type] = event.target.value;
    this.setState({
      fields
    });
  }

  validateForm() {

    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "*Please enter your email.";
    }

    if (typeof fields["email"] !== "undefined") {
      //regular expression for email validation
      var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "*Please enter valid email.";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (!fields["password"].match(/^(?=.*\d)(?=.*[a-z]).{6,20}$/)) {
        formIsValid = false;
        errors["password"] = "*Please enter valid password.";
      }
    }
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateLogin(response) {
    // let response = response;
    let errors = {};
    let loginIsValid = true;
    if (response["status"] === true) {
      return loginIsValid;
    } else {
      if (response["message"] === "Wrong password.") {
        loginIsValid = false;
        errors["password"] = "*Wrong password.";
      }
      if (response["message"] === "User is not found.") {
        loginIsValid = false;
        errors["email"] = "*User is not found.";
      }
      if (response["message"] === "System error.") {
        loginIsValid = false;
        errors["email"] = "*Login failed.";
      }
      this.setState({
        errors: errors
      });
      return loginIsValid;
    }
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
                            value={this.state.fields.email}
                            onChange={this.handleChange}
                            placeholder="Enter email" autoFocus />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.email}</div>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control className="inputbar" type="password"
                            value={this.state.fields.password}
                            onChange={this.handleChange}
                            placeholder="Password" />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.password}</div>
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
                        <Button className="btn-submit" onClick={this.handleSubmit} >
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