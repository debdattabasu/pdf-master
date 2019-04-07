import {UPDATE_ORDER_CURSOR, LOADING_MORE_ORDERS} from '../actions/app';

const initialState = {
  orderCursor: undefined,
  loadingMoreOrders: false,
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ORDER_CURSOR:
      return {
        ...state,
        orderCursor: action.orderCursor,
        loadingMoreOrders: false,
      };
    case LOADING_MORE_ORDERS:
      return {
        ...state,
        loadingMoreOrders: true,
      };
    default:
      return state;
  }
}
