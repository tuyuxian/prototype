import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TopNav from './Components/TopNav'
import Home from './Pages/Home'
import Login from './Pages/Login/loginPage'
import Register from './Pages/Register/registerPage'
import Forget from './Pages/Login/Forget/forgetPage'
import Reset from './Pages/Login/Reset/resetPage'
import Profile from './Pages/Profile'
import Status from './Pages/Profile/Status'
import Edit from './Pages/Edit'
import Attendance from './Pages/AttendanceView/attendancePage'
import ClassView from './Pages/ClassView/classPage'

const Router = () => (
  <BrowserRouter>
    <div>
      <Route path='/' component={TopNav} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/forget' component={Forget} />
        <Route exact path='/reset' component={Reset} />
        <Route exact path='/profile' component={Profile} />
        <Route exact path='/status' component={Status} />
        <Route exact path='/attendance' component={Attendance} />
        <Route exact path='/class' component={ClassView} />
        <Route exact path='/edit' component={Edit} />
      </Switch>
      {/* <Route path='/' component={Footer} /> */}
    </div>
  </BrowserRouter>
)

export default Router