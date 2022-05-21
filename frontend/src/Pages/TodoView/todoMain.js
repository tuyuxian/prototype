import { useState, useEffect, Fragment } from "react";
import SideBar from "../../Components/SideBar";
import { Container, Row, Col, Button } from "react-bootstrap";
import '../../assets/style.css';
import TodoItem from "./todoItem";
import CreateTodoModal from "./todoCreateModal";
import { todoGet, todoUpcomingGet, todoDoneGet } from "../../Api/todo";
import { useLocation } from 'react-router-dom';

async function getTodoUpcomingData(setTodoClassId, setTodoClassName, setTodoData) {
    await todoUpcomingGet().then(response => {
        //console.log(response.data);
        setTodoClassId(response.data.classId);
        setTodoClassName(response.data.className);
        setTodoData(response.data.todoItemUpcoming);
    }).catch(error => {
        console.log(error);
        const errors = error.response.data;
        if (errors.code === 400) {
            alert(errors.description);
        }
    });
};

async function getTodoDoneData(setTodoClassId, setTodoClassName, setTodoData) {
    await todoDoneGet().then(response => {
        //console.log(response.data);
        setTodoClassId(response.data.classId);
        setTodoClassName(response.data.className);
        setTodoData(response.data.todoItemDone);
    }).catch(error => {
        console.log(error);
        const errors = error.response.data;
        if (errors.code === 400) {
            alert(errors.description);
        }
    });
};

function getPath() {
    const path = useLocation();
    return path.pathname;
}


export default function TodoMain() {
    const [showCreateTodoModal, setShowCreateTodoModal] = useState(false);
    const ToggleCreateTodoModal = () => setShowCreateTodoModal(!showCreateTodoModal);
    const [todoClassId, setTodoClassId] = useState();
    const [todoClassName, setTodoClassName] = useState();
    const [todoData, setTodoData] = useState([]);

    if (getPath() === '/todo/upcoming') {
        useEffect(() => {
            getTodoUpcomingData(setTodoClassId, setTodoClassName, setTodoData);
        }, []);
    } else {
        useEffect(() => {
            getTodoDoneData(setTodoClassId, setTodoClassName, setTodoData);
        }, []);
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <SideBar />
                    </Col>
                    <Col xs={10} id="page-content-wrapper" style={{ top: "72px", marginTop: "2%" }}>
                        <Container fluid>
                            <h1 className='Top' style={{ marginBottom: "2%", marginLeft: '5%' }}> {todoClassName} </h1>
                            <Fragment>
                                {todoData?.map((item, index, array) => {
                                    const { id, classtimeId, date, weekday, startTime, endTime, lesson, hw, todoStatus } = item;
                                    if (index === 0) {
                                        return (
                                            <TodoItem
                                                key={index}
                                                id={id}
                                                classtimeId={classtimeId}
                                                date={date}
                                                weekday={weekday}
                                                startTime={startTime}
                                                endTime={endTime}
                                                lesson={lesson}
                                                hw={hw}
                                                todoStatus={todoStatus}
                                                deleteData={setTodoData}
                                                updateData={setTodoData}
                                                order={0}
                                            />
                                        );
                                    } else if (index === array.length - 1) {
                                        return (
                                            <TodoItem
                                                key={index}
                                                id={id}
                                                classtimeId={classtimeId}
                                                date={date}
                                                weekday={weekday}
                                                startTime={startTime}
                                                endTime={endTime}
                                                lesson={lesson}
                                                hw={hw}
                                                todoStatus={todoStatus}
                                                deleteData={setTodoData}
                                                updateData={setTodoData}
                                                order={1}
                                            />
                                        );
                                    } else {
                                        return (
                                            <TodoItem
                                                key={index}
                                                id={id}
                                                classtimeId={classtimeId}
                                                date={date}
                                                weekday={weekday}
                                                startTime={startTime}
                                                endTime={endTime}
                                                lesson={lesson}
                                                hw={hw}
                                                todoStatus={todoStatus}
                                                deleteData={setTodoData}
                                                updateData={setTodoData}
                                                order={2}
                                            />
                                        );
                                    }
                                })}
                            </Fragment>
                        </Container>
                    </Col>
                </Row>
                {getPath() === '/todo/upcoming' ? <Button variant="primary" onClick={(e) => ToggleCreateTodoModal()} id="create-class">+ Todo</Button> : <></>}
            </Container>
            <CreateTodoModal
                show={showCreateTodoModal}
                close={ToggleCreateTodoModal}
                todoClassId={todoClassId}
                todoClassName={todoClassName}
                addData={setTodoData}
            />
        </>
    );
}