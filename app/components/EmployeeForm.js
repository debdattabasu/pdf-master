import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react'

export default class EmployeeForm extends Component<Props> {
  render() {
    const {handleChange, onSubmit, disabled} = this.props;

    return (
      <Form warning>
        <Message warning content='NOTE!!! When creating an employee nickname has to be unique!'/>
        <Form.Group widths='equal'>
          <Form.Input name='firstName' onChange={handleChange} fluid label='First name' placeholder='First name' />
          <Form.Input name='lastName' onChange={handleChange} fluid label='Last name' placeholder='Last name' />
          <Form.Input name='nickName' onChange={handleChange} fluid label='Nick' placeholder='Nick name' />
        </Form.Group>
        <Form.Button disabled={disabled} onClick={onSubmit} type='submit'>Add Employee</Form.Button>
      </Form>
    )
  }
}