import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {Table, Checkbox, Dropdown, Popup, Icon, Button} from 'semantic-ui-react'
import _ from 'lodash';
import {mapEmployeesToOptions} from '../utils/helpers';
import routes from '../constants/routes';

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
    const { orders, displayItem } = this.props;
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
            {displayItem ? null : <Table.HeaderCell>Completed</Table.HeaderCell>}
            {displayItem ? null : <Table.HeaderCell>Assignee</Table.HeaderCell>}
            {displayItem ? null : <Table.HeaderCell>First Assigned</Table.HeaderCell>}
            {displayItem ? null :  <Table.HeaderCell>Edit</Table.HeaderCell>}
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
                <Popup
                  wide
                  trigger={<Table.Cell>{displayItem ? `${order.productType} ${order.item}` : order.productType} <Icon name='info'/></Table.Cell>}
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
                {displayItem ? null : <Table.Cell>{this.ctaButton(order)}</Table.Cell>}
                {displayItem ? null : <Table.Cell>{this.assigneeList(order)}</Table.Cell>}
                {displayItem ? null : <Table.Cell>{order.assignedOn ? new Date(order.assignedOn).toLocaleDateString() : '-'}</Table.Cell>}
                {displayItem ? null : <Table.Cell><Link to={`${routes.EDIT_ORDER}/${order.id}`}><Button size='mini' icon="pencil alternate"/></Link></Table.Cell>}
              </Table.Row>
            );
          }))}
        </Table.Body>
      </Table>
    );
  }
}
