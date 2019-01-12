// @flow
import { ADD_ORDER, FETCH_ORDERS } from '../actions/orders';
import type { Action } from './types';

export default function orders(state = [], action: Action) {
  switch (action.type) {
    // TODO add order duplication check
    case ADD_ORDER: {
      return [...state, action]
    }
    case FETCH_ORDERS: {
      return action.orders
    }
    default:
      return state;
  }
}
