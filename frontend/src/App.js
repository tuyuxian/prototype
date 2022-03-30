import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Router from './Router';
import "./assets/style.css"

class App extends React.Component {
  componentDidMount() {
    document.title = "TutorKit";
  }
  render() {
    return (
      <div className="App">
        <Router />
      </div>
    );
  }
}

export default App;
