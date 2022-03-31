import { useState, Fragment } from 'react';
import { Container, Row, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { TextField, Box, Checkbox, MenuItem, InputAdornment, FormControl, FormGroup, FormControlLabel, FormHelperText } from '@mui/material';
import { LocalizationProvider, MobileDateRangePicker, TimePicker } from '@mui/lab';
import { v4 } from "uuid";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { classCreate } from '../../Api/class';

const CreateClassModal = ({ show, close, addData }) => {
    const { register, handleSubmit, reset, formState: { errors }, clearErrors } = useForm();
    const onSubmit = handleSubmit(async (data) => {
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
        console.log(values);
        await classCreate(values).then(
            response => {
                addData(function (prevData) {
                    // await the post response
                    return [
                        {
                            id: v4(),
                            classId: response.data.classId,
                            classUrl: response.data.classUrl,
                            classTitle: response.data.className,
                            classStart: response.data.classStart,
                            classEnd: response.data.classEnd,
                            classWeekday: response.data.classWeekday,
                            classPayment: response.data.classPayment
                        },
                        ...prevData,
                    ];
                });
            })
        //console.log(filterDay(Object.values(dayOption)));
        reset({
            className: '',
            startDate: '',
            endDate: '',
            paymentMethod: '',
            paymentAmount: '',
        });
        setValue([null, null]);
        setMonStartTime("");
        setMonEndTime("");
        setTueStartTime("");
        setTueEndTime("");
        setWedStartTime("");
        setWedEndTime("");
        setThrStartTime("");
        setThrEndTime("");
        setFriStartTime("");
        setFriEndTime("");
        setSatStartTime("");
        setSatEndTime("");
        setSunStartTime("");
        setSunEndTime("");
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
    });
    const [value, setValue] = useState([null, null]);
    const [dayOption, setDayOption] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    });
    const [monStartTime, setMonStartTime] = useState("");
    const [monEndTime, setMonEndTime] = useState("");
    const [tueStartTime, setTueStartTime] = useState("");
    const [tueEndTime, setTueEndTime] = useState("");
    const [wedStartTime, setWedStartTime] = useState("");
    const [wedEndTime, setWedEndTime] = useState("");
    const [thrStartTime, setThrStartTime] = useState("");
    const [thrEndTime, setThrEndTime] = useState("");
    const [friStartTime, setFriStartTime] = useState("");
    const [friEndTime, setFriEndTime] = useState("");
    const [satStartTime, setSatStartTime] = useState("");
    const [satEndTime, setSatEndTime] = useState("");
    const [sunStartTime, setSunStartTime] = useState("");
    const [sunEndTime, setSunEndTime] = useState("");

    const handleChange = (event) => {
        setDayOption({
            ...dayOption,
            [event.target.name]: event.target.checked,
        });
    };
    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday } = dayOption;
    const checkboxError = [monday, tuesday, wednesday, thursday, friday, saturday, sunday].filter((v) => v).length === 0;
    function filterDay(prev) {
        return prev.filter(item => item !== false)
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
                        <span>*Required field</span>
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <TextField
                            error={!!errors.className}
                            fullWidth
                            label="Class Title*"
                            variant="standard"
                            helperText={errors.className && errors.className.message}
                            {...register("className", {
                                required: "*Required",
                            })}
                            sx={{ width: '437px' }}
                        />
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <MobileDateRangePicker
                                startText="Start Date*"
                                endText="End Date*"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                    console.log(newValue);
                                }}
                                renderInput={(startProps, endProps) => (
                                    <Fragment>
                                        <TextField
                                            {...startProps}
                                            variant="standard"
                                            error={!!errors.startDate}
                                            {...register("startDate", {
                                                required: "*Required",
                                            })}
                                            sx={{ width: '200px' }}
                                        />
                                        <Box sx={{ width: '37px', display: 'flex', justifyContent: 'space-around' }}> to </Box>
                                        <TextField
                                            {...endProps}
                                            variant="standard"
                                            error={!!errors.endDate}
                                            {...register("endDate", {
                                                required: "*Required",
                                            })}
                                            sx={{ width: '200px' }}
                                        />
                                    </Fragment>
                                )}
                            />
                        </LocalizationProvider>
                    </Row>

                    <FormControl
                        required
                        error={!!checkboxError}
                        component="fieldset"
                        variant="standard"
                    >
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={monday} onChange={handleChange} name="monday" />
                                    }
                                    label="Monday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {monday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={monStartTime}
                                        onChange={(newValue) => {
                                            setMonStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.mondayStart}
                                            {...register("mondayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.mondayStart && errors.mondayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={monEndTime}
                                        minTime={monStartTime}
                                        onChange={(newValue) => {
                                            setMonEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.mondayEnd}
                                            {...register("mondayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.mondayEnd && errors.mondayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={tuesday} onChange={handleChange} name="tuesday" />
                                    }
                                    label="Tuesday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {tuesday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={tueStartTime}
                                        onChange={(newValue) => {
                                            setTueStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.tuesdayStart}
                                            {...register("tuesdayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.tuesdayStart && errors.tuesdayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={tueEndTime}
                                        minTime={tueStartTime}
                                        onChange={(newValue) => {
                                            setTueEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.tuesdayEnd}
                                            {...register("tuesdayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.tuesdayEnd && errors.tuesdayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={wednesday} onChange={handleChange} name="wednesday" />
                                    }
                                    label="Wednesday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {wednesday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={wedStartTime}
                                        onChange={(newValue) => {
                                            setWedStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.wednesdayStart}
                                            {...register("wednesdayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.wednesdayStart && errors.wednesdayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={wedEndTime}
                                        minTime={wedStartTime}
                                        onChange={(newValue) => {
                                            setWedEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.wednesdayEnd}
                                            {...register("wednesdayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.wednesdayEnd && errors.wednesdayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={thursday} onChange={handleChange} name="thursday" />
                                    }
                                    label="Thursday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {thursday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={thrStartTime}
                                        onChange={(newValue) => {
                                            setThrStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.thursdayStart}
                                            {...register("thursdayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.thursdayStart && errors.thursdayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={thrEndTime}
                                        minTime={thrStartTime}
                                        onChange={(newValue) => {
                                            setThrEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.thursdayEnd}
                                            {...register("thursdayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.thursdayEnd && errors.thursdayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={friday} onChange={handleChange} name="friday" />
                                    }
                                    label="Friday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {friday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={friStartTime}
                                        onChange={(newValue) => {
                                            setFriStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.fridayStart}
                                            {...register("fridayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.fridayStart && errors.fridayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={friEndTime}
                                        minTime={friStartTime}
                                        onChange={(newValue) => {
                                            setFriEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.fridayEnd}
                                            {...register("fridayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.fridayEnd && errors.fridayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={saturday} onChange={handleChange} name="saturday" />
                                    }
                                    label="Saturday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {saturday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={satStartTime}
                                        onChange={(newValue) => {
                                            setSatStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.saturdayStart}
                                            {...register("saturdayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.saturdayStart && errors.saturdayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={satEndTime}
                                        minTime={satStartTime}
                                        onChange={(newValue) => {
                                            setSatEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.saturdayEnd}
                                            {...register("saturdayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.saturdayEnd && errors.saturdayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={sunday} onChange={handleChange} name="sunday" />
                                    }
                                    label="Sunday"
                                    sx={{ width: '130px' }}
                                />
                            </FormGroup>
                            {sunday && <Fragment>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={sunStartTime}
                                        onChange={(newValue) => {
                                            setSunStartTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.sundayStart}
                                            {...register("sundayStart", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.sundayStart && errors.sundayStart.message}
                                            variant="standard" sx={{ width: '130px', marginLeft: '15px' }} />}
                                    />
                                </LocalizationProvider>
                                <Box sx={{ width: '27px', display: 'flex', justifyContent: 'space-around' }}> - </Box>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                        value={sunEndTime}
                                        minTime={sunStartTime}
                                        onChange={(newValue) => {
                                            setSunEndTime(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            error={!!errors.sundayEnd}
                                            {...register("sundayEnd", {
                                                required: "*Required",
                                            })}
                                            helperText={errors.sundayEnd && errors.sundayEnd.message}
                                            variant="standard" sx={{ width: '130px' }} />}
                                    />
                                </LocalizationProvider>
                            </Fragment>}
                        </Row>
                        <Row style={{ padding: '5px' }}>
                            {checkboxError && <FormHelperText>*Choose at least one day</FormHelperText>}
                        </Row>
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
                                required: "*Required",
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
                                required: "*Required",
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
                    setValue([null, null]);
                    setDayOption({
                        monday: false,
                        tuesday: false,
                        wednesday: false,
                        thursday: false,
                        friday: false,
                        saturday: false,
                        sunday: false
                    });
                    setMonStartTime("");
                    setMonEndTime("");
                    setTueStartTime("");
                    setTueEndTime("");
                    setWedStartTime("");
                    setWedEndTime("");
                    setThrStartTime("");
                    setThrEndTime("");
                    setFriStartTime("");
                    setFriEndTime("");
                    setSatStartTime("");
                    setSatEndTime("");
                    setSunStartTime("");
                    setSunEndTime("");
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