import React from "react";
import { withRouter } from "react-router";
import './index.css';
import '../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { register } from '../../Api/register';


class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      fields: {
        tutor: false,
        student: false,
        parents: false
      },
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);

  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      var values = {
        username: this.state.fields.username,
        email: this.state.fields.email,
        password: this.state.fields.password,
        birthday: this.state.fields.birthday,
        status_tutor: this.state.fields.tutor,
        status_student: this.state.fields.student,
        status_parents: this.state.fields.parents
      };
      register(values)
        .then(
          response => {
            if (this.validateRegister(response.data)) {
              let fields = {};
              fields["username"] = "";
              fields["email"] = "";
              fields["password"] = "";
              fields["birthday"] = "";
              fields["tutor"] = false;
              fields["student"] = false;
              fields["parents"] = false;
              this.setState({ fields: fields });
              this.props.history.push('/Login')
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
    fields[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      fields
    });
  }

  onChangeStatus = e => {
    const key = e.target.value;
    this.setState(state => ({
      fields: {
        ...this.state.fields,
        [key]: !this.state.fields[key]
      }
    }));
  };

  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "*Please enter your username.";
    }

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
        errors["password"] = "*Please enter secure and strong password.";
      }
    }

    if (!fields["birthday"]) {
      formIsValid = false;
      errors["birthday"] = "*Please enter your birthday.";
    }

    if ((!fields["tutor"]) && (!fields["student"]) && (!fields["parents"])) {
      formIsValid = false;
      errors["status"] = "*Please enter at least one status.";
    }
    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateRegister(response) {
    let errors = {};
    let registerIsValid = true;
    if (response["status"] === true) {
      return registerIsValid;
    } else {
      if (response["message"] === "This account is already exists.") {
        registerIsValid = false;
        errors["email"] = "*This email has been registered.";
      }
      if (response["message"] === "System error.") {
        registerIsValid = false;
        errors["status"] = "*Register failed.";
      }
      this.setState({
        errors: errors
      });
      return registerIsValid;
    }
  }

  render() {
    return (
      <>
        <div className="main">
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
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Username</Form.Label>
                          <Form.Control className="inputbar"
                            type="text"
                            name="username"
                            value={this.state.fields.username}
                            onChange={this.handleChange}
                            placeholder="Username" autoFocus />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.username}</div>
                      </Col>
                    </Row>
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar"
                            type="email"
                            name="email"
                            value={this.state.fields.email}
                            onChange={this.handleChange}
                            placeholder="Enter email" />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.email}</div>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control className="inputbar"
                            type="password"
                            name="password"
                            value={this.state.fields.password}
                            onChange={this.handleChange}
                            placeholder="Password" />
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
                            value={this.state.fields.birthday}
                            onChange={this.handleChange}
                            placeholder="" />
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.birthday}</div>
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
                                name="tutor"
                                value='tutor'
                                type="checkbox"
                                checked={this.state.fields.tutor}
                                onChange={this.onChangeStatus}
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Student"
                                name="student"
                                value='student'
                                type="checkbox"
                                checked={this.state.fields.student}
                                onChange={this.onChangeStatus}
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Parent"
                                name="parents"
                                value="parents"
                                type="checkbox"
                                checked={this.state.fields.parents}
                                onChange={this.onChangeStatus}
                                className="ml-3"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                        <div className="errorMsg">{this.state.errors.status}</div>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" type="submit" onClick={this.handleSubmit}>
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