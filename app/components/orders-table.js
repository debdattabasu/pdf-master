import React from 'react';
import PropTypes from 'prop-types';
import {Table} from 'semantic-ui-react'
import _ from 'lodash';

function OrdersTable(props) {
  const { orders } = props;
  return (
    <Table compact>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Order Id</Table.HeaderCell>
          <Table.HeaderCell>Shipping Price</Table.HeaderCell>
          <Table.HeaderCell>Total Price</Table.HeaderCell>
          <Table.HeaderCell>Platform</Table.HeaderCell>
          <Table.HeaderCell>SKU</Table.HeaderCell>
          <Table.HeaderCell>ASIN</Table.HeaderCell>
          <Table.HeaderCell>Order Registered</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {_.map(orders, (order => {
          return (
            <Table.Row key={order.id}>
              <Table.Cell>{order.id}</Table.Cell>
              <Table.Cell>{order.shippingPrice}</Table.Cell>
              <Table.Cell>{order.totalPrice}</Table.Cell>
              <Table.Cell>{order.platform}</Table.Cell>
              <Table.Cell>{order.sku}</Table.Cell>
              <Table.Cell>{order.asin}</Table.Cell>
              <Table.Cell>{new Date(order.timeRegistered).toLocaleDateString()}</Table.Cell>
            </Table.Row>
          );
        }))}
      </Table.Body>
    </Table>
  );
}

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
};

export default OrdersTable;