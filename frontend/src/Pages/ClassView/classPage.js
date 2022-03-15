import React from "react";
import { withRouter } from "react-router";
import ClassMain from "./classMain";

class ClassView extends React.Component {
    render() {
        return (
            <ClassMain />
        );
    }
}

export default withRouter(ClassView)