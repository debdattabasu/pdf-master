// @flow
import { ADD_ORDER, FETCH_ORDERS, TOGGLE_ORDER } from '../actions/orders';
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
    case TOGGLE_ORDER: {
      return state.map(
        order =>
          order.id === action.orderId ? { ...order, completed: !order.completed } : order
      );
    }
    default:
      return state;
  }
}
