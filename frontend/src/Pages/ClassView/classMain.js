import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import '../../assets/style.css';
import './class.css';
import SideBar from "../../Components/SideBar";
import ClassCard from "./classCard";
import CreateClassModal from "./classCreateModal";
import { getClass } from "../../Api/class";

export default function ClassMain() {

    const [showCreateClassModal, setShowCreateClassModal] = useState(false);
    const Toggle = () => setShowCreateClassModal(!showCreateClassModal);

    const [classData, setClassData] = useState([
        {
            id: 1,
            classId: 1,
            classUrl: 'https://123.com/1',
            classTitle: 'Math',
            classStart: '2022/02/01',
            classEnd: '2022/3/1',
            classWeekday: 'WED / FRI',
            classPayment: 500
        },
        {
            id: 2,
            classId: 2,
            classUrl: 'https://123.com/2',
            classTitle: 'Math',
            classStart: '2022/02/01',
            classEnd: '2022/3/1',
            classWeekday: 'WED / FRI',
            classPayment: 500
        },

    ]);

    // get data
    async function getClassData(setClassData) {
        await getClass().then(response => {
            console.log(response.data);
            setClassData(response.data);
        }).catch(error => {
            const errors = error.response.data;
            if (errors.code === 401) {
                alert(errors.description);
            };
        });
    };

    useEffect(() => {
        //get
        getClassData();
    }, []);

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <SideBar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper" style={{ top: "72px", marginTop: "2%", justifyContent: 'space-between' }}>
                        <Container fluid>
                            {classData.map((item) => {
                                const { id, classId, classUrl, classTitle, classStart, classEnd, classWeekday, classPayment } = item;
                                return (
                                    <ClassCard
                                        key={id}
                                        id={id}
                                        classId={classId}
                                        classUrl={classUrl}
                                        classTitle={classTitle}
                                        classStart={classStart}
                                        classEnd={classEnd}
                                        classWeekday={classWeekday}
                                        classPayment={classPayment}
                                        deleteData={setClassData}
                                    />
                                );
                            })}

                        </Container>
                    </Col>
                </Row>
                <Button variant="primary" onClick={(e) => Toggle()} id="create-class">+ Class</Button>
            </Container>
            <CreateClassModal show={showCreateClassModal} close={Toggle} addData={setClassData} />
        </>
    );
}