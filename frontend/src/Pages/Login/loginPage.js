import React from "react";
import { withRouter } from "react-router";
import LoginForm from "./loginForm";

class Login extends React.Component {
    render() {
        return (
            <LoginForm />
        );
    }
}

export default withRouter(Login)