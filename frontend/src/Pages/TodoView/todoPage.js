import React from "react";
import { withRouter } from "react-router";
import { TodoMain } from "./todoMain";

class TodoView extends React.Component {
    render() {
        return (
            <TodoMain />
        );
    }
}

export default withRouter(TodoView)