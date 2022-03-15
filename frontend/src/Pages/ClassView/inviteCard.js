import { Card, CardContent, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const InviteCard = ({ id, email, deleteData }) => {
    function deleteItem() {
        //submittingStatus.current = true
        deleteData(function (prev) {
            return prev.filter(item => item.id !== id)
        })
    }

    return (
        <div style={{
            justifyContent: 'space-around',
            display: 'inline-block',
            margin: '10px 10px 10px 10px',
            alignContent: 'center',
            // boxShadow: '7px 7px 14px #cfcfcc, -7px -7px 14px #ffffff',
            borderRadius: '20px',
        }}>
            <Card sx={{ width: 170, height: 52, borderRadius: '20px', alignItems: 'center', padding: 0, boxShadow: 0 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', padding: '2px', backgroundColor: '#f0f0fc' }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {email}
                    </span>
                    <IconButton onClick={deleteItem}>
                        <ClearIcon />
                    </IconButton>
                </CardContent>
            </Card>
        </div >
    );
}

export default InviteCard;
