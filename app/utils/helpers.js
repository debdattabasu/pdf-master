import _ from 'lodash';

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

//DOCS: https://pdfmake.github.io/docs/
export function generatePdfTable({tasks, employee}) {
  const headers = ['id', 'shipTo', 'item', 'quantity', 'sku', 'asin', 'shippingPrice', 'totalPrice', 'platform'];
  const tableHeaders = ['ID', 'Ship to', 'Desc.', 'Qt', 'SKU', 'ASIN', 'Shipping Price', 'Total', 'Platform'];
  const date = new Date().toLocaleDateString();
  const text = `Assignments for ${employee} | Date: ${date}`
  const body = tasks.map((order) => {
    const pickedFields = _.pick(order, headers)
    return _.values(pickedFields);
  });

  return {
    pageOrientation: 'landscape',
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