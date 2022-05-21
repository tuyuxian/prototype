import { Fragment } from 'react'
import { Container, Row, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { TextField, Box, IconButton } from '@mui/material';
import moment from 'moment';
import ClearIcon from '@mui/icons-material/Clear';
import { todoUpcomingEdit } from '../../Api/todo';

const EditTodoModal = ({ show, close, id, classtimeId, date, startTime, endTime, lesson, hw, updateData }) => {
    const { register, handleSubmit, reset, formState: { errors }, setError, clearErrors } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        if (timeRangeValidate(data)) {
            var values = {
                id: id,
                classtimeId: classtimeId,
                date: date,
                startTime: data.start,
                endTime: data.end,
                lesson: data.lesson,
                hw: data.hw
            };
            //console.log(values);
            await todoUpcomingEdit(values).then(
                response => {
                    //console.log(response.data);
                    updateData(function (prevData) {
                        return (prevData.map((item) => {
                            if (item.id === id) {
                                return {
                                    ...item,
                                    startTime: response.data.startTime,
                                    endTime: response.data.endTime,
                                    lesson: response.data.lesson,
                                    hw: response.data.hw
                                }
                            } else {
                                return {
                                    ...item
                                }
                            }
                        }));
                    });
                    reset({
                        date: date,
                        start: response.data.startTime,
                        end: response.data.endTime,
                        lesson: response.data.lesson,
                        hw: response.data.hw
                    });
                    clearErrors(["start", "end"]);
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
                    date: date,
                    start: startTime,
                    end: endTime,
                    lesson: lesson,
                    hw: hw
                });
                clearErrors(["start", "end"]);
                close();
            }}
            fullscreen={'sm-down'}
            backdrop="static"
            scrollable
        >
            <Modal.Header style={{ justifyContent: 'flex-end' }}>
                <IconButton aria-label="delete" onClick={() => {
                    reset({
                        date: date,
                        start: startTime,
                        end: endTime,
                        lesson: lesson,
                        hw: hw
                    });
                    clearErrors(["start", "end"]);
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
                                disabled
                                helperText={errors.date && errors.date.message}
                                placeholder="MM/DD/YYYY"
                                defaultValue={date}
                                {...register("date", {
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
                                defaultValue={startTime}
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
                                defaultValue={endTime}
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
                            defaultValue={lesson}
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
                            defaultValue={hw}
                            {...register("hw", {
                            })}
                            sx={{ width: '447px' }}
                        />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Update</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditTodoModal;