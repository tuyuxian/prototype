import React from "react";
import { withRouter } from "react-router";
import avatar from '../../assets/avatar.png';
import './index.css';
import '../../assets/style.css';
import { Container, Row, Col, Image, Form, Button } from "react-bootstrap";
import { getProfile, profileModify } from "../../Api/info";

class Info extends React.Component {
  constructor() {
    super();
    this.state = {
      fields: {
        username: "",
        oldPassword: "",
        newPassword: "",
        phone: "",
        tutor: "",
        student: "",
        parents: ""
      },
      errors: {}
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    getProfile()
      .then(
        response => {
          this.setState({
            fields: {
              username: response.data['account_info']['username'],
              phone: response.data['account_info']['phone'],
              tutor: response.data['account_info']['status_tutor'],
              student: response.data['account_info']['status_student'],
              parents: response.data['account_info']['status_parents'],
            }
          });
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      var values = {
        username: this.state.fields.username,
        oldpassword: this.state.fields.oldPassword,
        newpassword: this.state.fields.newPassword,
        phone: this.state.fields.phone,
        status_tutor: this.state.fields.tutor,
        status_student: this.state.fields.student,
        status_parents: this.state.fields.parents
      };
      profileModify(values)
        .then(
          response => {
            if (this.validateProfileModify(response.data)) {
              let fields = {};
              fields["username"] = this.state.fields.username;
              fields["oldPassword"] = "";
              fields["newPassword"] = "";
              fields["phone"] = this.state.fields.phone;
              fields["tutor"] = this.state.fields.tutor;
              fields["student"] = this.state.fields.student;
              fields["parents"] = this.state.fields.parents;
              this.props.history.push('/Profile')
            }
          }
        )
        .catch(error => {
          //message.error(error.message);
        });
    }
  }


  validateForm() {
    let fields = this.state.fields;
    let errors = {};
    let formIsValid = true;

    if (typeof fields["oldPassword"] !== "undefined") {
      if (!fields["newPassword"]) {
        formIsValid = false;
        errors["newPassword"] = "*Please enter your new password.";
      }
    }

    if (typeof fields["newPassword"] !== "undefined") {
      if (!fields["newPassword"].match(/^(?=.*\d)(?=.*[a-z]).{6,20}$/)) {
        formIsValid = false;
        errors["newPassword"] = "*Please enter secure and strong password.";
      }
    }

    if (typeof fields["phone"] !== "undefined") {
      if (!fields["phone"].match(/^\d{10}$/)) {
        formIsValid = false;
        errors["phone"] = "*Please enter valid phone number.";
      }
    }

    this.setState({
      errors: errors
    });
    return formIsValid;
  }

  validateProfileModify(response) {
    let errors = {};
    let profileModifyIsValid = true;
    if (response["status"] === true) {
      return profileModifyIsValid;
    } else {
      if (response["message"] === "Old password is wrong.") {
        profileModifyIsValid = false;
        errors["oldPassword"] = "*Old password is wrong.";
      }
      if (response["message"] === "New password is same as the old one.") {
        profileModifyIsValid = false;
        errors["newPassword"] = "*New password is same as the old one.";
      }
      if (response["message"] === "query_account is None.") {
        profileModifyIsValid = false;
        errors["status"] = "*System error.";
      }
      if (response["message"] === "Update account info failed.") {
        profileModifyIsValid = false;
        errors["status"] = "*System error.";
      }
      this.setState({
        errors: errors
      });
      return profileModifyIsValid;
    }
  }

  handleChange(event) {
    let fields = this.state.fields;
    fields[event.target.name] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({
      fields
    });
  }

  onChangeStatus = event => {
    const key = event.target.value;
    this.setState(state => ({
      fields: {
        ...this.state.fields,
        [key]: !this.state.fields[key]
      }
    }));
  };

  render() {
    return (
      <>
        <div>
          <Container fluid>
            <Row>
              <Image src={avatar} roundedCircle></Image>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Username: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Control
                    className="inputbar"
                    type="text"
                    name="Username"
                    value={this.state.fields.username}
                    onChange={this.handleChange}
                    placeholder={this.state.fields.username} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Old password: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicOldpassword">
                  <Form.Control
                    className="inputbar"
                    type="password"
                    name="oldPassword"
                    value={this.state.fields.oldPassword}
                    onChange={this.handleChange}
                    placeholder="Old password" />
                </Form.Group>
                <div className="errorMsg">{this.state.errors.oldPassword}</div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> New password: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicNewpassword">
                  <Form.Control
                    className="inputbar"
                    type="password"
                    name="newPassword"
                    value={this.state.fields.newPassword}
                    onChange={this.handleChange}
                    placeholder="New password" />
                </Form.Group>
                <div className="errorMsg">{this.state.errors.newPassword}</div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Phone: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Control
                    className="inputbar"
                    type="text"
                    name="phone"
                    value={this.state.fields.phone}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <div className="errorMsg">{this.state.errors.phone}</div>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col xs={3}>
                <h1 className="form-label"> Add status: </h1>
              </Col>
              <Col xs={8}>
                <Form.Group className="mb-2" controlId="formBasicStatus">
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
            <Row className="mt-5">
              <Col xs={{ span: 2, offset: 10 }}>
                <Button className="btn-confirm mx-1 my-1" onClick={this.handleSubmit} >Confirm</Button>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Info)