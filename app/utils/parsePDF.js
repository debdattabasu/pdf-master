import {get} from 'lodash';

const PRODUCTS = ['T-shirt/Shirt', 'child', 'Hoodie', 'Crewneck', 'Bags', 'Case', 'Mug', 'Pillow', 'T­shirt'];
const PLATFORMS = {
  ETSY: 'Etsy',
  AMAZON: 'Amazon',
  EBAY: 'Ebay',
};

function parseOrder(order) {
  console.log('order: ', order);
  const platform =  determinePlatform(order);
  const parsedOrder = getOrderDetails({platform, order});

  return {
    ...parsedOrder,
    assignee: '-',
    timeRegistered: Date.now(),
    completed: false,
  };
};

function determinePlatform(order) {
  if(/(?:Amazon)/i.test(order)) return PLATFORMS.AMAZON;
  if(/(Do the green thing)/i.test(order)) return PLATFORMS.ETSY;
  if(/(ebay.com)/i.test(order)) return PLATFORMS.EBAY;

  return undefined;
}

function getOrderDetails({platform, order}){
  switch(platform){   
      case PLATFORMS.AMAZON: return parseAmazonOrder(order);
      case PLATFORMS.ETSY: return parseEtsyOrder(order);
      case PLATFORMS.EBAY: return parseEbayOrder(order);
      default: return {};      
  }
}

function parseAmazonOrder(order) {
  const id = /(?<=Order ID: ).*/i.exec(order);
  const sku = /(?<=SKU: ).*/i.exec(order);
  const asin = /(?<=ASIN: ).*/i.exec(order);
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Grand total: ).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Ship To:)[^\0]*?(?=Order ID:)/gmi.exec(order) || '-';
  const itemString = get(order.match(/(?<=priceOrder Totals)[^\0]*?(?=SKU:)/gmi), '[0]') || '';
  const quantity = itemString.match(/\d+/) || [];
  const productType = PRODUCTS.find((type) => itemString.includes(type)) || '-';

  return {
    id: get(id, '[0]'),
    shippingPrice: get(shippingPrice, '[0]') || '-',
    totalPrice: get(totalPrice, '[0]') || '-',
    sku: get(sku, '[0]') || '-',
    asin: get(asin, '[0]') || '-',
    shipTo: get(shipTo, '[0]') || '-',
    quantity: get(quantity, '[0]') ||  '-',
    platform,
    productType,
    item: itemString,
  };
};

function parseEtsyOrder(order) {
  const id = /(?<=Order #).*/i.exec(order);
  const sku = /(?<=SKU: ).*/i.exec(order);
  const asin = /(?<=ASIN: ).*/i.exec(order);
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Order total).*/i.exec(order);
  const platform =  PLATFORMS.ETSY;
  const shipTo =  order.match(/(?<=Ship to)[^\0]*?(?=Scheduled to)/gmi) || '-';
  const itemString = get(order.match(/(?<=\d item)[^\0]*?(?=Item total)/gmi), '[0]') || '';
  const quantity = /(\d x)/i.exec(itemString)[1] || [];
  const productType = PRODUCTS.find((type) => itemString.includes(type)) || '-';

  return {
    id: get(id, '[0]'),
    shippingPrice: get(shippingPrice, '[0]') || '-',
    totalPrice: get(totalPrice, '[0]') || '-',
    sku: get(sku, '[0]') || '-',
    asin: get(asin, '[0]') || '-',
    shipTo: get(shipTo, '[0]') || '-',
    quantity: get(quantity, '[0]') ||  '-',
    platform,
    productType,
    item: itemString,
  };
};

function parseEbayOrder(order) {
  const id = order.match(/(?<=transid=)[^\0]*?(?=\/)/gmi);
  const sku = /(?<=SKU: ).*/.exec(order);
  const asin = /(?<=ASIN: ).*/i.exec(order);
  const shipTo = order.match(/(?<=LT)[^\0]*?(?=Ship to)/gmi);
  const shippingPrice = /(?<=Shipping and handling:).*/i.exec(order);
  const totalPrice = /(?<=Total:).*/.exec(order);
  const platform =  PLATFORMS.EBAY;
  const itemString = get(order.match(/(?<=on eBay.)[^\0]*?(?=Subtotal:)/gmi), '[0]') || '';
  const quantity = itemString.match(/(?<=Qty:)\d/i);
  const productType = PRODUCTS.find((type) => itemString.includes(type));

  return {
    id: get(id, '[0]'),
    shippingPrice: get(shippingPrice, '[0]') || '-',
    totalPrice: get(totalPrice, '[0]') || '-',
    sku: get(sku, '[0]') || '-',
    asin: get(asin, '[0]') || '-',
    shipTo: get(shipTo, '[0]') || '-',
    quantity: get(quantity, '[0]') ||  '-',
    platform,
    productType,
    item: itemString,
  };
};

export {parseOrder}
