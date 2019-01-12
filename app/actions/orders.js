import { ordersRef } from "../config/firebase";

export const ADD_ORDER = 'ADD_ORDER';
export const FETCH_ORDERS = 'FETCH_ORDERS';

export function addPdfToList(order) {
  return (dispatch) => {
    const id = /(?<=Order ID: ).*/.exec(order) || /(?<=Order #).*/.exec(order);
    const shippingPrice = /(?<=Shipping total).*/.exec(order);
    const totalPrice = /(?<=Grand total: ).*/.exec(order) || /(?<=Order total).*/.exec(order);
    const platform =  /(?:Amazon)/.exec(order) || /(?:etsy)/.exec(order) || '-';

    ordersRef
      .child(id[0])
      .set({id: id[0], shippingPrice: shippingPrice[0], totalPrice: totalPrice[0], platform: platform[0]})
      .then(dispatch({type: ADD_ORDER, id, shippingPrice, totalPrice, platform}))
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