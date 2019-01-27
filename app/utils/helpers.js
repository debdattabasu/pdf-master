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