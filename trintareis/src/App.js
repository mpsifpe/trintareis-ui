import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import store from '../src/store/';
import { Provider } from 'react-redux';

/*Pages*/
import Login from './view/login/';
import NewUser from './view/new-user/';
import Home from './view/home/';
import RecoveryPassword from './view/recovery-password/';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path='/' component={Login}/>
        <Route exact path='/novousuario' component={NewUser}/>
        <Route exact path='/home' component={Home}/>
        <Route exact path='/recoveryPassword' component={RecoveryPassword}/>
      </Router>
    </Provider>
  );
}

export default App;
