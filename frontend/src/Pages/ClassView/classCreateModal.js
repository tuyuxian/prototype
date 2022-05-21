import { useState, Fragment } from 'react'
import { Container, Row, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { TextField, Box, Checkbox, MenuItem, InputAdornment, FormControl, FormGroup, FormControlLabel, FormHelperText } from '@mui/material';
import moment from 'moment';
import { classCreate } from '../../Api/class';

const CreateClassModal = ({ show, close, addData }) => {
    const { register, unregister, handleSubmit, reset, formState: { errors }, setError, clearErrors } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        if (dateRangeValidate(data) && timeRangeValidate(data)) {
            var values = {
                className: data.className,
                startDate: data.startDate,
                endDate: data.endDate,
                weekday: dayOption,
                paymentMethod: data.paymentMethod,
                paymentAmount: data.paymentAmount,
                startTime: [
                    data.mondayStart,
                    data.tuesdayStart,
                    data.wednesdayStart,
                    data.thursdayStart,
                    data.fridayStart,
                    data.saturdayStart,
                    data.sundayStart
                ],
                endTime: [
                    data.mondayEnd,
                    data.tuesdayEnd,
                    data.wednesdayEnd,
                    data.thursdayEnd,
                    data.fridayEnd,
                    data.saturdayEnd,
                    data.sundayEnd
                ]
            };
            //console.log(values);
            await classCreate(values).then(
                response => {
                    // await the post response
                    addData(function (prevData) {
                        return [
                            {
                                id: response.data.classId,
                                classId: response.data.classId,
                                classUrl: response.data.classUrl,
                                classTitle: response.data.classTitle,
                                classStart: response.data.classStart,
                                classEnd: response.data.classEnd,
                                classWeekday: response.data.classWeekday,
                                classPayment: response.data.classPayment
                            },
                            ...prevData,
                        ];
                    });
                    reset({
                        className: '',
                        startDate: '',
                        endDate: '',
                        paymentMethod: '',
                        paymentAmount: '',
                    });
                    setDayOption({
                        monday: false,
                        tuesday: false,
                        wednesday: false,
                        thursday: false,
                        friday: false,
                        saturday: false,
                        sunday: false
                    });
                    clearErrors(["className", "startDate", "endDate", "paymentMethod", "paymentAmount"]);
                    close();
                }).catch((error) => {
                    const errors = error.response.data;
                    if (errors.code === 403) {
                        setError('className', {
                            type: "server",
                            message: errors.description,
                        });
                    };
                    if (errors.code === 400) {
                        alert(errors.description);
                    };
                });
        }
    });
    const [dayOption, setDayOption] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    });
    const handleChange = (event) => {
        setDayOption({
            ...dayOption,
            [event.target.name]: event.target.checked,
        });
        unregister(event.target.startprop);
        unregister(event.target.endprop);
    };
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = dayOption;
    const dayObject = [
        {
            itemLabel: "Monday",
            itemShow: monday,
            itemName: "monday",
            registerStartName: "mondayStart",
            registerEndName: "mondayEnd",
            errorStartName: errors.mondayStart,
            errorEndName: errors.mondayEnd
        },
        {
            itemLabel: "Tuesday",
            itemShow: tuesday,
            itemName: "tuesday",
            registerStartName: "tuesdayStart",
            registerEndName: "tuesdayEnd",
            errorStartName: errors.tuesdayStart,
            errorEndName: errors.tuesdayEnd
        },
        {
            itemLabel: "Wednesday",
            itemShow: wednesday,
            itemName: "wednesday",
            registerStartName: "wednesdayStart",
            registerEndName: "wednesdayEnd",
            errorStartName: errors.wednesdayStart,
            errorEndName: errors.wednesdayEnd
        },
        {
            itemLabel: "Thursday",
            itemShow: thursday,
            itemName: "thursday",
            registerStartName: "thursdayStart",
            registerEndName: "thursdayEnd",
            errorStartName: errors.thursdayStart,
            errorEndName: errors.thursdayEnd
        },
        {
            itemLabel: "Friday",
            itemShow: friday,
            itemName: "friday",
            registerStartName: "fridayStart",
            registerEndName: "fridayEnd",
            errorStartName: errors.fridayStart,
            errorEndName: errors.fridayEnd
        },
        {
            itemLabel: "Saturday",
            itemShow: saturday,
            itemName: "saturday",
            registerStartName: "saturdayStart",
            registerEndName: "saturdayEnd",
            errorStartName: errors.saturdayStart,
            errorEndName: errors.saturdayEnd
        },
        {
            itemLabel: "Sunday",
            itemShow: sunday,
            itemName: "sunday",
            registerStartName: "sundayStart",
            registerEndName: "sundayEnd",
            errorStartName: errors.sundayStart,
            errorEndName: errors.sundayEnd
        }
    ];
    const checkboxError = [monday, tuesday, wednesday, thursday, friday, saturday, sunday].filter((v) => v).length === 0;
    const dateRangeValidate = (data) => {
        const { startDate, endDate } = data;
        if (moment(startDate, "MM-DD-YYYY") >= moment(endDate, "MM-DD-YYYY")) {
            setError('endDate', {
                type: "custom",
                message: "End Date needs to later than Start Date",
            });
            return false;
        } else {
            return true;
        }
    };
    const timeRangeValidate = (data) => {
        if (checkboxError) {
            alert("At least pick one weekday");
            return false;
        } else {
            let hasError = false;
            dayObject.map((item) => {
                const { itemShow, registerStartName, registerEndName } = item;
                if (itemShow) {
                    if (moment(data[registerStartName], "hh:mm") >= moment(data[registerEndName], "hh:mm")) {
                        hasError = true;
                        setError(registerEndName, {
                            type: "custom",
                            message: "End Time needs to be later than Start Time",
                        });
                    }
                }
            });
            if (hasError) {
                return false;
            } else {
                return true;
            }
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => close()}
            backdrop="static"
            keyboard={false}
            scrollable
            fullscreen={'sm-down'}
        >
            <Modal.Header closeButton >
                <Modal.Title>New Class</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Container>
                    <Row style={{ padding: '5px', fontSize: '12px' }}>
                        <FormHelperText>*Required field</FormHelperText>
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <TextField
                            error={!!errors.className}
                            fullWidth
                            label="Class Title*"
                            variant="standard"
                            helperText={errors.className && errors.className.message}
                            {...register("className", {
                                required: "Required",
                            })}
                            sx={{ width: '437px' }}
                        />
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <Fragment>
                            <TextField
                                error={!!errors.startDate}
                                label="Start Date*"
                                variant="standard"
                                helperText={errors.startDate && errors.startDate.message}
                                placeholder="MM/DD/YYYY"
                                {...register("startDate", {
                                    required: "Required",
                                    pattern: {
                                        value: /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/,
                                        message: 'Enter format: MM/DD/YYYY'
                                    }
                                })}
                                sx={{ width: '200px' }}
                            />
                            <Box sx={{ width: '37px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingTop: '10px' }}> to </Box>
                            <TextField
                                error={!!errors.endDate}
                                label="End Date*"
                                variant="standard"
                                helperText={errors.endDate && errors.endDate.message}
                                placeholder="MM/DD/YYYY"
                                {...register("endDate", {
                                    required: "Required",
                                    pattern: {
                                        value: /^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/,
                                        message: 'Enter valid format: MM/DD/YYYY'
                                    }
                                })}
                                sx={{ width: '200px' }}
                            />
                        </Fragment>
                    </Row>
                    <FormControl
                        required
                        error={!!checkboxError}
                        component="fieldset"
                        variant="standard"
                    >
                        <Row style={{ paddingLeft: '5px', fontSize: '12px', alignItems: 'center', marginTop: '5px' }}>
                            <FormHelperText>*At least pick one weekday</FormHelperText>
                        </Row>
                        {dayObject.map((item, index) => {
                            const { itemLabel, itemShow, itemName, registerStartName, registerEndName, errorStartName, errorEndName } = item;
                            return (
                                <Row style={{ padding: '5px' }} key={index}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox checked={itemShow} onChange={handleChange} name={itemName} startprop={registerStartName} endprop={registerEndName} />
                                            }
                                            label={itemLabel}
                                            sx={{ width: '130px', marginTop: '10px' }}
                                        />
                                    </FormGroup>
                                    {itemShow &&
                                        <Fragment>
                                            <TextField
                                                error={!!errorStartName}
                                                label="Start Time*"
                                                variant="standard"
                                                helperText={errorStartName && errorStartName.message}
                                                placeholder="HH:MM"
                                                {...register(registerStartName, {
                                                    required: "Required",
                                                    pattern: {
                                                        value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                                        message: 'Enter format: HH:MM'
                                                    }
                                                })}
                                                sx={{ width: '130px', marginLeft: '15px' }}
                                            />
                                            <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}> - </Box>
                                            <TextField
                                                error={!!errorEndName}
                                                label="End Time*"
                                                variant="standard"
                                                helperText={errorEndName && errorEndName.message}
                                                placeholder="HH:MM"
                                                {...register(registerEndName, {
                                                    required: "Required",
                                                    pattern: {
                                                        value: /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
                                                        message: 'Enter format: HH:MM'
                                                    }
                                                })}
                                                sx={{ width: '130px' }}
                                            />
                                        </Fragment>
                                    }
                                </Row>
                            )
                        })}
                    </FormControl>
                    <Row style={{ padding: '5px' }}>
                        <h6>Payment</h6>
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <TextField
                            select
                            label="Method*"
                            defaultValue=""
                            variant="standard"
                            {...register("paymentMethod", {
                                required: "Required",
                            })}
                            error={!!errors.paymentMethod}
                            helperText={errors.paymentMethod && errors.paymentMethod.message}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value={1}>1 Hour</MenuItem>
                            <MenuItem value={2}>1 Time</MenuItem>
                        </TextField>
                        <TextField
                            label=" "
                            variant="standard"
                            {...register("paymentAmount", {
                                required: "Required",
                                pattern: {
                                    value: /^[0-9]*$/,
                                    message: "*Input a valid number"
                                }
                            })}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            error={!!errors.paymentAmount}
                            helperText={errors.paymentAmount && errors.paymentAmount.message}
                            sx={{ marginLeft: '10px', width: '307px' }}
                        />
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={() => {
                    reset({
                        className: '',
                        startDate: '',
                        endDate: '',
                        paymentMethod: '',
                        paymentAmount: '',
                    });
                    setDayOption({
                        monday: false,
                        tuesday: false,
                        wednesday: false,
                        thursday: false,
                        friday: false,
                        saturday: false,
                        sunday: false
                    });
                    clearErrors(["className", "startDate", "endDate", "paymentMethod", "paymentAmount"]);
                    close()
                }}>
                    Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Create</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateClassModal;