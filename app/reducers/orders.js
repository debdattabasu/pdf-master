import { ADD_ORDER, ADD_ORDERS, TOGGLE_ORDER, CHANGE_ASSIGNEE, UPDATE_ORDER, CLEAR_ALL_ORDERS } from '../actions/orders';
import type { Action } from './types';

const orderExists = (orders, orderId) => {
  return orders.some((e) => e.id === orderId);
}

export default function orders(state = [], action: Action) {
  switch (action.type) {
    case ADD_ORDER: {
      if (orderExists(state, action.id)) {
        return state;
      }
      return [action, ...state];
    }
    case ADD_ORDERS: {
      return [...state, ...action.orders];
    }
    case TOGGLE_ORDER: {
      return state.map(
        order =>
          order.id === action.orderId ? { ...order, completed: !order.completed } : order
      );
    }
    case CHANGE_ASSIGNEE: {
      const {assignee, assignedOn, completed} = action;
      return state.map(
        order =>
          order.id === action.orderId ? { ...order, assignee, assignedOn, completed} : order
      );
    }
    case UPDATE_ORDER: {
      return state.map(
        order =>
          order.id === action.order.id ? {...order, ...action.order} : order
      );
    }
    case CLEAR_ALL_ORDERS: {
      return []
    }
    default:
      return state;
  }
}
