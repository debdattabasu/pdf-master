import { ordersRef, database } from "../config/firebase";
import {parseOrder} from '../utils/parsePDF';
import _ from 'lodash';

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
    const newOrders = parseOrder(order);

    newOrders.forEach((newOrder) => {
      if(newOrder.id) {
        ordersRef
          .child(newOrder.id)
          .set(newOrder)
          .then(dispatch({type: ADD_ORDER, ...newOrder}))
          .catch((err) => console.log('error!!!', err))
      }
    })
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
  return (dispatch) => {
    if(defaultValue !== value) {
      const dateAssigned = assignedOn ? assignedOn : Date.now();
      const update = {assignedOn: dateAssigned, assignee: value, completed: true}

      database.ref(`orders/${orderId}`).update(update);
      dispatch({type: CHANGE_ASSIGNEE, orderId, ...update});
    }
  }
}

export function getTasks({orderLimit, productTypes}) {
  return (dispatch, getState) => {
    const {orders} = getState();
    const tasks = _.filter(orders, (order) => {
      return !!productTypes.includes(order.productType) && order.completed === false
    });

    if(orderLimit || orderLimit > 0) {
      return _.slice(tasks, 0, orderLimit)
    }

    return tasks;
  }
}

export function updateMultipleOrderAssignees({orders, employee}) {
  return (dispatch, getState) => {
    orders.forEach((order) => {
      const {assignedOn, id} = order;
      const dateAssigned = assignedOn ? assignedOn : Date.now();
      const update = {assignedOn: dateAssigned, assignee: employee, completed: true}
      database.ref(`orders/${id}`)
      .update(update)
      .then(dispatch({type: CHANGE_ASSIGNEE, orderId: id, ...update}))
      .catch((err) => console.log('error!!!', err));
    });
  }
}


export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
