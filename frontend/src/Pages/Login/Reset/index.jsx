import React from "react";
import { withRouter } from "react-router";
import '../index.css';
import '../../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { resetpwd } from '../../../Api/login';

class Reset extends React.Component {
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
      var values = { newpassword: this.state.fields.password, birthday: this.state.fields.birthday };
      resetpwd(values)
        .then(
          response => {
            if (this.validateForget(response)) {
              let fields = {};
              fields["password"] = "";
              fields["birthday"] = "";
              this.setState({ fields: fields });
              this.props.history.push('/Login', null)
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

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "*Please enter your password.";
    }

    if (typeof fields["password"] !== "undefined") {
      if (!fields["password"].match(/^(?=.*\d)(?=.*[a-z]).{6,20}$/)) {
        formIsValid = false;
        errors["password"] = "*Please enter secure and strong password.";
      }
    }

    if (!fields["birthday"]) {
      formIsValid = false;
      errors["birthday"] = "*Please enter your birthday.";
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateReset(response) {

    let errors = {};
    let resetIsValid = true;

    if (response["status"] === true) {
      return resetIsValid;
    } else {
      if (response["message"] === "User already login.") {
        resetIsValid = false;
        alert(response["message"]);
        this.props.history.push('/', null)
      }
      if (response["message"] === "ID confirmation failed.") {
        resetIsValid = false;
        errors["birthday"] = "*ID confirmation failed.";
      }
      if (response["message"] === "System error.") {
        resetIsValid = false;
        errors["birthday"] = "*Reset failed.";
      }
      this.setState({
        errors: errors
      });
      return resetIsValid;
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
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control className="inputbar" name="password" type="password" value={this.state.fields.password} onChange={this.handleChange} placeholder="Password" />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.password}</div>
                      </Col>
                    </Row>
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Birthday</Form.Label>
                          <Form.Control className="inputbar"
                            type="date"
                            name="birthday"
                            value={this.state.birthday}
                            onChange={this.handleChange}
                            placeholder="" />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.birthday}</div>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" type="submit" onClick={this.handleSubmit}>
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