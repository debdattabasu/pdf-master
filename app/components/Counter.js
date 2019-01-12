import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import OrdersTable from './orders-table';
import orders from '../reducers/orders';
import { Image, Container, Menu, Icon, Label, Table, Button, Input, Grid } from 'semantic-ui-react'

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

  render() {
    return (
      <Container style={{ marginTop: '1em' }}>
        <Menu>
          <Menu.Item>
            <Button primary onClick={this.handleClick}>Import Orders</Button>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Image src='https://react.semantic-ui.com/images/avatar/small/veronika.jpg' avatar />
              <span>{this.props.auth.email}</span>            
            </Menu.Item>
            <Menu.Item
              name='logout'
              onClick={this.logOut}
            />
          </Menu.Menu>
        </Menu>
          <OrdersTable orders={this.props.orders}/>
      </Container>
    );
  }
}
