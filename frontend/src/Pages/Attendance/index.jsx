import React from "react";
import SideNav from "../../Components/SideNav"
import { withRouter } from "react-router";
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { IconButton, OutlinedInput, FormControl, InputLabel } from '@material-ui/core';
import './index.css';
import '../../assets/style.css';
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import ApiUtil from '../../Utils/ApiUtils';
import HttpUtil from '../../Utils/HttpUtils';

class Attendance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classname: '',
      classID: '',
      attendance_item: [],
      newStarttime: '',
      newEndtime: '',
      newDate: '',
      newNote: '',
      updateAttendance: '',
      updateNote: '',
      updateCheck: false,
      show: false,
      showInfo: false,
      showCheck: false
    };
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleCloseInfo = this.handleCloseInfo.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleCloseCheck = this.handleCloseCheck.bind(this);
    this.handleShowCheck = this.handleShowCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickInfo = this.handleClickInfo.bind(this);
    this.handleClickCheck = this.handleClickCheck.bind(this);
  }
  handleShow = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShowInfo = (event, attendanceID) => {
    this.setState({ updateAttendance: attendanceID });
    this.setState({ showInfo: true });
  };

  handleCloseInfo = () => {
    this.setState({ showInfo: false });
  };

  handleShowCheck = (event, check, attendanceID) => {
    this.setState({ updateAttendance: attendanceID });
    this.setState({ updateCheck: !check });
    this.setState({ showCheck: true });
  };

  handleCloseCheck = () => {
    this.setState({ showCheck: false });
  };

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  componentDidMount() {
    HttpUtil.get(ApiUtil.API_Attendance_Get)
      .then(
        response => {
          this.setState({
            classname: response['classname'],
            classID: response['classID'],
            attendance_item: response['attendance_item']
          });
          console.log(response);
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }



  handleClick(event) {
    var values = {
      classid: this.state.classID,
      date: this.state.newDate,
      starttime: this.state.newStarttime,
      endtime: this.state.newEndtime,
      note: this.state.newNote
    };
    event.preventDefault();
    HttpUtil.post(ApiUtil.API_newAttendance_Post, values)
      .then(
        response => {
          console.log(response);
          window.location.reload()
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  handleClickInfo(event) {
    var values = {
      attendanceid: this.state.updateAttendance,
      note: this.state.updateNote
    };
    event.preventDefault();
    HttpUtil.put(ApiUtil.API_updateAttendanceNote_Put, values)
      .then(
        response => {
          console.log(response);
          window.location.reload()
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  handleClickCheck(event) {
    var values = {
      attendanceid: this.state.updateAttendance,
      check_tutor: this.state.updateCheck,
      check_student: false,
      check_parents: false
    };
    event.preventDefault();
    HttpUtil.put(ApiUtil.API_updateAttendanceCheck_Put, values)
      .then(
        response => {
          console.log(response);
          window.location.reload();
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }

  render() {
    const { classname, attendance_item, show, showInfo, showCheck } = this.state;
    let arrLists = attendance_item;
    let lists = arrLists.map((list, index) =>
      <div key={index}>
        <Col md={12} xs={12}>
          <Row id={list.attendanceID} >
            <Col md={{ span: 1, order: 1, offset: 0 }} xs={{ span: 2, order: 2, offset: -1 }} style={{ display: "flex", flexDirection: "row" }}>
              {list.check_tutor ?
                <IconButton aria-label="check" style={{ color: "#7b68ee" }} onClick={(ev) => { this.handleShowCheck(ev, list.check_tutor, list.attendanceID) }}>
                  <CheckCircleOutlinedIcon />
                </IconButton> :
                <IconButton aria-label="check" onClick={(ev) => { this.handleShowCheck(ev, list.check_tutor, list.attendanceID) }}>
                  <CheckCircleOutlinedIcon />
                </IconButton>
              }
            </Col>
            <Col md={{ span: 7, order: 2, offset: 0 }} xs={{ span: 12, order: 5, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>
              <FormControl fullWidth variant="outlined">
                {/* <InputLabel>Note</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={list.note}
                labelWidth={60}
              /> */}
                {list.note}
              </FormControl>
            </Col>
            <Col md={{ span: 2, order: 3, offset: 0 }} xs={{ span: 7, order: 1, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>{list.date}
            </Col>
            <Col md={{ span: 1, order: 4, offset: 0 }} xs={{ span: 12, order: 4, offset: 0 }} style={{ display: "flex", flexDirection: "row" }}>{list.hrs + 'hrs'}
            </Col>
            <Col md={{ span: 1, order: 5, offset: 0 }} xs={{ span: 2, order: 3, offset: -1 }} style={{ display: "flex", flexDirection: "row" }}>
              <IconButton aria-label="more-info" onClick={(ev) => { this.handleShowInfo(ev, list.attendanceID) }}>
                <MoreHorizIcon />
              </IconButton>
            </Col>
          </Row>
        </Col>
      </div>
    )

    return (<>
      <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">
            <SideNav />
          </Col>
          <Col xs={10} id="page-content-wrapper">
            <h1 class='Top'> {classname} </h1>
            <Container fluid id="attendance">
              {lists}
            </Container>
            <Button variant="primary" onClick={this.handleShow} id="record">+ Record</Button>
            <Modal
              show={show}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              fullscreen={'sm-down'}
            >
              <Modal.Header closeButton>
                <Modal.Title>New Attendance</Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <Container>
                  <Row xs={12} md={12}>
                    <Col xs={2} md={2}>
                      Date
                    </Col>
                    <Col xs={10} md={10}>
                      <Form.Control type="date" name="newDate" value={this.state.newDate} onChange={this.handleChange} />
                    </Col>
                  </Row>
                  <Row xs={12} md={12}>
                    <Col xs={2} md={2}>
                      From
                    </Col>
                    <Col xs={10} md={10}>
                      <Form.Control type="time" name="newStarttime" value={this.state.newStarttime} onChange={this.handleChange} />
                    </Col>
                  </Row>
                  <Row xs={12} md={12}>
                    <Col xs={2} md={2}>
                      To
                    </Col>
                    <Col xs={10} md={10}>
                      <Form.Control type="time" name="newEndtime" value={this.state.newEndtime} onChange={this.handleChange} />
                    </Col>
                  </Row>
                  <Row xs={12} md={12}>
                    <Col xs={2} md={2}>
                      Note
                    </Col>
                    <Col xs={10} md={10}>
                      <Form.Control type="text" name="newNote" value={this.state.newNote} onChange={this.handleChange} placeholder="Enter Note" />
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={this.handleClick}>Create</Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showInfo}
              onHide={this.handleCloseInfo}
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
                          name="updateNote"
                          value={this.state.updateNote}
                          onChange={this.handleChange}
                          labelWidth={60}
                        />
                      </FormControl>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={this.handleCloseInfo}>
                  Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={this.handleClickInfo}>Update</Button>
              </Modal.Footer>
            </Modal>
            <Modal
              show={showCheck}
              onHide={this.handleCloseCheck}
            >
              <Modal.Header closeButton>
                <Modal.Title>Check Confirm</Modal.Title>
              </Modal.Header>
              <Modal.Body >
                Are You Sure?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" id="modal-button-cancel" onClick={this.handleCloseCheck}>
                  Cancel
                </Button>
                <Button variant="primary" id="modal-button-create" onClick={this.handleClickCheck}>Yes</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
    )
  }
}

export default withRouter(Attendance)
