import { useState, useEffect } from "react";
import AttendanceItem from "./attendanceItem";
import { getAttendance } from '../../Api/attendance';
import { Container, Row, Col, Button } from "react-bootstrap";
import NewAttendanceModal from "./attendanceModal";
import './attendance.css';
import '../../assets/style.css';
import SideBar from "../../Components/SideBar";

// get data
async function getAttendanceData(setData) {
    await getAttendance().then(response => {
        console.log(response.data);
        setData(response.data);
    }).catch(error => {
        const errors = error.response.data;
        if (errors.code === 400) {
            alert(errors.description);
        };
    });
}

export default function AttendanceMain() {
    const [data, setData] = useState();
    const [showModal, setShowModal] = useState(false);
    const Toggle = () => setShowModal(!showModal);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const ToggleNoteModal = () => setShowNoteModal(!showNoteModal);
    const [selectAttendance, setSelectAttendance] = useState("");
    const [selectCheck, setSelectCheck] = useState();
    function clickAttendanceNote(v) {
        ToggleNoteModal();
        setSelectAttendance(v);
    };
    const [showCheckModal, setShowCheckModal] = useState(false);
    const ToggleCheckModal = () => setShowCheckModal(!showCheckModal);
    function clickAttendanceCheck(id, check) {
        ToggleCheckModal();
        setSelectAttendance(id);
        setSelectCheck(check)
    };

    useEffect(() => {
        getAttendanceData(setData);
    }, []);

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <SideBar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper" style={{ top: "72px", marginTop: "2%" }}>
                        <h1 className='Top' style={{ marginBottom: "2%" }}> {data?.classname} </h1>
                        <Container fluid id="attendance">
                            <AttendanceItem
                                data={data}
                                noteClick={ToggleNoteModal}
                                checkClick={ToggleCheckModal}
                                showNote={showNoteModal}
                                showCheck={showCheckModal}
                                passAttendanceNote={clickAttendanceNote}
                                passAttendanceCheck={clickAttendanceCheck}
                                selectAttendance={selectAttendance}
                                selectCheck={selectCheck}
                            />
                        </Container>
                        <Button variant="primary" onClick={(e) => Toggle()} id="record">+ Record</Button>
                    </Col>
                </Row>
            </Container>
            <NewAttendanceModal show={showModal} close={Toggle} classID={data?.classID} style={{ overflow: "visible" }} />
        </>
    );
}