import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router, Switch } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

// core components
// import Admin from 'layouts/admin/Admin'
// import AdminSignin from 'views/admin/AdminSignin'
// import Signin from 'views/user/Signin'
// import Signup from 'views/user/Signup'
// import ForgotPassword from 'views/ForgotPassword'
// import PrivateRoute from 'utils/PrivateRoute'

import Main from "pages/Main"
import Page404 from "pages/Page404"
import MainLayout from "layouts/web/MainLayout"

import History from 'utils/BrowserHistory'
import * as serviceWorker from 'serviceWorker'
import configureStore from '_stores/configureStore'
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router history={History}>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route path='/pages' component={MainLayout} />
          {/* <PrivateRoute.RoleAdmin path='/admin' component={Admin} />
          <Route path='/signin/admin' component={AdminSignin} />
          <Route path='/signin' component={Signin} />
          <Route path='/signup' component={Signup} />
          <Route path='/forgotpassword' component={ForgotPassword} /> */}
          <Route path='/*' component={Page404} />
        </Switch>
      </Router>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
serviceWorker.unregister()