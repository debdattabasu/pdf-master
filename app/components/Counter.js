import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import { remote, ipcRenderer } from 'electron';
import { Image, Container, Menu, Button, Grid, Modal, Header} from 'semantic-ui-react'
import OrdersTable from './orders-table';
import routes from '../constants/routes';
import {formatImportSummary} from '../utils/helpers';

const initialState = {
  importingFiles: false,
  showModal: false,
  importSummary: {
    header: '',
    content: [],
  }
}

export default class Counter extends Component<Props> {
  state = initialState;

  componentDidMount() {
    const {initialOrdersFetch, fetchEmployees} = this.props
    initialOrdersFetch();
    fetchEmployees();
  }

  importOrders = async () => {
    const {addPdfToList} = this.props;
    const filters = [{name: 'Documents', extensions: ['pdf']}];
    const paths = remote.dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'], filters}) || [];
    let parsedFileSummaries = [];
    const filesSelectedCount = paths.length;
    if(filesSelectedCount > 0) {
      this.setState({importingFiles: true});
      for (const path of paths) {
        const pdfData = ipcRenderer.sendSync('scrapePDF', path);
        const addedOrderCount = await addPdfToList(pdfData.text);
        parsedFileSummaries.push({path, ...addedOrderCount});
      }
      const importSummary = formatImportSummary({filesSelectedCount, parsedFileSummaries});
      this.setState({showModal: true, importSummary, importingFiles: false});
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

  closeModal = () => this.setState(initialState);

  getAppVersion = () => ipcRenderer.sendSync('appVersion') || null;

  modalContent = () => {
    return (
      <Modal.Content image>
        <Modal.Description>
          <Header>{this.state.importSummary.header}</Header>
          <Header color="green">{this.state.importSummary.totalOrdersSaved}</Header>
          <Header color="red">{this.state.importSummary.totalOrdersFailed}</Header>
          {this.state.importSummary.content.map((summary, index) => {
            return (
              <p key={index}>
                {summary.path}
                <strong>{` Orders Parsed: ${summary.newOrderCount}`}</strong>
              </p>
            );
          })}
        </Modal.Description>
      </Modal.Content>
    );
  }

  render() {
    const {auth, orders, employees, onAssigneeChange, app} = this.props;
    const {importingFiles} = this.state;

    return (
      <Container fluid style={{ padding: '2em'}}>
        <Menu>
          <Menu.Item>
            <Button loading={importingFiles} disabled={importingFiles} secondary size='small' onClick={this.importOrders}>Import Orders</Button>
          </Menu.Item>
          <Menu.Item>
            <Link to={routes.EMPLOYEES}><Button primary size='small'>Employees</Button></Link>
          </Menu.Item>
          <Menu.Item>
            <Link to={routes.GENERATE_TASK}><Button primary size='small'>Generate Task</Button></Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <span>{`Version: ${this.getAppVersion()}`}</span>            
            </Menu.Item>
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
            <Button disabled={!app.orderCursor} content={!app.orderCursor ? 'Nothing More to Load' : 'Load More'} loading={app.loadingMoreOrders} size="small" onClick={this.loadMoreOrders}/>
          </Grid.Column>
        </Grid>
        <Modal
          open={this.state.showModal}
          header="Import Summary"
          content={this.modalContent}
          actions={[{ key: 'done', content: 'Ok', positive: true }]}
          onClose={this.closeModal}
          onActionClick={this.closeModal}
        />
      </Container>
    );
  }
}
