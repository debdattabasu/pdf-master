export const ADD_ORDER = 'ADD_ORDER';

export function addPdfToList(order) {
  console.log('order: ', order);
  return (dispatch) => {
    const id = /(?<=Order ID: ).*/.exec(order) || /(?<=Order #).*/.exec(order);
    const shippingPrice = /(?<=Shipping total).*/.exec(order);
    const totalPrice = /(?<=Grand total: ).*/.exec(order) || /(?<=Order total).*/.exec(order);
    const platform =  /(?:Amazon)/.exec(order) || /(?:etsy)/.exec(order) || 'Undefined';
    console.log('id: ', id);
    dispatch({type: ADD_ORDER, id, shippingPrice, totalPrice, platform});
  };
}
