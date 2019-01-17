// @flow
import { ADD_ORDER, FETCH_ORDERS, TOGGLE_ORDER } from '../actions/orders';
import type { Action } from './types';

export default function orders(state = [], action: Action) {
  switch (action.type) {
    // TODO add order duplication check
    case ADD_ORDER: {
      const index = state.findIndex(el => el.id == action.id);
      if(index == -1)
        return [...state, action.event];
      return state;
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
