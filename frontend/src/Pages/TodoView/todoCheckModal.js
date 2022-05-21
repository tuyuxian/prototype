import { useForm } from "react-hook-form";
import { Button, Modal } from "react-bootstrap";
import { IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { todoUpcomingFinish } from "../../Api/todo";

const CheckTodoModal = ({ id, show, close, classtimeId, deleteData }) => {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        var values = {
            classtimeId: classtimeId
        };
        //console.log(values);
        await todoUpcomingFinish(values).then(
            response => {
                console.log(response.data);
                deleteItem();
                close();
            }
        ).catch((error) => {
            const errors = error.response.data;
            if (errors.code === 400) {
                alert(errors.description);
            }
        });
    });

    function deleteItem() {
        //submittingStatus.current = true
        deleteData(function (prev) {
            return prev.filter(item => item.id !== id)
        });
    };

    return (
        <Modal
            show={show}
            onHide={() => close()}
        >
            <Modal.Header style={{ justifyContent: 'space-between' }}>
                <Modal.Title style={{ alignItems: 'center', padding: '5px' }}>Finished?</Modal.Title>
                <IconButton aria-label="delete" onClick={() => {
                    close();
                }}>
                    <ClearIcon sx={{ color: '#c92a2a' }} />
                </IconButton>
            </Modal.Header>
            <Modal.Footer style={{ padding: '16px' }}>
                <Button variant="secondary" id="modal-button-cancel" onClick={() => close()}>
                    Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={onSubmit}>Yes</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default CheckTodoModal;