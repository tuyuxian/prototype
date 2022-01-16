import React from "react";
import '../login.css';
import '../../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import { forgetpwd } from "../../../Api/login";
import { useHistory } from "react-router";
import { useForm } from "react-hook-form";

export default function ForgetForm() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    let history = useHistory();
    const onSubmit = handleSubmit(async (data) => {
        var values = { email: data.email };
        await forgetpwd(values)
            .then(response => {
                console.log(response.data);
                history.push('/Reset');
            }).catch((error) => {
                console.log(error);
                const errors = error.response.data;
                if (errors.code === 406) {
                    alert(errors.description);
                    history.push('/');
                };
                if (errors.description === "User is not found.") {
                    setError('email', {
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
                                        </Col>
                                    </Row>

                                    <Row className="mb-3 mt-5 justify-content-center">
                                        <Col xs={8}>
                                            <Button className="btn-submit" onClick={onSubmit}>
                                                Send Me Link
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