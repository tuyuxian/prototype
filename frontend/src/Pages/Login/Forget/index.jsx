import React from "react";
import { withRouter } from "react-router";
import '../index.css';
import '../../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import ApiUtil from '../../../Utils/ApiUtils';
import HttpUtil from '../../../Utils/HttpUtils';

class Forget extends React.Component {
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
      var values = { email: this.state.fields.email };
      HttpUtil.post(ApiUtil.API_ForgetPassword_Post, values)
        .then(
          response => {
            if (this.validateForget(response)) {
              let fields = {};
              fields["email"] = "";
              this.setState({ fields: fields });
              this.props.history.push('/Reset', null)
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
    fields[event.target.name] = event.target.value;
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
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateForget(response) {
    let errors = {};
    let forgetIsValid = true;
    if (response["status"] === true) {
      return forgetIsValid;
    } else {
      if (response["message"] === "User already login.") {
        forgetIsValid = false;
        alert(response["message"]);
        this.props.history.push('/', null)
      }
      if (response["message"] === "User is not found.") {
        forgetIsValid = false;
        errors["email"] = "*User is not found.";
      }
      this.setState({
        errors: errors
      });
      return forgetIsValid;
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
                      <h2 className="banner text-center"> Welcome Back! </h2>
                    </Col>
                  </Row>
                  <Form>
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" name="email" type="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" autoFocus />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.email}</div>
                      </Col>
                    </Row>

                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" onClick={this.handleSubmit}>
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