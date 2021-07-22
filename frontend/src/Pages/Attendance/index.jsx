import React from "react";
import SideNav from "../../Components/SideNav"
import { withRouter } from "react-router";
import { Icon } from 'semantic-ui-react'
import './index.css';
import '../../assets/style.css';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  InputGroup,
  FormControl
} from "react-bootstrap";
import ApiUtil from '../../Utils/ApiUtils';
import HttpUtil from '../../Utils/HttpUtils';

class Attendance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      classname: '',
      attendance_item: [],
      check_tutor: '',
      check_studet: '',
      check_parents: '',
      classID: '',
      date: '',
      hrs: '',
      note: ''
    };
  }
  componentDidMount() {
    HttpUtil.get(ApiUtil.API_Attendance_Get)
      .then(
        response => {
          this.setState({
            classname: response['classname'],
            attendance_item: response['attendance_item']
          });
          //console.log(this.state.attendance_item);
        }
      )
      .catch(error => {
        //message.error(error.message);
      });
  }


  render() {
    const { classname, attendance_item } = this.state;
    let arrLists = attendance_item
    let lists = arrLists.map((list) =>
      <Col md={12}>
        <Row>
          <Col md={1}>
            <Form.Check
              id="checkbox1"
              value={list.check_tutor}
            />
          </Col>
          <Col md={8}>
            <Form.Control type="text" placeholder={list.note} />
          </Col>
          <Col md={2}><Form.Control plaintext readOnly value={list.date} />
          </Col>
          <Col md={1}><Form.Control plaintext readOnly value={list.hrs + 'hrs'} />
          </Col>
        </Row>
      </Col>
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
            <Button href="#">Link</Button>
          </Col>
        </Row>
      </Container>
    </>
    )
  }
}

export default withRouter(Attendance)
