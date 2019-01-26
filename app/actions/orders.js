import {get} from 'lodash';
import { ordersRef, database } from "../config/firebase";

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';
export const CHANGE_ASSIGNEE = 'CHANGE_ASSIGNEE';

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

export function addPdfToList(order) {
  return (dispatch) => {
    const id = /(?<=Order ID: ).*/i.exec(order) || /(?<=Order #).*/i.exec(order);
    const sku = /(?<=SKU: ).*/i.exec(order);
    const asin = /(?<=ASIN: ).*/i.exec(order);
    const shippingPrice = /(?<=Shipping total).*/i.exec(order);
    const totalPrice = /(?<=Grand total: ).*/i.exec(order) || /(?<=Order total).*/i.exec(order);
    const platform =  /(?:Amazon)/i.exec(order) || /(?:etsy)/i.exec(order) || '-';
    const shipTo =  /(?<=Ship To:)[^\0]*?(?=Order ID:)/gmi.exec(order) || '-';
    const newOrder = {
      id: get(id, '[0]'),
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      platform: get(platform, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
      shipTo: get(shipTo, '[0]') || '-',
      assignee: '-',
      timeRegistered: Date.now(),
      completed: false,
    };

    dispatch({type: ADD_ORDER, ...newOrder})

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

export function onAssigneeChange({value, orderId, defaultValue, assignedOn}) {
  console.log('value, orderId, defaultValue, assignedOn: ', value, orderId, defaultValue, assignedOn);
  return (dispatch) => {
    if(defaultValue !== value) {
      const dateAssigned = assignedOn ? assignedOn : Date.now();
      const update = {assignedOn: dateAssigned, assignee: value, completed: true}

      database.ref(`orders/${orderId}`).update(update);
      dispatch({type: CHANGE_ASSIGNEE, orderId, ...update});
    }
  }
}

export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
