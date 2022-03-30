import React from "react";
import { withRouter } from "react-router";
import RegisterForm from "./registerForm";

class Register extends React.Component {
  render() {
    return (
      <RegisterForm />
    );
  }
}

export default withRouter(Register)