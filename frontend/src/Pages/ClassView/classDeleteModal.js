import { useForm } from "react-hook-form";
import { Button, Modal } from "react-bootstrap";

const DeleteClassModal = ({ id, show, close, classId, deleteData }) => {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            classid: classId
        };
        console.log(values);
        deleteItem();
    });

    function deleteItem() {
        //submittingStatus.current = true
        deleteData(function (prev) {
            return prev.filter(item => item.id !== id)
        })
    };

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

export default DeleteClassModal;