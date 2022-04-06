import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import store from '../src/store/';
import { Provider } from 'react-redux';

/*Pages*/
import Login from './view/login-2/';
import NewUser from './view/new-user/';
import Home from './view/home/';
import RecoveryPassword from './view/recovery-password/';
import Event from './view/event/';
import PostPhoto from './view/post-photo/';
import HomeScreen from './view/home-screen/';
import CreatePublication from './view/create-publication/';
import MyFriends from './view/myfriends/';
import Profile from './view/profile/';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path='/' component={HomeScreen}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/novousuario' component={NewUser}/>
        <Route exact path='/home' component={Home}/>
        <Route exact path='/recoveryPassword' component={RecoveryPassword}/>
        <Route exact path='/event' component={Event}/>
        <Route exact path='/postPhoto' component={PostPhoto}/>
        <Route exact path='/createPublication' component={CreatePublication}/>
        <Route exact path='/myFriends' component={MyFriends}/>
        <Route exact path='/profile' component={Profile}/>
      </Router>
    </Provider>
  );
}

export default App;
