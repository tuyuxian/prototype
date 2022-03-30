import { useState } from 'react';
import { Card, Box, CardMedia, CardContent, CardActions, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import DeleteClassModal from './classDeleteModal';
import InviteClassModal from './classInviteModal';
import logo from '../../assets/logo.png';


const ClassCard = ({ id, classId, classUrl, classTitle, classStart, classEnd, classWeekday, classPayment, deleteData }) => {
    const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
    const ToggleDeleteClassModal = () => setShowDeleteClassModal(!showDeleteClassModal);
    const [showInviteClassModal, setShowInviteClassModal] = useState(false);
    const ToggleInviteClassModal = () => setShowInviteClassModal(!showInviteClassModal);

    return (
        <div style={{
            justifyContent: 'space-around',
            display: 'inline-block',
            margin: '10px 10px 10px 10px',
            alignContent: 'center',
            boxShadow: '7px 7px 14px #cfcfcc, -7px -7px 14px #ffffff',
            borderRadius: '20px',
        }}>
            <DeleteClassModal show={showDeleteClassModal} close={ToggleDeleteClassModal} id={id} classId={classId} deleteData={deleteData} />
            <InviteClassModal show={showInviteClassModal} close={ToggleInviteClassModal} classId={classId} classUrl={classUrl} />
            <Card sx={{ width: 450, borderRadius: '20px' }}>
                <CardActions disableSpacing sx={{ justifyContent: 'right' }}>
                    <IconButton aria-label="add" onClick={() => ToggleInviteClassModal()}>
                        <AddIcon sx={{ color: "#7b68ee" }} />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => ToggleDeleteClassModal()}>
                        <ClearIcon sx={{ color: '#c92a2a' }} />
                    </IconButton>
                </CardActions>
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        src={logo}
                        sx={{ borderRadius: '50%', width: '200px', margin: ' 0 0 0.5rem 0.5rem' }}
                    />
                    <CardContent>
                        <Typography variant="h3">
                            {classTitle}
                        </Typography>
                        <Typography variant="h6">
                            Start:  {classStart}<br></br>
                            End: {classEnd}<br></br>
                            Every: {classWeekday}<br></br>
                            Payment: ${classPayment}<br></br>
                        </Typography>
                    </CardContent>
                </Box>
            </Card>
        </div >
    );
}

export default ClassCard;