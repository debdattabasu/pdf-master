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
  SHOW_ACTIVE: 'SHOW_ACTIVE',
  ORDER_BY_RATING: 'ORDER_BY_RATING',
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
  ordersRef.orderByChild('timeRegistered').once('value', (snapshot) => {
    if (snapshot.val()) {
      const orders = Object.keys(snapshot.val()).map(i => snapshot.val()[i]);
      const sortedOrders = _.sortBy(orders, ['rating', 'timeRegistered']);
      dispatch({type: FETCH_ORDERS, orders: sortedOrders});
    }
  });
}; 

export function toggleOrder({id, completed}) {
  return (dispatch) => {
    // was marked as not done anymore
    if(completed) {
      const update = {assignedOn: null, assignee: null, completed: false}
      database.ref(`orders/${id}`).update(update);
      dispatch({type: CHANGE_ASSIGNEE, orderId: id, ...update});
    } else {
      database.ref(`orders/${id}`).update({completed: !completed});
      dispatch({type: TOGGLE_ORDER, orderId: id});
    }
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

export function updateOrder(order) {
  return (dispatch) => {
    if(order) {
      database.ref(`orders/${order.id}`).update(order);
      dispatch({type: CHANGE_ASSIGNEE, orderId: order.id, ...order});
    }
  }
}

export function getTasks({orderLimit, productTypes}) {
  return (dispatch, getState) => {
    const {orders} = getState();
    let tasks = []

    if(productTypes.length === 0) {
      tasks = _.filter(orders, (order) => order.completed === false);
    }

    if(productTypes.length > 0) {
      tasks = _.filter(orders, (order) => {
        return order.completed === false && !!productTypes.includes(order.productType) 
      });
    }

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
