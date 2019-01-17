import {get} from 'lodash';
import { ordersRef, database } from "../config/firebase";

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function addPdfToList(order) {
  return (dispatch) => {
    const id = /(?<=Order ID: ).*/.exec(order) || /(?<=Order #).*/.exec(order);
    const sku = /(?<=SKU: ).*/.exec(order);
    const asin = /(?<=ASIN: ).*/.exec(order);
    const shippingPrice = /(?<=Shipping total).*/.exec(order);
    const totalPrice = /(?<=Grand total: ).*/.exec(order) || /(?<=Order total).*/.exec(order);
    const platform =  /(?:Amazon)/.exec(order) || /(?:etsy)/.exec(order) || '-';
    const newOrder = {
      id: get(id, '[0]'),
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      platform: get(platform, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
      timeRegistered: Date.now(),
      completed: false,
    };

    ordersRef
      .child(newOrder.id)
      .set(newOrder)
      .then(dispatch({type: ADD_ORDER, ...newOrder}))
      .catch((err) => console.log('error!!!', err))
  };
}

export const fetchOrders = () => async dispatch => {
  ordersRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      const orders = Object.keys(snapshot.val()).map(i => snapshot.val()[i])
      dispatch({type: FETCH_ORDERS, orders});
    }
  });
}; 

export function toggleOrder({id, completed}) {
  return (dispatch) => {
    database.ref(`orders/${id}`).update({completed: !completed});
    dispatch({type: TOGGLE_ORDER, orderId: id});
  }
}

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
