// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import app from './app';
import orders from './orders';
import auth from './auth';
import visibilityFilter from './visibilityFilter';
import employees from './employees';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    app,
    orders,
    auth,
    visibilityFilter,
    employees,
  });
}
