import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Image, Container, Button, List, Header, Divider } from 'semantic-ui-react'
import routes from '../constants/routes';
import EmployeeForm from './EmployeeForm';

const initialState = {
  firstName: '',
  lastName: '',
  nickName: '',
};

export default class Employees extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = initialState
  }
  
  componentDidMount() {
    const {fetchEmployees} = this.props
    fetchEmployees();
  }

  employeesList = () => {
    const {employees} = this.props;
    return (
      <List divided verticalAlign='middle'>
        {employees.map((employee) => {
          const {id, image, firstName, lastName, nickName} = employee;
          return (
            <List.Item key={id}>
              <Image avatar src={image} />
              <List.Content>{`${firstName} ${lastName} ${nickName}`}</List.Content>
            </List.Item>
          );
        })}
      </List>
    );
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onAddNewEmployee = () => {
    const {addEmployee} = this.props;
    const {firstName, lastName, nickName} = this.state;
    this.setState(initialState);

    addEmployee({firstName, lastName, nickName})
  }

  render() {
    const {nickName} = this.state;
    const disabled = nickName === '';

    return (
      <Container style={{ marginTop: '1em' }}>
        <div>
          <Link to={routes.COUNTER}>
            <Button size='mini' labelPosition='left' icon='left chevron' content='Home' />
          </Link>
          <Header as='h2'>Employee Management</Header>
        </div>
        <Divider hidden/>
        <EmployeeForm handleChange={this.handleChange} onSubmit={this.onAddNewEmployee} disabled={disabled}/>
        <Divider hidden/>
        <Header as='h3'>Employees:</Header>
        {this.employeesList()}
      </Container>
    );
  }
}
