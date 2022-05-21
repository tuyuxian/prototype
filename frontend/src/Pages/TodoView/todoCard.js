import { useState } from 'react';
import { Card, Box, CardContent, CardActions, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteTodoModal from './todoDeleteModal';
import CheckTodoModal from './todoCheckModal';
import EditTodoModal from './todoEditModal';
import UndoTodoModal from './todoUndoModal';

const TodoCard = ({ id, classtimeId, date, weekday, startTime, endTime, lesson, hw, todoStatus, deleteData, updateData }) => {
    const [showCheckTodoModal, setShowCheckTodoModal] = useState(false);
    const ToggleCheckTodoModal = () => setShowCheckTodoModal(!showCheckTodoModal);
    const [showEditTodoModal, setShowEditTodoModal] = useState(false);
    const ToggleEditTodoModal = () => setShowEditTodoModal(!showEditTodoModal);
    const [showDeleteTodoModal, setShowDeleteTodoModal] = useState(false);
    const ToggleDeleteTodoModal = () => setShowDeleteTodoModal(!showDeleteTodoModal);
    const [showUndoTodoModal, setShowUndoTodoModal] = useState(false);
    const ToggleUndoTodoModal = () => setShowUndoTodoModal(!showUndoTodoModal);
    return (
        <>
            <CheckTodoModal
                id={id}
                show={showCheckTodoModal}
                close={ToggleCheckTodoModal}
                classtimeId={classtimeId}
                deleteData={deleteData}
            />
            <EditTodoModal
                show={showEditTodoModal}
                close={ToggleEditTodoModal}
                id={id}
                classtimeId={classtimeId}
                date={date}
                startTime={startTime}
                endTime={endTime}
                lesson={lesson}
                hw={hw}
                updateData={updateData}
            />
            <DeleteTodoModal
                id={id}
                show={showDeleteTodoModal}
                close={ToggleDeleteTodoModal}
                classtimeId={classtimeId}
                deleteData={deleteData}
            />
            <UndoTodoModal
                id={id}
                show={showUndoTodoModal}
                close={ToggleUndoTodoModal}
                classtimeId={classtimeId}
                deleteData={deleteData}
            />
            <Card sx={{
                width: 900,
                height: 150,
                borderRadius: '20px',
                margin: '10px 10px 10px 10px',
                boxShadow: '4px 4px 8px #cfcfcc, -5px -5px 8px #ffffff',
                backgroundColor: '#f0f0fc'
            }}>
                <CardActions disableSpacing sx={{ display: 'flex' }}>
                    <CardContent sx={{ marginRight: "auto", padding: '.5rem', fontSize: '18px', fontWeight: 'bold' }}>
                        {weekday} {startTime} - {endTime}
                    </CardContent>
                    {todoStatus == 0 ? <>
                        <IconButton aria-label="check" onClick={() => ToggleCheckTodoModal()} >
                            <CheckIcon sx={{ color: "#00bb00" }} />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => ToggleEditTodoModal()}>
                            <MoreHorizIcon sx={{ color: "#7b68ee" }} />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => ToggleDeleteTodoModal()} >
                            <ClearIcon sx={{ color: '#c92a2a' }} />
                        </IconButton> </> :
                        <>
                            <IconButton aria-label="undo" onClick={() => ToggleUndoTodoModal()}>
                                <UndoIcon sx={{ color: "#7b68ee" }} />
                            </IconButton>
                        </>}

                </CardActions>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Typography sx={{ padding: '4px 16px 4px 16px' }}>
                        Lesson: {lesson}
                    </Typography>
                    <Typography sx={{ padding: '4px 16px 4px 16px' }}>
                        Homework: {hw}
                    </Typography>
                </Box>
            </Card>
        </>
    );
}

export default TodoCard;