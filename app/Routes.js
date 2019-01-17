import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import CounterPage from './containers/CounterPage';
import EmployeesPage from './containers/Employees';
import SignIn from "./containers/sign-in";
import requireAuth from "./containers/require-auth";

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={requireAuth(CounterPage)} />
      <Route path={routes.EMPLOYEES} component={requireAuth(EmployeesPage)} />
      <Route path={routes.HOME} component={SignIn} /> //This should be the last Route for some reason!!!
    </Switch>
  </App>
);
