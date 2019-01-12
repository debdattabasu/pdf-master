import React, { Component } from 'react';
import { remote, ipcRenderer } from 'electron';
import {Button} from '@material-ui/core'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import _ from 'lodash';

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

  renderTable = () => {
    const { orders } = this.props;
    return (
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Id</TableCell>
              <TableCell align="right">Shipping Price</TableCell>
              <TableCell align="right">Total Price</TableCell>
              <TableCell align="right">Platform</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(orders, (order => {
              return (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell align="right">{order.shippingPrice}</TableCell>
                  <TableCell align="right">{order.totalPrice}</TableCell>
                  <TableCell align="right">{order.platform}</TableCell>
                </TableRow>
              );
            }))}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  render() {
    return (
      <div>
          <Button variant="contained" color="primary" onClick={this.handleClick}>
            Import PDF
          </Button>
          <Button variant="contained" color="primary" onClick={this.logOut}>
            Log Out
          </Button>
          {this.renderTable()}
      </div>
    );
  }
}
