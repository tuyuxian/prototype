import React from "react";
import '../login.css';
import '../../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { resetpwd } from '../../../Api/login';
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";

export default function ResetForm() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    let history = useHistory();
    const onSubmit = handleSubmit(async (data) => {
        var values = { newpassword: data.password, birthday: data.birthday };
        await resetpwd(values)
            .then(response => {
                console.log(response.data);
                history.push('/Login');
            }).catch((error) => {
                console.log(error);
                const errors = error.response.data;
                if (errors.code === 406) {
                    alert(errors.description);
                    history.push('/');
                };
                if (errors.description === "ID confirmation failed.") {
                    setError('birthday', {
                        type: "server",
                        message: '*ID confirmation failed.',
                    });
                };
                if (errors.description === "User is not found.") {
                    setError('birthday', {
                        type: "server",
                        message: '*User is not found.',
                    });
                };
            });
    });

    return (
        <>
            <div className="main">
                <Container fluid>
                    <div className="login-form">
                        <Modal.Dialog size="lg" centered>
                            <Modal.Body>
                                <Row className="justify-content-center">
                                    <Col>
                                        <h2 className="banner text-center"> Welcome Back! </h2>
                                    </Col>
                                </Row>
                                <Form>
                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control
                                                    className="inputbar"
                                                    {...register("password", {
                                                        required: "*Required",
                                                        minLength: {
                                                            value: 8,
                                                            message: "*Min length is 8"
                                                        },
                                                        maxLength: {
                                                            value: 32,
                                                            message: "*Max length is 32"
                                                        },
                                                        pattern: {
                                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$/,
                                                            message: "*Please enter secure and strong password."
                                                        }
                                                    })}
                                                    type="password"
                                                    placeholder="Enter new password" />
                                            </Form.Group>
                                            {errors.password && <span role="alert" className="errorMsg">{errors.password.message}</span>}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label>Birthday</Form.Label>
                                                <Form.Control
                                                    className="inputbar"
                                                    {...register("birthday", {
                                                        required: "*Required"
                                                    })}
                                                    type="date"
                                                    placeholder="" />
                                            </Form.Group>
                                            {errors.birthday && <span role="alert" className="errorMsg">{errors.birthday.message}</span>}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 mt-5 justify-content-center">
                                        <Col xs={8}>
                                            <Button className="btn-submit" type="submit" onClick={onSubmit}>
                                                Reset
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal.Body>
                        </Modal.Dialog>
                    </div>
                </Container>
            </div>
        </>
    );
}