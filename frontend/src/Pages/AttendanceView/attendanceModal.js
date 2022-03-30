import React from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { newAttendance } from '../../Api/attendance';

const NewAttendanceModal = ({ show, close, classID }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            classid: classID,
            date: data.newDate,
            starttime: data.newStarttime,
            endtime: data.newEndtime,
            note: data.newNote
        };
        //submittingStatus.current = true;
        await newAttendance(values)
            .then(async response => {
                console.log(response.data);
                close();
                window.location.reload();
            }).catch((error) => {
                console.log(error);
                const errors = error.response.data;
                if (errors.code === 400) {
                    alert(errors.description);
                };
            });
    });


    return (
        <Modal
            show={show}
            onHide={() => close()}
            backdrop="static"
            keyboard={false}
            fullscreen={'sm-down'}
        >
            <Modal.Header closeButton>
                <Modal.Title>New Attendance</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Container>
                    <Row xs={12} md={12}>
                        <Col xs={2} md={2}>
                            Date
                        </Col>
                        <Col xs={10} md={10}>
                            <Form.Control
                                className="inputbar"
                                {...register("newDate", {
                                    required: "*Required"
                                })}
                                type="date"
                                placeholder="" />
                            {errors.newDate && <span role="alert" className="errorMsg">{errors.newDate.message}</span>}
                        </Col>
                    </Row>
                    <Row xs={12} md={12}>
                        <Col xs={2} md={2}>
                            From
                        </Col>
                        <Col xs={10} md={10}>
                            <Form.Control
                                className="inputbar"
                                {...register("newStarttime", {
                                    required: "*Required"
                                })}
                                type="time"
                            />
                            {errors.newStarttime && <span role="alert" className="errorMsg">{errors.newStarttime.message}</span>}
                        </Col>
                    </Row>
                    <Row xs={12} md={12}>
                        <Col xs={2} md={2}>
                            To
                        </Col>
                        <Col xs={10} md={10}>
                            <Form.Control
                                className="inputbar"
                                {...register("newEndtime", {
                                    required: "*Required"
                                })}
                                type="time"
                            />
                            {errors.newEndtime && <span role="alert" className="errorMsg">{errors.newEndtime.message}</span>}
                        </Col>
                    </Row>
                    <Row xs={12} md={12}>
                        <Col xs={2} md={2}>
                            Note
                        </Col>
                        <Col xs={10} md={10}>
                            <Form.Control
                                className="inputbar"
                                {...register("newNote", {
                                })}
                                type="text"
                                placeholder="Enter Note" />
                            {errors.newNote && <span role="alert" className="errorMsg">{errors.newNote.message}</span>}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={() => close()}>
                    Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewAttendanceModal;