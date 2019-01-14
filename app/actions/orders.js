import { ordersRef } from "../config/firebase";
import {get} from 'lodash';

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';

export function addPdfToList(order) {
  return (dispatch) => {
    const id = /(?<=Order ID: ).*/.exec(order) || /(?<=Order #).*/.exec(order);
    const sku = /(?<=SKU: ).*/.exec(order);
    const asin = /(?<=ASIN: ).*/.exec(order);
    const shippingPrice = /(?<=Shipping total).*/.exec(order);
    const totalPrice = /(?<=Grand total: ).*/.exec(order) || /(?<=Order total).*/.exec(order);
    const platform =  /(?:Amazon)/.exec(order) || /(?:etsy)/.exec(order) || '-';
    const newOrder = {
      id: get(id, '[0]') || '-',
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      platform: get(platform, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
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