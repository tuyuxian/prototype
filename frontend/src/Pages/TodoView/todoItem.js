import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TodoCard from './todoCard';

const TodoItem = ({ id, classtimeId, date, weekday, startTime, endTime, lesson, hw, todoStatus, deleteData, updateData, order }) => {
    return (
        <Timeline align="left" sx={{ margin: 0, padding: 0 }}>
            <TimelineItem>
                <TimelineContent
                    style={{
                        flex: 0.1,
                        margin: 'auto 0',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px'
                    }}>
                    {date}
                </TimelineContent>
                {order === 0 ? <TimelineSeparator>
                    <TimelineConnector sx={{ backgroundColor: 'transparent' }} />
                    <TimelineDot sx={{ backgroundColor: "#7b68ee" }} />
                    <TimelineConnector />
                </TimelineSeparator> :
                    order === 1 ? <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot sx={{ backgroundColor: "#7b68ee" }} />
                        <TimelineConnector sx={{ backgroundColor: 'transparent' }} />
                    </TimelineSeparator> :
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot sx={{ backgroundColor: "#7b68ee" }} />
                            <TimelineConnector />
                        </TimelineSeparator>
                }
                <TimelineOppositeContent>
                    <TodoCard
                        id={id}
                        classtimeId={classtimeId}
                        date={date}
                        weekday={weekday}
                        startTime={startTime}
                        endTime={endTime}
                        lesson={lesson}
                        hw={hw}
                        todoStatus={todoStatus}
                        deleteData={deleteData}
                        updateData={updateData}
                    />
                </TimelineOppositeContent>
            </TimelineItem>
        </Timeline>
    );
}

export default TodoItem;