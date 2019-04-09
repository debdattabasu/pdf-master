import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import { Image, Container, Menu, Button, Grid} from 'semantic-ui-react'
import OrdersTable from './orders-table';
import routes from '../constants/routes';

export default class Counter extends Component<Props> {
  state = {
    filter: undefined,
  }
  componentDidMount() {
    const {fetchOrders, fetchEmployees} = this.props
    fetchOrders();
    fetchEmployees();
  }

  importOrders = () => {
    const {addPdfToList} = this.props;
    const filters = [{name: 'Documents', extensions: ['pdf']}];
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'], filters}) || [];
    if(paths.length > 0) {
      paths.forEach((path) => {
        const pdfData = ipcRenderer.sendSync('scrapePDF', path);
        addPdfToList(pdfData.text);
      });
    }
  }

  logOut = () => {
    const {signOut} = this.props;
    signOut();
  }

  onOrderToggle = (order) => {
    const {toggleOrder} = this.props;
    toggleOrder(order);
  }

  fetchOrders = () => {
    this.props.fetchOrders();
  }

  loadMoreOrders = () => {
    this.props.fetchOrders(this.props.app.orderCursor, this.state.filter);
  }

  loadAll = () => this.loadFilteredOrders(undefined);
  loadFulfilled = () => this.loadFilteredOrders(true);
  loadUnfulfilled = () => this.loadFilteredOrders(false);

  loadFilteredOrders = (filter) => {
    this.setState({filter});
    this.props.clearAllOrders();
    this.props.fetchOrders(null, filter);
  }

  render() {
    const {auth, orders, employees, onAssigneeChange, app} = this.props;

    return (
      <Container fluid style={{ padding: '2em'}}>
        <Menu>
          <Menu.Item>
            <Button primary size='small' onClick={this.importOrders}>Import Orders</Button>
          </Menu.Item>
          <Menu.Item>
            <Link to={routes.EMPLOYEES}><Button primary size='small'>Employees</Button></Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={routes.GENERATE_TASK}><Button primary size='small'>Generate Task</Button></Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Image src='https://react.semantic-ui.com/images/avatar/small/veronika.jpg' avatar />
              <span>{auth.email}</span>            
            </Menu.Item>
            <Menu.Item
              name='logout'
              onClick={this.logOut}
            />
          </Menu.Menu>
        </Menu>
        <Button.Group size='mini'>
          <Button onClick={this.loadAll} content="All Orders"/>
          <Button.Or />
          <Button onClick={this.loadFulfilled} content="Fulfilled Only" color="green"/>
          <Button.Or />
          <Button onClick={this.loadUnfulfilled} content="Unfulfilled Only" color="red"/>
        </Button.Group>
        <OrdersTable 
          employees={employees}
          orders={orders}
          onOrderToggle={this.onOrderToggle}
          onAssigneeChange={onAssigneeChange}
        />
        <Grid>
          <Grid.Column textAlign="center">
            <Button content='Load More' loading={app.loadingMoreOrders} size="small" onClick={this.loadMoreOrders}/>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
