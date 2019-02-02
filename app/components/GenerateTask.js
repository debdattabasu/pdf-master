import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Header, Divider, Form, Modal } from 'semantic-ui-react'
import routes from '../constants/routes';
import {mapEmployeesToOptions, mapProductsToOptions} from '../utils/helpers';
import {PRODUCTS} from '../constants/domain'
import OrdersTable from './orders-table';

const initialState = {
  selectedProducts: [],
  employee: undefined,
  count: undefined,
  tasks: [],
  error: false,
}
export default class GenerateTask extends Component<Props> {
  state = initialState;

  componentDidMount() {
    const {fetchEmployees} = this.props;
    fetchEmployees();
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  closeModal = () => this.setState({ error: false })

  generateTask = () => {
    const {getTasks} = this.props;
    const {employee, count, selectedProducts} = this.state;
    const tasks = getTasks({employee, orderLimit: count, productTypes: selectedProducts});
    this.setState({tasks});
  };

  generatePdf = () => {
    const {updateMultipleOrderAssignees} = this.props;
    const {tasks, employee} = this.state;
    try{
      const tmp = updateMultipleOrderAssignees({orders: tasks, employee});
      this.setState(initialState);
    } catch {
      this.setState({error: true});
    }
  }

  renderForm = () => {
    const {employees} = this.props;
    const {selectedProducts, employee, tasks} = this.state;
    const employeeOptions = mapEmployeesToOptions(employees);
    const productOptions = mapProductsToOptions(PRODUCTS);
    const previewEnabled = employee && selectedProducts.length > 0;
    const hasTasks = tasks.length > 0;

    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Select name="selectedProducts" onChange={this.handleChange} fluid label='Product Types' options={productOptions} placeholder='Products' multiple selection required/>
          <Form.Select name="employee" onChange={this.handleChange} fluid label='Employee' options={employeeOptions} placeholder='Pick One' required width={5}/>
          <Form.Input name="count" onChange={this.handleChange} fluid label='Order count' placeholder='Number of orders' type="number" width={5}/>
        </Form.Group>
        <Form.Group>
          <Form.Button primary disabled={!previewEnabled} onClick={this.generateTask}>Preview Tasks</Form.Button>
          <Form.Button secondary disabled={!hasTasks} onClick={this.generatePdf}>Generate PDF</Form.Button>
        </Form.Group>
      </Form>
    );
  }

  render() {
    const {employees} = this.props;
    const {tasks, error} = this.state;
    return (
      <Container style={{ marginTop: '1em' }}>
        <div>
          <Link to={routes.COUNTER}>
            <Button size='mini' labelPosition='left' icon='left chevron' content='Home' />
          </Link>
          <Header as='h2'>Generate Task</Header>
        </div>
        <Divider hidden/>
        {this.renderForm()}
        <Divider hidden/>
        <OrdersTable employees={employees} orders={tasks} onOrderToggle={() => {}} onAssigneeChange={() =>{}}/>
        <Modal open={error} onClose={this.closeModal} basic size='small'>
          <Header icon='fire' content='Error' />
          <Modal.Content>
            <p>
              Something went wrong.
            </p>
          </Modal.Content>
        </Modal>
      </Container>
    );
  }
}