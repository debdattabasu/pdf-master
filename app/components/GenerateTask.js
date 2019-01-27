import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Header, Divider, Dropdown, Form } from 'semantic-ui-react'
import routes from '../constants/routes';
import {mapEmployeesToOptions, mapProductsToOptions} from '../utils/helpers';
import {PRODUCTS} from '../constants/domain'

export default class GenerateTask extends Component<Props> {
  state ={
    selectedProducts: [],
    employee: undefined,
    count: undefined,
  }

  componentDidMount() {
    const {fetchEmployees} = this.props;
    fetchEmployees();
  }

  handleProductChange = (e, { value }) => this.setState({ selectedProducts: value })

  handleEmployeeChange = (e, { value }) => this.setState({ employee: value })

  onCountChange = (e, { value }) => this.setState({ count: value })

  renderForm = () => {
    const {employees} = this.props;
    const {selectedProducts, employee} = this.state;
    const employeeOptions = mapEmployeesToOptions(employees);
    const productOptions = mapProductsToOptions(PRODUCTS);
    const previewEnabled = employee && selectedProducts.length > 0;

    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Select onChange={this.handleProductChange} fluid label='Product Types' options={productOptions} placeholder='Products' multiple selection required/>
          <Form.Select onChange={this.handleEmployeeChange} fluid label='Employee' options={employeeOptions} placeholder='Pick One' required width={5}/>
          <Form.Input onChange={this.onCountChange} fluid label='Order count' placeholder='Number of orders' type="number" width={5}/>
        </Form.Group>
        <Form.Button positive disabled={!previewEnabled}>Preview Tasks</Form.Button>
      </Form>
    );
  }

  render() {
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
      </Container>
    );
  }
}