import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Table, Checkbox, Dropdown, Popup, Icon} from 'semantic-ui-react'
import _ from 'lodash';
import {mapEmployeesToOptions} from '../utils/helpers';
import {HOME_ADDRESS} from '../constants/domain'

export default class OrdersTable extends PureComponent {
  static propTypes = {
    orders: PropTypes.array.isRequired,
    onOrderToggle: PropTypes.func.isRequired,
    onAssigneeChange: PropTypes.func.isRequired,
    employees: PropTypes.array.isRequired,
    displayItem: PropTypes.bool,
  };

  ctaButton = (order) => <Checkbox checked={order.completed} toggle onChange={() => this.props.onOrderToggle(order)}/>

  assigneeList = (order) => {
    const {assignedOn, id, assignee, ref} = order;
    const {employees, onAssigneeChange} = this.props;
    const options = mapEmployeesToOptions(employees);

    return (
      <Dropdown 
        inline
        options={options}
        value={assignee || null}
        onChange={(event, data) => onAssigneeChange({...data, orderId: id, assignedOn, ref})}
      />
    )
  }

  render() {
    const { orders } = this.props;
    return (
      <Table size="small" compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order Id</Table.HeaderCell>
            <Table.HeaderCell>Product Type</Table.HeaderCell>
            <Table.HeaderCell>Order Index</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Shipping Price</Table.HeaderCell>
            <Table.HeaderCell>Total Price</Table.HeaderCell>
            <Table.HeaderCell>Platform</Table.HeaderCell>
            <Table.HeaderCell>SKU</Table.HeaderCell>
            <Table.HeaderCell>Order Registered</Table.HeaderCell>
            <Table.HeaderCell>Ship To</Table.HeaderCell>
            <Table.HeaderCell>Home address</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(orders, (order => {
            return (
              <Table.Row key={order.id} positive={order.completed}>
                <Popup
                  wide
                  trigger={<Table.Cell>{order.id}</Table.Cell>}
                  content={`Rating: ${order.rating}`}
                />
                <Table.Cell width="3"><span style={{fontWeight: 'bold'}}>{order.productType}</span> {order.item}</Table.Cell>
                <Table.Cell width="1">{order.orderIndex}</Table.Cell>
                <Table.Cell>{order.quantity}</Table.Cell>
                <Table.Cell>{order.shippingPrice}</Table.Cell>
                <Table.Cell>{order.totalPrice}</Table.Cell>
                <Table.Cell>{order.platform}</Table.Cell>
                <Table.Cell>{order.sku}</Table.Cell>
                <Table.Cell>{new Date(order.timeRegistered).toLocaleDateString()}</Table.Cell>
                <Table.Cell width="2">{order.shipTo}</Table.Cell>
                <Table.Cell width="2">{HOME_ADDRESS}</Table.Cell>
              </Table.Row>
            );
          }))}
        </Table.Body>
      </Table>
    );
  }
}
