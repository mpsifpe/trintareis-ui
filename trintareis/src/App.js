import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";

/*Pages*/
import Login from './view/login/';
import NewUser from './view/new-user/';
import Home from './view/home/';

function App() {
  return (
      <Router>
        <Route exact path='/' component={Login}/>
        <Route exact path='/novousuario' component={NewUser}/>
        <Route exact path='/home' component={Home}/>
      </Router>
  );
}

export default App;
