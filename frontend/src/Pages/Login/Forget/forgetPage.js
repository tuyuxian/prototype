import React from "react";
import { withRouter } from "react-router";
import ForgetForm from "./forgetForm";

class Forget extends React.Component {
  render() {
    return (
      <ForgetForm />
    );
  }
}

export default withRouter(Forget)