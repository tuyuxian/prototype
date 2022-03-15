import React from "react";
import { withRouter } from "react-router";
import AttendanceMain from "./attendanceMain";

class Attendance extends React.Component {
    render() {
        return (
            <AttendanceMain />
        );
    }
}

export default withRouter(Attendance)