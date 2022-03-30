import React from "react";
import { useForm } from "react-hook-form";
import './login.css';
import '../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { login } from '../../Api/login';
import { useHistory } from "react-router-dom";

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    let history = useHistory();
    const onSubmit = handleSubmit(async (data) => {
        var values = { email: data.email, password: data.password };
        await login(values)
            .then(response => {
                console.log(response.data);
                history.push('/class', response.data);
            }).catch((error) => {
                console.log(error);
                const errors = error.response.data;
                if (errors.description === "User is not found.") {
                    setError('email', {
                        type: "server",
                        message: '*User is not found.',
                    });
                };
                if (errors.description === "Wrong password.") {
                    setError('password', {
                        type: "server",
                        message: '*Wrong password.',
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
                                        <h2 className="banner text-center mt-3"> Welcome Back! </h2>
                                    </Col>
                                </Row>
                                <Form>
                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    className="inputbar"
                                                    {...register("email", {
                                                        required: "*Required",
                                                        pattern: {
                                                            value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                                            message: "*Entered value does not match email format"
                                                        }
                                                    })}
                                                    type="email"
                                                    placeholder="Enter email"
                                                    autoFocus
                                                />
                                                {errors.email && <span role="alert" className="errorMsg">{errors.email.message}</span>}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
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
                                                            message: "*Valid password contains at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special sign."
                                                        }
                                                    })}
                                                    type="password"
                                                    placeholder="Enter password"
                                                />
                                            </Form.Group>
                                            {errors.password && <span role="alert" className="errorMsg">{errors.password.message}</span>}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 mt-5 justify-content-center">
                                        <Col xs={8}>
                                            <Button className="btn-submit" onClick={onSubmit}>
                                                Login
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 justify-content-center">
                                        <Col style={{ textAlign: "center" }}>
                                            <a href="/forget" style={{ fontSize: "16px" }}>Forget Password?</a>
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