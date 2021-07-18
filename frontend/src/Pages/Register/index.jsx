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
import ApiUtil from '../../Utils/ApiUtils';
import HttpUtil from '../../Utils/HttpUtils';


class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      birthday: '',
      status: {
        tutor: false,
        student: false,
        parent: false
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);

  }

  handleClick(event) {
    var values = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      birthday: this.state.birthday,
      status_tutor: this.state.status.tutor,
      status_student: this.state.status.student,
      status_parents: this.state.status.parent
    };
    event.preventDefault();
    HttpUtil.post(ApiUtil.API_Register_Post, values)
      .then(
        response => {
          console.log(response);
          this.props.history.push('/Login')
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }
  onChangeStatus = e => {
    const key = e.target.value;
    this.setState(state => ({
      status: {
        ...this.state.status,
        [key]: !this.state.status[key]
      }
    }));
  };

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
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Username</Form.Label>
                          <Form.Control className="inputbar" type="text" name="username" value={this.state.username} onChange={this.handleChange} placeholder="Username" autoFocus />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control className="inputbar" type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter email" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                          <Form.Label>Password</Form.Label>
                          <Form.Control className="inputbar" type="password" name="password" value={this.state.password} onChange={this.handleChange} placeholder="Password" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3 justify-content-center">
                      <Col xs={9}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                          <Form.Label>Birthday</Form.Label>
                          <Form.Control className="inputbar" type="date" name="birthday" value={this.state.birthday} onChange={this.handleChange} placeholder="" />
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
                                value='tutor'
                                type="checkbox"
                                checked={this.state.status.tutor}
                                onChange={this.onChangeStatus}
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Student"
                                value='student'
                                type="checkbox"
                                checked={this.state.status.student}
                                onChange={this.onChangeStatus}
                              />
                            </Col>
                            <Col xs={4} sm={3}>
                              <Form.Check
                                inline
                                label="Parent"
                                value="parent"
                                type="checkbox"
                                checked={this.state.status.parent}
                                onChange={this.onChangeStatus}
                                className="ml-3"
                              />
                            </Col>
                          </Row>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="mb-3 mt-5 justify-content-center">
                      <Col xs={8}>
                        <Button className="btn-submit" type="submit" onClick={this.handleClick}>
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