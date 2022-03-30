import React from "react";
import { withRouter } from "react-router";
import './index.css'
import { Nav, Container, Row, Col } from "react-bootstrap";
import { BsBook, BsQuestion } from 'react-icons/bs';
import { AiOutlineBars, AiOutlineCheck } from 'react-icons/ai';
import { RiBarChart2Fill } from 'react-icons/ri';
// import Class from '../Class/index';
import Info from '../Info/index';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      showNavigator: true,
      navigator: {
        showClass: false,
        showTodo: false,
        showAttend: false,
        showQA: false,
        showInfo: false
      }
    }

    this.sidenavClick = this.sidenavClick.bind(this);
  }

  async sidenavClick(location, target) {
    const prevState = { ...this.state };
    const toggle = !prevState[location][target];
    Object.keys(prevState[location]).forEach(key => prevState[location][key] = false);
    prevState[location][target] = toggle;
    this.setState(prevState);
  }

  render() {
    return (
      <>
        <Container fluid>
          <Row className="mh-75">
            <Col xs={3} id="sidebar-wrapper">
              <Nav className="col-sm-1 d-block sidebar">
                <div className="sidebar-sticky"></div>
                <Nav.Item className="ml-2">
                  <Nav.Link onClick={() => this.sidenavClick("navigator", "showClass")}> <BsBook /> </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ml-2">
                  <Nav.Link onClick={() => this.sidenavClick("navigator", "showTodo")}> <AiOutlineBars /> </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ml-2">
                  <Nav.Link onClick={() => this.sidenavClick("navigator", "showAttend")}> <AiOutlineCheck /> </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ml-2">
                  <Nav.Link onClick={() => this.sidenavClick("navigator", "showQA")}> <BsQuestion /> </Nav.Link>
                </Nav.Item>
                <Nav.Item className="ml-2">
                  <Nav.Link onClick={() => this.sidenavClick("navigator", "showInfo")}> <RiBarChart2Fill /> </Nav.Link>
                </Nav.Item>
              </Nav>
              {this.state.navigator.showClass &&
                <Nav className="d-block sidebar secondbar">
                  <div className="secondbar-sticky"></div>
                  <Nav.Item className="ml-md-3 ml-5">
                    <Nav.Link className="secondnav-title" onClick={() => this.sidenavClick("navigator", "showClass")}> Class </Nav.Link>
                  </Nav.Item>
                </Nav>
              }
              {this.state.navigator.showTodo &&
                <Nav className="d-block sidebar secondbar">
                  <div className="secondbar-sticky"></div>

                </Nav>
              }
              {this.state.navigator.showAttend &&
                <Nav className="d-block sidebar secondbar">
                  <div className="secondbar-sticky"></div>

                </Nav>
              }
              {this.state.navigator.showQA &&
                <Nav className="d-block sidebar secondbar">
                  <div className="secondbar-sticky"></div>

                </Nav>
              }
              {this.state.navigator.showInfo &&
                <Nav className="d-block sidebar secondbar">
                  <div className="secondbar-sticky"></div>
                  <Nav.Item className="ml-md-3 ml-5">
                    <Nav.Link className="secondnav-title"> Profile </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="ml-5">
                    <Nav.Link className="secondnav-link" onClick={() => this.sidenavClick("navigator", "showInfo")}> Account </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="ml-5">
                    <Nav.Link className="secondnav-link" href="#"> Profile Pic </Nav.Link>
                  </Nav.Item>
                </Nav>
              }
            </Col>
            <Col xs={9}>
              {this.state.navigator.showClass &&
                <Col xs={12} md={6}>
                  {/* <Class /> */}
                </Col>
              }
              {this.state.navigator.showInfo &&
                <Col xs={12}>
                  <Info />
                </Col>
              }
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default withRouter(Profile)