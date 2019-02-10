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
      case LANGUAGES.SCOTTISH: return parseEnglish(order);
      case LANGUAGES.GERMAN: return parseGerman(order);
      case LANGUAGES.FRENCH: return parseFrench(order);
      case LANGUAGES.ITALIAN: return parseItalian(order);
      case LANGUAGES.SPANISH: return parseSpanish(order);
      default: return [];      
  }
}

function parseEnglish(order) {
  const items = order.match(/(?<=Totals|Item total.*\n)[^\0]*?(?=Item total)/gmi) || [];
  const id = /(?<=Order ID: ).*/i.exec(order) || [];
  const shippingPrice = /(?<=Shipping total).*/i.exec(order);
  const totalPrice = /(?<=Grand total: ).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Ship To:|Dispatch to:)[^\0]*?(?=Order ID:)/gmi.exec(order) || '-';

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

function parseFrench(order) {
  // CASE SENSITIVE ITEMS!!!
  const items = order.match(/(?<=Total.*des.*commandes|Total.*de.*l'article.*\n)[^\0]*?(?=Total.*de.*l'article)/gm) || []; 
  const id = /(?<=Numéro.*de.*la.*commande.*:).*/i.exec(order) || [];
  const shippingPrice = /(?<=Total de l'expédition).*/i.exec(order);
  const totalPrice = /(?<=Total:.*).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Adresse d'expédition :)[^\0]*?(?=Numéro.*de.*la.*commande.*:)/gmi.exec(order) || '-';

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

function parseItalian(order) {
  const items = order.match(/(?<=Totale.*ordine|Tot..*articolo.*\n)[^\0]*?(?=Tot..*articolo)/gmi) || [];
  const id = /(?<=Numero.*dell'ordine:).*/i.exec(order) || [];
  const shippingPrice = /(?<=Tot..*spedizione).*/i.exec(order);
  const totalPrice = /(?<=Tot.:.*).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Spedire.*a:)[^\0]*?(?=Numero.*dell'ordine:)/gmi.exec(order) || '-';

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

function parseSpanish(order) {
  // CASE SENSITIVE ITEMS!!!
  const items = order.match(/(?<=Totales.*del.*pedido|Total.*del.*artículo.*\n)[^\0]*?(?=Total.*del.*artículo)/gm) || [];
  const id = /(?<=Nº.*de.*pedido:).*/i.exec(order) || [];
  const shippingPrice = /(?<=Total.*del.*envío).*/i.exec(order);
  const totalPrice = /(?<=Suma.*total:.*).*/i.exec(order);
  const platform = PLATFORMS.AMAZON;
  const shipTo =  /(?<=Enviar a:)[^\0]*?(?=Nº.*de.*pedido:)/gmi.exec(order) || '-';

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