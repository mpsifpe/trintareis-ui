import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import store from '../src/store/';
import { Provider } from 'react-redux';

/*Pages*/
import Login from './view/login/';
import NewUser from './view/new-user/';
import Home from './view/home/';
import RecoveryPassword from './view/recovery-password/';
import Event from './view/event/';
import PostPhoto from './view/post-photo/';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path='/' component={Login}/>
        <Route exact path='/novousuario' component={NewUser}/>
        <Route exact path='/home' component={Home}/>
        <Route exact path='/recoveryPassword' component={RecoveryPassword}/>
        <Route exact path='/event' component={Event}/>
        <Route exact path='/postPhoto' component={PostPhoto}/>
      </Router>
    </Provider>
  );
}

export default App;
