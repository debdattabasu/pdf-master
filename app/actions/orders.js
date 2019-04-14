import {fireStore} from "../config/firebase";
import {parseOrder} from '../utils/parsePDF';
import _ from 'lodash';
import { UPDATE_ORDER_CURSOR, LOADING_MORE_ORDERS } from './app';

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';
export const CHANGE_ASSIGNEE = 'CHANGE_ASSIGNEE';
export const UPDATE_ORDER = 'UPDATE_ORDER';
export const CLEAR_ALL_ORDERS = 'CLEAR_ALL_ORDERS';

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
        fireStore.collection("orders").add(newOrder)
        .then(function(ref) {
            dispatch({type: ADD_ORDER, ref: ref.id, ...newOrder})
            // console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      }
    })
  };
}
export const fetchOrders = (orderCursor = null, filter= undefined, limit = 100) => async dispatch => {
  if (orderCursor) {
    dispatch({type: LOADING_MORE_ORDERS});
  }
  const first = fireStore.collection('orders').orderBy('timeRegistered', 'desc').limit(limit);
  const next = fireStore.collection('orders').orderBy('timeRegistered', 'desc').startAfter(orderCursor).limit(limit);
  const aQuery = orderCursor ? next : first;
  const query = filter !== undefined ? aQuery.where('completed', '==', filter) : aQuery;

  query.get().then((querySnapshot) => {
    const orderCursor = querySnapshot.docs[querySnapshot.docs.length-1];
    dispatch({type: UPDATE_ORDER_CURSOR, orderCursor}); //Save page cursor.
    querySnapshot.forEach(doc => {
      dispatch({ type: ADD_ORDER, ref: doc.id, ...doc.data() });
    });
  });
};

export function clearAllOrders() {
  return (dispatch) => {
    dispatch({type: CLEAR_ALL_ORDERS});
  }
}

export function toggleOrder({id, completed, ref}) {
  return (dispatch) => {
    fireStore.collection("orders").doc(ref).update({completed: !completed})
    .then(() => {
        // dispatch({type: CHANGE_ASSIGNEE, orderId: id, completed: !completed});
        dispatch({type: TOGGLE_ORDER, orderId: id});
    });
  }
}

export function onAssigneeChange({ref, value, orderId, defaultValue, assignedOn}) {
  return (dispatch) => {
    if(defaultValue !== value) {
      const dateAssigned = assignedOn ? assignedOn : Date.now();
      const update = {assignedOn: dateAssigned, assignee: value, completed: true}
      fireStore.collection("orders").doc(ref).update(update)
      .then(() => {
          // console.log("ORDER successfully updated!");
          dispatch({type: CHANGE_ASSIGNEE, orderId, ...update});
      });
    }
  }
}

export function updateOrder(order) {
  return (dispatch) => {
    if(order) {
      fireStore.collection("orders").doc(order.ref).update(order)
      .then(() => {
        dispatch({type: UPDATE_ORDER, order});
      });
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
      const {assignedOn, id, ref} = order;
      const dateAssigned = assignedOn ? assignedOn : Date.now();
      const update = {assignedOn: dateAssigned, assignee: employee, completed: true}
      fireStore.collection("orders").doc(ref).update(update)
      .then(() => {
          dispatch({type: CHANGE_ASSIGNEE, orderId: id, ...update})
      });
    });
  }
}


export const setVisibilityFilter = filter => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
})
