import React from 'react';
import './scss/App.scss';
import { BrowserRouter as Router, Route, Link} from "react-router-dom";
import Redirect from "./components/Redirect.js";
import Home from "./components/Home.js"

class App extends React.Component {

  render = () => {
    return (
      <Router>
        <div className="App">
          <Route path="/" component={Home} />
          <Route path="/rd" component={Redirect} />
        </div>
      </Router>
    );
  }
}

export default App;
