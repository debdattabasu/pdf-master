import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Container, Menu, Button, List, Header, Icon, Segment } from 'semantic-ui-react'
import routes from '../constants/routes';

export default class Employees extends Component<Props> {
  componentDidMount() {
    const {fetchEmployees} = this.props
    fetchEmployees();
  }

  employeesList = () => {
    const {employees} = this.props;
    return (
      <List divided verticalAlign='middle'>
        {employees.map((employee) => {
          <List.Item>
            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/molly.png' />
            <List.Content>{`${employee.name} ${employee.surname}`}</List.Content>
          </List.Item>
        })}
      </List>
    );
  }

  render() {
    return (
      <Container style={{ marginTop: '1em' }}>
        <div>
          <Link to={routes.COUNTER}>
            <Button size='mini' labelPosition='left' icon='left chevron' content='Home' />
          </Link>
          <Header as='h2'>Employee Management</Header>
        </div>
        {this.employeesList()}
      </Container>
    );
  }
}
