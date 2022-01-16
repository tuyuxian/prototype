import React from "react";
import { withRouter } from "react-router";
import ResetForm from "./resetForm";

class Reset extends React.Component {
  render() {
    return (
      <ResetForm />
    );
  }
}

export default withRouter(Reset)