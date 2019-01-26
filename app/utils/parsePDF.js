import {get} from 'lodash';

const products = ['T-shirt/Shirt', 'child', 'Hoodie', 'Crewneck', 'Bags', 'Case', 'Mug', 'Pillow'];

function parseOrder(order) {
  const id = /(?<=Order ID: ).*/i.exec(order) || /(?<=Order #).*/i.exec(order);
  const sku = /(?<=SKU: ).*/i.exec(order);
  const asin = /(?<=ASIN: ).*/i.exec(order);
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Grand total: ).*/i.exec(order) || /(?<=Order total).*/i.exec(order);
  const platform =  /(?:Amazon)/i.exec(order) || /(?:etsy)/i.exec(order) || '-';
  const shipTo =  /(?<=Ship To:)[^\0]*?(?=Order ID:)/gmi.exec(order) || '-';
  const itemString = get(order.match(/(?<=priceOrder Totals)[^\0]*?(?=SKU:)/gmi), '[0]') || '';
  const quantity = itemString.match(/\d+/) || [];
  const productType = products.find((type) => itemString.includes(type)) || '-';

  return {
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
    quantity: get(quantity, '[0]') ||  '-',
    productType,
  };
};

export {parseOrder}
