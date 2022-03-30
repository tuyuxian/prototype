import React from "react";
import './register.css';
import '../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form"
import { registerAccount } from "../../Api/register";

export default function RegisterForm(props) {
    const { register, handleSubmit, formState: { errors }, setError, getValues } = useForm();
    let history = useHistory();
    const userStatus = "tutor student parents".split(' ');
    const checkShowStatus = () => {
        return getValues("showStatus").some(item => item === true);
    };
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            username: data.username,
            email: data.email,
            password: data.password,
            birthday: data.birthday,
            status_tutor: data.showStatus[0],
            status_student: data.showStatus[1],
            status_parents: data.showStatus[2]
        };
        //console.log(values);
        await registerAccount(values)
            .then(response => {
                console.log(response.data);
                history.push('/Login');
            }).catch((error) => {
                console.log(error);
                const errors = error.response.data;
                if (errors.description === "This email has been used by others.") {
                    setError('email', {
                        type: "server",
                        message: '*This email has been used by others.',
                    });
                };
                if (errors.code === 400) {
                    alert(errors.description);
                };
            });
    });

    return (
        <>
            <div className="main">
                <Container fluid>
                    <div className="register-form">
                        <Modal.Dialog size="lg" centered>
                            <Modal.Body>
                                <Row className="justify-content-center">
                                    <Col>
                                        <h2 className="banner text-center mt-3"> Lets Go! </h2>
                                    </Col>
                                </Row>
                                <Form>
                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Username</Form.Label>
                                                <Form.Control
                                                    className="inputbar"
                                                    {...register("username", {
                                                        required: "*Required",
                                                        minLength: {
                                                            value: 2,
                                                            message: "*Min length is 8"
                                                        },
                                                        maxLength: {
                                                            value: 20,
                                                            message: "*Max length is 20"
                                                        },
                                                    })}
                                                    type="text"
                                                    placeholder="Username"
                                                    autoFocus />
                                            </Form.Group>
                                            {errors.username && <span role="alert" className="errorMsg">{errors.username.message}</span>}
                                        </Col>
                                    </Row>
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
                                            </Form.Group>
                                            {errors.email && <span role="alert" className="errorMsg">{errors.email.message}</span>}
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

                                    <Row className="mb-3 justify-content-center">
                                        <Col xs={9}>
                                            <Form.Group className="check-box" controlId="formBasicPassword">
                                                {userStatus.map(
                                                    (status, index) => {
                                                        const fieldName = `showStatus[${index}]`;
                                                        return (
                                                            <Form.Check
                                                                inline
                                                                key={status}
                                                                {...register(`${fieldName}`, {
                                                                    validate: checkShowStatus
                                                                })}
                                                                label={status}
                                                                type="checkbox" />
                                                        );
                                                    }
                                                )}
                                            </Form.Group>
                                            {errors.showStatus && <span role="alert" className="errorMsg">*Required</span>}
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 mt-5 justify-content-center">
                                        <Col xs={8}>
                                            <Button className="btn-submit" type="submit" onClick={onSubmit}>
                                                Sign Up
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