import { ADD_ORDER, FETCH_ORDERS, TOGGLE_ORDER } from '../actions/orders';
import type { Action } from './types';

const orderExists = (orders, orderId) => {
  return orders.some((e) => e.id === orderId);
}

export default function orders(state = [], action: Action) {
  switch (action.type) {
    case ADD_ORDER: {
      if (orderExists(state, action.id)) {
        return state;
      } else {
        return [...state, action];
      }
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
