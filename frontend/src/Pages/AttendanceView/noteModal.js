import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { OutlinedInput, FormControl, InputLabel } from '@material-ui/core';
import { updateNote } from '../../Api/attendance';


const NoteModal = ({ show, close, attendanceID }) => {
    const { register, handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            attendanceid: attendanceID,
            note: data.newNote
        };
        await updateNote(values)
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
        >
            <Modal.Header closeButton>
                <Modal.Title>Edit Note</Modal.Title>
            </Modal.Header>
            <Modal.Body >
                <Container>
                    <Row>
                        <Col xs={18} md={12}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-amount">Note</InputLabel>
                                <OutlinedInput
                                    className="inputbar"
                                    {...register("newNote", {
                                    })}
                                    type="text"
                                    placeholder="Input your note"
                                    autoFocus />
                            </FormControl>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={() => close()}>
                    Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default NoteModal;