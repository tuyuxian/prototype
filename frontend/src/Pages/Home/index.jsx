import React from "react";
import { withRouter } from "react-router";
import './index.css';
import '../../assets/style.css';
import avatar from '../../assets/avatar.png';
import { 
Container, 
Row, 
Col,
Image
} from "react-bootstrap";

class Home extends React.Component {
  render() {
    return (
      <>
        <div class="main">
          <Container fluid>
            <Row className="justify-content-center"> 
              <Col>
                <h1 className="banner text-center">Name</h1>
              </Col>
            </Row>
            <Row className="justify-content-center"> 
              <Col>
                <h2 className="subtitle text-center">Intro: xxxxxxxxxxxxx</h2>
              </Col>
            </Row>
            <Row className="justify-content-center"> 
              <Col xs={4}>
                <Image className="avatar mx-auto d-block" src={avatar} roundedCircle></Image>
              </Col>
              <Col xs={4}>
                <Image className="avatar mx-auto d-block" src={avatar} roundedCircle></Image>
              </Col>
              <Col xs={4}>
                <Image className="avatar mx-auto d-block" src={avatar} roundedCircle></Image>
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default withRouter(Home)