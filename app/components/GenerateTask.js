import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Header, Divider, Dropdown, Form } from 'semantic-ui-react'
import routes from '../constants/routes';
import {mapEmployeesToOptions, mapProductsToOptions} from '../utils/helpers';
import {PRODUCTS} from '../constants/domain'

export default class GenerateTask extends Component<Props> {
  componentDidMount() {
    const {fetchEmployees} = this.props;
    fetchEmployees();
  }

  renderForm = () => {
    const {employees} = this.props;
    const employeeOptions = mapEmployeesToOptions(employees);
    const productOptions = mapProductsToOptions(PRODUCTS);

    return (
      <Form>
        <Form.Group widths='equal'>
          <Form.Select fluid label='Employee' options={employeeOptions} placeholder='Pick One'/>
          <Form.Select fluid label='Product Types' options={productOptions} placeholder='Products' multiple selection/>
        </Form.Group>
        <Form.Button>Preview Tasks</Form.Button>
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