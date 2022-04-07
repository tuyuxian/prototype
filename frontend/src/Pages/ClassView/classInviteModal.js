import { useState, useEffect } from "react";
import { Button, Modal, Container, Col, Row } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import AddLinkIcon from '@mui/icons-material/AddLink';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Alert, IconButton, Fade } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import InviteCard from "./inviteCard";
import { v4 } from "uuid";
import { classAddMember } from "../../Api/class";

const InviteClassModal = ({ show, close, classId, classUrl }) => {
    const { handleSubmit, reset, clearErrors, control } = useForm({});

    const [userData, setUserData] = useState([]);
    const [open, setOpen] = useState(false);
    const [url] = useState(classUrl);
    const onSubmit = handleSubmit(async () => {
        var values = {
            classId: classId,
            attenderEmail: userData
        };
        //console.log(values);
        await classAddMember(values).then(
            response => {
                //console.log(response.data);
                var output = "";
                response.data.duplicateAttender?.map((item) => {
                    const { email, status } = item;
                    output += status + ": " + email + '\n';
                });
                response.data.invalidAttender?.map((item) => {
                    const { email, status } = item;
                    output += status + ": " + email + '\n';
                });
                if (output !== "") {
                    alert(output);
                }
                setUserData([]);
                reset({
                    email: '',
                });
                clearErrors(["email"]);
                close();
            }
        ).catch((error) => {
            const errors = error.response.data;
            if (errors.code === 400) {
                alert(errors.description);
            }
        });
    });

    const onEnter = handleSubmit((data) => {
        if (data.email !== "") {
            let email = data.email;
            setUserData(function (prevData) {
                return [
                    {
                        id: v4(),
                        email,
                    },
                    ...prevData,
                ];
            });
            reset({
                email: '',
            });
            clearErrors(["email"]);
        }
    });

    // function addItem() {
    //     //submittingStatus.current = true
    //     setUserData(function (prevData) {
    //         return [
    //             {
    //                 id: v4(),
    //                 user,
    //             },
    //             ...prevData,
    //         ];
    //     });
    // };


    useEffect(() => {
        const timeId = setTimeout(() => {
            setOpen(false)
        }, 3000)

        return () => {
            clearTimeout(timeId)
        }
    }, [open]);

    return (
        <Modal
            show={show}
            onHide={() => {
                setUserData([]); reset({
                    email: '',
                });
                clearErrors(["email"]);
                close();
            }}
            fullscreen={'sm-down'}
            backdrop="static"
            scrollable
        >
            <Modal.Header style={{ justifyContent: 'flex-end' }}>
                <CopyToClipboard text={url}>
                    <IconButton aria-label="share" onClick={() => { setOpen(true); }}>
                        <AddLinkIcon sx={{ color: "#7b68ee" }} />
                    </IconButton>
                </CopyToClipboard>
                <IconButton aria-label="delete" onClick={() => {
                    setUserData([]);
                    reset({
                        email: '',
                    });
                    clearErrors(["email"]);
                    close();
                }}>
                    <ClearIcon sx={{ color: '#c92a2a' }} />
                </IconButton>
            </Modal.Header>
            <Modal.Body style={{ height: '450px' }}>
                <div style={{ position: 'absolute', left: '184px', width: '60px', height: '60px', backgroundColor: '#7b94f7', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', left: '264px', width: '60px', height: '60px', backgroundColor: '#7b68ee', borderRadius: '50%' }}></div>
                <div style={{ position: 'absolute', left: '184px', top: '84px', width: '60px', height: '60px', backgroundColor: '#7b94f7', borderRadius: '50%', transform: 'scaleX(2)' }}></div>
                <div style={{ position: 'absolute', left: '264px', top: '84px', width: '60px', height: '60px', backgroundColor: '#7b68ee', borderRadius: '50%', transform: 'scaleX(2)' }}></div>
                <div style={{ position: 'absolute', left: '177px', top: '150px', color: '#7b94f7', fontSize: '20px' }}>students</div>
                <div style={{ position: 'absolute', left: '267px', top: '150px', color: '#7b68ee', fontSize: '20px' }}>parents</div>
                <Row style={{ position: 'relative', top: '200px', display: 'flex', justifyContent: 'center' }}>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <TextField
                                label="Email"
                                variant="outlined"
                                value={value}
                                onChange={onChange}
                                error={!!error}
                                helperText={error ? error.message : null}
                                sx={{ width: '300px' }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        onEnter();
                                    }
                                }}
                            />
                        )}
                        rules={{
                            pattern: {
                                value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
                                message: "*Invalid email format"
                            }
                        }}
                    />
                </Row>
                <Col style={{ justifyContent: 'space-between' }}>
                    <Container fluid style={{ position: 'relative', top: '220px' }}>
                        {userData?.map((item) => {
                            const { id, email } = item;
                            return (
                                <InviteCard key={id} id={id} email={email} deleteData={setUserData} />
                            );
                        })}
                    </Container>
                </Col>
                <Fade in={open} >
                    <Alert
                        action={
                            <IconButton
                                color="inherit"
                                size="small"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 1, position: 'relative', top: '250px', borderRadius: '20px' }}
                    >
                        Class link copied!
                    </Alert>
                </Fade>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default InviteClassModal;