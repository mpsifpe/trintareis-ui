import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import store from '../src/store/';
import { Provider } from 'react-redux';

/*Pages*/
import Login from './view/login-screen/';
import Home from './view/home/';
import RecoveryPassword from './view/recovery-password/';
import Event from './view/event/';
import PostPhoto from './view/post-photo/';
import RegisterScreen from './view/register-screen';
import CreatePublication from './view/create-publication/';
import MyFriends from './view/myfriends/';
import Profile from './view/profile/';
import EditProfile from './view/edit-profile/';
import ExploreScreen from './view/explore-screen';
import NotificationsScreen from './view/notifications-screen';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path='/' component={RegisterScreen}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/home' component={Home}/>
        <Route exact path='/recoveryPassword' component={RecoveryPassword}/>
        <Route exact path='/event' component={Event}/>
        <Route exact path='/postPhoto' component={PostPhoto}/>
        <Route exact path='/createPublication' component={CreatePublication}/>
        <Route exact path='/myFriends' component={MyFriends}/>
        <Route exact path='/profile' component={Profile}/>
        <Route exact path='/profile/:id' component={Profile}/>
        <Route exact path='/editProfile' component={EditProfile}/>
        <Route exact path='/editProfile/:id' component={EditProfile}/>
        <Route exact path='/explore' component={ExploreScreen}/>
        <Route exact path='/notifications-screen' component={NotificationsScreen}/>
      </Router>
    </Provider>
  );
}

export default App;

/*
*/