import _ from 'lodash';
import {PRODUCTS, SHOP_PRIORITIES, REGION_PRIORITIES} from '../constants/domain'

export const mapEmployeesToOptions = (employees) => {
  return _.map(employees, (el = {}) => {
    return {
      key: el.id,
      text: el.nickName,
      value: el.nickName,
      image: el.image,
    }
  });
}

export const mapProductsToOptions = (products) => {
  return _.map(products, (el) => {
    return {
      key: el,
      text: el,
      value: el,
    }
  });
}

export function formatOrderId(id = [], index) {
  return id[0] ? `${id}--${index}` : undefined;
}

export function getProductType(item) {
  return _.find(PRODUCTS, (type) => item.includes(type)) || '-';
}

export function getOrderRating(order) {
  const lowerOrder = order.toLowerCase();
  const shopRating = _.find(SHOP_PRIORITIES, (shop) => new RegExp(shop.name).test(lowerOrder)) || {};
  const regionRating = _.find(REGION_PRIORITIES, (region) => new RegExp(region.name).test(lowerOrder)) || {};

  return (shopRating.priority || 20) + (regionRating.priority || 20);
}

//DOCS: https://pdfmake.github.io/docs/
export function generatePdfTable({tasks, employee}) {
  const headers = ['shipTo', 'item', 'quantity', 'sku', 'shippingPrice', 'platform'];
  const tableHeaders = ['Ship to', 'Desc.', 'Qt', 'SKU', 'Shipping Price', 'Platform'];
  const date = new Date().toLocaleDateString();
  const text = `Assignments for ${employee} | Date: ${date}`
  const body = tasks.map((order) => {
    const pickedFields = _.pick(order, headers)
    return _.values(pickedFields);
  });

  return {
    pageOrientation: 'portrait',
    content: [
      {text, style: 'header'},
      {
        style: 'tableExample',
        headerRows: 1,
        table: {
          body: [
            tableHeaders,
            ...body
          ]
        }
      },
    ],
    defaultStyle: {
      fontSize: 10,
    },
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        margin: [0, 0, 0, 10]
      },
    }
  }
}

export function formatImportSummary({filesSelectedCount, parsedFileSummaries}) {
  const filesUploadedCount = _.uniqBy(parsedFileSummaries.filter((el) => el.newOrderCount > 0), 'path').length;
  const totalOrdersSaved = _.sum(_.map(parsedFileSummaries, (el) => el.newOrderCount));
  const totalOrdersFailed= _.sum(_.map(parsedFileSummaries, (el) => el.failedToSave.length));

  return {
    header: `Files - Selected: ${filesSelectedCount} \n Uploaded ${filesUploadedCount}`,
    totalOrdersSaved: `Total orders added: ${totalOrdersSaved}`,
    totalOrdersFailed: `Total orders failed: ${totalOrdersFailed}`,
    content: parsedFileSummaries,
  }
}