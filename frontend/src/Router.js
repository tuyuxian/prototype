import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import TopNav from './Components/TopNav'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Forget from './Pages/Login/Forget'
import Reset from './Pages/Login/Reset'
import Profile from './Pages/Profile'
import Status from './Pages/Profile/Status'
import Edit from './Pages/Edit'
import Attendance from './Pages/Attendance'

const Router = () => (
  <BrowserRouter>
    <div>
      <Route path='/' component={TopNav} />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/Login' component={Login} />
        <Route exact path='/Register' component={Register} />
        <Route exact path='/Forget' component={Forget} />
        <Route exact path='/Reset' component={Reset} />
        <Route exact path='/Profile' component={Profile} />
        <Route exact path='/Status' component={Status} />
        <Route exact path='/Attendance' component={Attendance} />
        <Route exact path='/Edit' component={Edit} />
      </Switch>
      {/* <Route path='/' component={Footer} /> */}
    </div>
  </BrowserRouter>
)

export default Router