import React from 'react';
import store from '../src/store/';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route} from "react-router-dom";
import 'notyf/notyf.min.css';

/*Pages*/
import Login from './view/login-screen/';
import Home from './view/home/';
import RecoveryPassword from './view/recovery-password/';
import Event from './view/event/';
import RegisterScreen from './view/register-screen';
import MyFriends from './view/myfriends/';
import Profile from './view/profile/';
import ExploreScreen from './view/explore-screen';
import NotificationsScreen from './view/notifications-screen';
import EditProfileScreen from './view/edit-profile-screen';
import EditImagesScreen from './view/edit-images-screen';
import Career from './view/career';
import CareerDetail from './view/career-detail-screen';

function App() {
  return (
      <Provider store={store}>
        <Router>
          <Route exact path='/' component={Login}/>
          <Route exact path='/register' component={RegisterScreen}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/home' component={Home}/>
          <Route exact path='/recoveryPassword' component={RecoveryPassword}/>
          <Route exact path='/event' component={Event}/>
          <Route exact path='/myFriends' component={MyFriends}/>
          <Route exact path='/profile' component={Profile}/>
          <Route exact path='/profile/:id' component={Profile}/>
          <Route exact path='/editProfile' component={EditProfileScreen}/>
          <Route exact path='/explore' component={ExploreScreen}/>
          <Route exact path='/notifications-screen' component={NotificationsScreen}/>
          <Route exact path='/editImages' component={EditImagesScreen}/>
          <Route exact path='/career' component={Career}/>
          <Route exact path='/careerDetail/:id' component={CareerDetail}/>
        </Router>
      </Provider>
  );
}

export default App;

/*
*/