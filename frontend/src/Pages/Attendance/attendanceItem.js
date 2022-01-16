import { Row, Col } from "react-bootstrap";
import { IconButton, FormControl } from '@material-ui/core';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NoteModal from "./noteModal";
import CheckModal from "./checkModal";

const AttendanceItem = ({ data, noteClick, checkClick, showNote, showCheck, passAttendanceNote, passAttendanceCheck, selectAttendance, selectCheck }) => {
  return (
    <div>
      <NoteModal show={showNote} close={noteClick} attendanceID={selectAttendance} />
      <CheckModal show={showCheck} close={checkClick} attendanceID={selectAttendance} check={selectCheck} />
      {data?.attendance_item.map((item, index) => {
        const { attendanceID, check_tutor, hrs, date, note } = item;
        return (
          <Col md={12} xs={12} key={attendanceID}>
            <Row id={attendanceID}>
              <Col md={{ span: 1, order: 1, offset: 0 }} xs={{ span: 2, order: 2, offset: -1 }} style={{ display: "flex", flexDirection: "row" }}>
                {check_tutor ?
                  <IconButton aria-label="check" style={{ color: "#7b68ee" }} onClick={() => passAttendanceCheck(attendanceID, check_tutor)}>
                    <CheckCircleOutlinedIcon />
                  </IconButton> :
                  <IconButton aria-label="check" onClick={() => passAttendanceCheck(attendanceID, check_tutor)}>
                    <CheckCircleOutlinedIcon />
                  </IconButton>
                }
              </Col>
              <Col md={{ span: 7, order: 2, offset: 0 }} xs={{ span: 12, order: 5, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>
                <FormControl fullWidth variant="outlined">
                  {note}
                </FormControl>
              </Col>
              <Col md={{ span: 2, order: 3, offset: 0 }} xs={{ span: 7, order: 1, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>{date}
              </Col>
              <Col md={{ span: 1, order: 4, offset: 0 }} xs={{ span: 12, order: 4, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>{hrs + 'hrs'}
              </Col>
              <Col md={{ span: 1, order: 5, offset: 0 }} xs={{ span: 2, order: 3, offset: -1 }} style={{ display: "flex", flexDirection: "row" }}>
                <IconButton aria-label="more-info" onClick={() => passAttendanceNote(attendanceID)}>
                  <MoreHorizIcon />
                </IconButton>
              </Col>
            </Row>
          </Col>

        )
      })}
    </div>
  );
};

export default AttendanceItem;