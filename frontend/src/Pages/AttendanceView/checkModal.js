import { Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { updateCheck } from '../../Api/attendance';


const CheckModal = ({ show, close, attendanceID, check }) => {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            attendanceid: attendanceID,
            check_tutor: !check,
            check_student: false,
            check_parents: false
        };
        //console.log(values);
        await updateCheck(values)
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
                <Modal.Title>Are You Sure?</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={() => close()}>
                    Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Yes</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CheckModal;