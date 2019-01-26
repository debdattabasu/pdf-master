import React from 'react';
import PropTypes from 'prop-types';
import {Table, Checkbox, Dropdown, Popup, Icon} from 'semantic-ui-react'
import _ from 'lodash';

const mapEmployeesToOptions = (employees) => {
  return _.map(employees, (el = {}) => {
    return {
      key: el.id,
      text: el.nickName,
      value: el.nickName,
      image: el.image,
    }
  })
}

function OrdersTable(props) {
  const { orders, onOrderToggle, employees, onAssigneeChange } = props;
  const options = mapEmployeesToOptions(employees);

  const ctaButton = (order) => <Checkbox checked={order.completed} toggle onChange={() => onOrderToggle(order)}/>

  const assigneeList = (order) => {
    const {assignedOn, id, assignee} = order;
    return (
      <Dropdown 
        inline
        options={options}
        defaultValue={assignee || null}
        onChange={(event, data) => onAssigneeChange({...data, orderId: id, assignedOn})}
      />
    )
  }

  return (
    <Table size="small" compact="very">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Order Id</Table.HeaderCell>
          <Table.HeaderCell>Product Type</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Ship To</Table.HeaderCell>
          <Table.HeaderCell>Shipping Price</Table.HeaderCell>
          <Table.HeaderCell>Total Price</Table.HeaderCell>
          <Table.HeaderCell>Platform</Table.HeaderCell>
          <Table.HeaderCell>SKU</Table.HeaderCell>
          <Table.HeaderCell>ASIN</Table.HeaderCell>
          <Table.HeaderCell>Order Registered</Table.HeaderCell>
          <Table.HeaderCell>Completed</Table.HeaderCell>
          <Table.HeaderCell>Assignee</Table.HeaderCell>
          <Table.HeaderCell>First Assigned</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {_.map(orders, (order => {
          return (
            <Table.Row key={order.id} positive={order.completed}>
              <Table.Cell>{order.id}</Table.Cell>
                <Popup
                  wide
                  key={order.id}
                  trigger={<Table.Cell>{order.productType } <Icon name='info'/></Table.Cell>}
                  content={order.item}
                />
              <Table.Cell>{order.quantity}</Table.Cell>
              <Table.Cell>{order.shipTo}</Table.Cell>
              <Table.Cell>{order.shippingPrice}</Table.Cell>
              <Table.Cell>{order.totalPrice}</Table.Cell>
              <Table.Cell>{order.platform}</Table.Cell>
              <Table.Cell>{order.sku}</Table.Cell>
              <Table.Cell>{order.asin}</Table.Cell>
              <Table.Cell>{new Date(order.timeRegistered).toLocaleDateString()}</Table.Cell>
              <Table.Cell>{ctaButton(order)}</Table.Cell>
              <Table.Cell>{assigneeList(order)}</Table.Cell>
              <Table.Cell>{order.assignedOn ? new Date(order.assignedOn).toLocaleDateString() : '-'}</Table.Cell>
            </Table.Row>
          );
        }))}
      </Table.Body>
    </Table>
  );
}

OrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  onOrderToggle: PropTypes.func.isRequired,
  onAssigneeChange: PropTypes.func.isRequired,
  employees: PropTypes.array.isRequired,
};

export default OrdersTable;