import {get} from 'lodash';
import {PLATFORMS, LANGUAGES} from '../constants/domain'
import {getProductType, formatOrderId} from './helpers';
import franc from 'franc';

export function parseAmazonOrder(order) {
  const language = franc(order);
  return parseOrder({order, language});
}

function parseOrder({language, order}){
  switch(language){   
      case LANGUAGES.ENGLISH: return parseEnglish(order);
      case LANGUAGES.GERMAN: return parseGerman(order);
      default: return {};      
  }
}

function parseEnglish(order) {
  const items = order.match(/(?<=Totals|Item total.*\n)[^\0]*?(?=Item total)/gmi) || [];
  const id = /(?<=Order ID: ).*/i.exec(order) || [];
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Grand total: ).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Ship To:)[^\0]*?(?=Order ID:)/gmi.exec(order) || '-';

  return items.map((item, index) => {
    const quantity = item.match(/\d+/) || [];
    const productType = getProductType(item);
    const asin = /(?<=ASIN: ).*/i.exec(item);
    const sku = /(?<=SKU: ).*/i.exec(item);
  
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

function parseGerman(order) {
  const items = order.match(/(?<=Gesamtbestellsumme|Gesamtbetrag Artikel.*\n)[^\0]*?(?=Gesamtbetrag Artikel)/gmi) || [];
  const id = /(?<=Bestellnummer:.*).*/i.exec(order) || [];
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Gesamtbetrag:.*).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Liefern an:)[^\0]*?(?=Bestellnummer:)/gmi.exec(order) || '-';

  return items.map((item, index) => {
    const quantity = item.match(/\d+/) || [];
    const productType = getProductType(item);
    const asin = /(?<=ASIN: ).*/i.exec(item);
    const sku = /(?<=SKU: ).*/i.exec(item);
  
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