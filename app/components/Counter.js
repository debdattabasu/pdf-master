import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import { Image, Container, Menu, Button} from 'semantic-ui-react'
import OrdersTable from './orders-table';

export default class Counter extends Component<Props> {
  componentDidMount() {
    this.props.fetchOrders();
  }
 
  handleClick = () => {
  const {addPdfToList} = this.props;
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }) || [];
    paths.forEach((path) => {
      const pdfData = ipcRenderer.sendSync('scrapePDF', path);
      addPdfToList(pdfData.text);
    });
  }

  logOut = () => {
    const {signOut} = this.props;
    signOut();
  }

  onOrderToggle = (order) => {
    const {toggleOrder} = this.props;
    toggleOrder(order);
  }

  render() {
    const {auth, orders} = this.props;
    return (
      <Container style={{ marginTop: '1em' }}>
        <Menu>
          <Menu.Item>
            <Button primary onClick={this.handleClick}>Import Orders</Button>
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
          <OrdersTable orders={orders} onOrderToggle={this.onOrderToggle}/>
      </Container>
    );
  }
}
