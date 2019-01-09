import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import CounterPage from './containers/CounterPage';
import SignIn from "./containers/sign-in";
import requireAuth from "./containers/require-auth";

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} component={requireAuth(CounterPage)} />
      <Route path={routes.HOME} component={SignIn} />
    </Switch>
  </App>
);
