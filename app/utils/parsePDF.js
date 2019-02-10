import {get} from 'lodash';
import {PLATFORMS} from '../constants/domain'
import {parseAmazonOrder} from './parse-amazon-invoice';
import {getProductType, formatOrderId, getOrderRating} from './helpers';

function parseOrder(order) {
  const platform =  determinePlatform(order);
  const parsedOrders = getOrderDetails({platform, order});
  const rating = getOrderRating(order);
  
  return parsedOrders.map((order) => {
    return {
      rating,
      ...order,
      assignee: '-',
      timeRegistered: Date.now(),
      completed: false,
    };
  });
}

function determinePlatform(order) {
  if(/(?:Amazon)/i.test(order)) return PLATFORMS.AMAZON;
  if(/(Do the green thing)/i.test(order)) return PLATFORMS.ETSY;
  if(/(ebay.com)/i.test(order)) return PLATFORMS.EBAY;
  if(/(mano atributika)/i.test(order)) return PLATFORMS.ECWID;
  if(/(myshopify)/i.test(order)) return PLATFORMS.SHOPIFY;

  return undefined;
}

function getOrderDetails({platform, order}){
  switch(platform){   
      case PLATFORMS.AMAZON: return parseAmazonOrder(order);
      case PLATFORMS.ETSY: return parseEtsyOrder(order);
      case PLATFORMS.EBAY: return parseEbayOrder(order);
      case PLATFORMS.ECWID: return parseEcwidOrder(order);
      case PLATFORMS.SHOPIFY: return parseShopifyOrder(order);
      default: return {};      
  }
}

function parseEtsyOrder(order) {
  const items = order.match(/(?<=\d.*items|\d.*item|.*x.*\d+.\d\d)[^\1]*?(.*x.*\d+.\d\d)/gmi) || []
  const id = /(?<=Order #).*/i.exec(order);
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Order total).*/i.exec(order);
  const platform =  PLATFORMS.ETSY;
  const shipTo =  order.match(/(?<=Ship to)[^\0]*?(?=Scheduled to)/gmi) || '-';
  const rating = 40; // HARDCODED RATING!!!!! ===================================>>>>>>>>>>> HACK

  return items.map((item, index) => {
    const sku = /(?<=SKU: ).*/i.exec(item);
    const asin = /(?<=ASIN: ).*/i.exec(item);
    const quantity = /(\d x)/i.exec(item)[1] || [];
    const productType = getProductType(item);
  
    return {
      id: formatOrderId(id, index),
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
      shipTo: get(shipTo, '[0]') || '-',
      quantity: get(quantity, '[0]') ||  '-',
      platform,
      productType,
      item,
      rating,
    };
  });
}

// EBAY needs multiple item support
function parseEbayOrder(order) {
  const id = order.match(/(?<=transid=)[^\0]*?(?=\/)/gmi);
  const sku = /(?<=SKU: ).*/.exec(order);
  const asin = /(?<=ASIN: ).*/i.exec(order);
  const shipTo = order.match(/(?<=LT)[^\0]*?(?=Ship to)/gmi);
  const shippingPrice = /(?<=Shipping and handling:).*/i.exec(order);
  const totalPrice = /(?<=Total:).*/.exec(order);
  const platform =  PLATFORMS.EBAY;
  const itemString = get(order.match(/(?<=on eBay.)[^\0]*?(?=Subtotal:)/gmi), '[0]') || '';
  const quantity = itemString.match(/(?<=Qty:)\d/i);
  const productType = getProductType(itemString);

  return [{
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
  }];
}

function parseEcwidOrder(order) {
  const items = order.match(/(\n\d\d\n)[^\0]*?(?=\d\d\d\d-\d\d-\d\d)/gmi) || [];
  const id = /(?<=Order.*#).*/i.exec(order);
  const shipTo = order.match(/(?<=Order.*\n)[^\0]*?(?=\n\d\d\n)/gmi);
  const shippingPrice = '-';
  const totalPrice = '-';
  const platform =  PLATFORMS.ECWID;

  return items.map((item, index) => {
    const asin = /(?<=ASIN: ).*/i.exec(item);
    const sku = /(?<=SKU: ).*/.exec(item);
    const quantity = item.match(/.*(?=\d\n)/);
    const productType = getProductType(item);
  
    return {
      id: formatOrderId(id, index),
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
      shipTo: get(shipTo, '[0]') || '-',
      quantity: get(quantity, '[0]') ||  '-',
      platform,
      productType,
      item,
    };
  });
}

function parseShopifyOrder(order) {
  const id = /(?<=Invoice for #).*/i.exec(order);
  const shipTo = order.match(/(?<=Shipping Details)[^\0]*?(?=If you have any)/gmi);
  const shippingPrice = '-';
  const totalPrice = /(?<=Total price:).*/i.exec(order);
  const platform =  PLATFORMS.SHOPIFY;
  const items = order.match(/(\d+.*x)[^\0]*?(\d+.\d\d)/gmi) || [];
  
  return items.map((item, index) => {
    const asin = /(?<=ASIN: ).*/i.exec(item);
    const sku = /(?<=SKU: ).*/i.exec(item);
    const productType = getProductType(item);
    const quantity = item.match(/(\d+ x)/);
    
    return {
      id: formatOrderId(id, index),
      shippingPrice: get(shippingPrice, '[0]') || '-',
      totalPrice: get(totalPrice, '[0]') || '-',
      sku: get(sku, '[0]') || '-',
      asin: get(asin, '[0]') || '-',
      shipTo: get(shipTo, '[0]') || '-',
      quantity: get(quantity, '[0]') ||  '-',
      platform,
      productType,
      item,
    };
  })
}

export {parseOrder}
