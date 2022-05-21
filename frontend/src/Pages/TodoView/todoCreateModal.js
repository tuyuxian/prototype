import { Fragment } from 'react'
import { Container, Row, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { TextField, Box, IconButton } from '@mui/material';
import moment from 'moment';
import ClearIcon from '@mui/icons-material/Clear';
import { todoUpcomingCreate } from '../../Api/todo';

const CreateTodoModal = ({ show, close, todoClassId, todoClassName, addData }) => {
    const { register, handleSubmit, reset, formState: { errors }, setError, clearErrors } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        if (timeRangeValidate(data)) {
            var values = {
                classId: todoClassId,
                date: data.date,
                startTime: data.start,
                endTime: data.end,
                lesson: data.lesson,
                hw: data.hw
            };
            //console.log(values);
            await todoUpcomingCreate(values).then(
                response => {
                    addData(response.data.todoItemUpcoming);
                    reset({
                        date: '',
                        start: '',
                        end: '',
                        lesson: '',
                        hw: ''
                    });
                    clearErrors(["date", "start", "end"]);
                    close();
                }).catch((error) => {
                    const errors = error.response.data;
                    if (errors.code === 400) {
                        alert(errors.description);
                    }
                });
        }
    });

    const timeRangeValidate = (data) => {
        if (moment(data['start'], "hh:mm") >= moment(data['end'], "hh:mm")) {
            setError('end', {
                type: "custom",
                message: "End Time needs to be later than Start Time",
            });
            return false;
        }
        return true;
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                reset({
                    date: '',
                    start: '',
                    end: '',
                    lesson: '',
                    hw: ''
                });
                clearErrors(["date", "start", "end"]);
                close();
            }}
            fullscreen={'sm-down'}
            backdrop="static"
            scrollable
        >
            <Modal.Header style={{ justifyContent: 'space-between' }}>
                <Modal.Title style={{ alignItems: 'center', padding: '5px' }}>{todoClassName}'s Todo Item </Modal.Title>
                <IconButton aria-label="delete" onClick={() => {
                    reset({
                        date: '',
                        start: '',
                        end: '',
                        lesson: '',
                        hw: ''
                    });
                    clearErrors(["date", "start", "end"]);
                    close();
                }}>
                    <ClearIcon sx={{ color: '#c92a2a' }} />
                </IconButton>
            </Modal.Header>
            <Modal.Body style={{ height: '380px', width: '510px' }}>
                <Container>
                    <Row style={{ padding: '5px' }}>
                        <Fragment>
                            <TextField
                                error={!!errors.date}
                                label="Date"
                                variant="standard"
                                helperText={errors.date && errors.date.message}
                                placeholder="MM/DD/YYYY"
                                {...register("date", {
                                    required: "Required",
                                    pattern: {
                                        value: /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/,
                                        message: 'Enter format: MM/DD/YYYY'
                                    }
                                })}
                                sx={{ width: '145px' }}
                            />
                            <Box sx={{ width: '6px' }}> </Box>
                            <TextField
                                error={!!errors.start}
                                label="From"
                                variant="standard"
                                helperText={errors.start && errors.start.message}
                                placeholder="HH:MM"
                                {...register("start", {
                                    required: "Required",
                                    pattern: {
                                        value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                        message: 'Enter format: HH:MM'
                                    }
                                })}
                                sx={{ width: '145px' }}
                            />
                            <Box sx={{ width: '6px' }}> </Box>
                            <TextField
                                error={!!errors.end}
                                label="To"
                                variant="standard"
                                helperText={errors.end && errors.end.message}
                                placeholder="HH:MM"
                                {...register("end", {
                                    required: "Required",
                                    pattern: {
                                        value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                        message: 'Enter format: HH:MM'
                                    }
                                })}
                                sx={{ width: '145px' }}
                            />
                        </Fragment>
                    </Row>
                    <Row style={{ padding: '5px', fontSize: '16px' }}>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Lesson"
                            variant="standard"
                            multiline
                            rows={4}
                            {...register("lesson", {
                            })}
                            sx={{ width: '447px' }}
                        />
                    </Row>
                    <Row style={{ padding: '5px', fontSize: '16px' }}>
                        <TextField
                            id="standard-multiline-flexible"
                            label="Homework"
                            variant="standard"
                            multiline
                            rows={4}
                            {...register("hw", {
                            })}
                            sx={{ width: '447px' }}
                        />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTodoModal;