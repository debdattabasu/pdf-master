import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Header, Divider, Form,} from 'semantic-ui-react'
import routes from '../constants/routes';

export default class GenerateTask extends Component<Props> {
  state = {
    shipTo: ''
  }

  componentDidMount() {
    const {order = {}} = this.props;
    const {shipTo} = order;
    this.setState({shipTo});
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  saveOrder = () => {
    const {updateOrder, order} = this.props;
    const updatedOrder = {...order, ...this.state}
    updateOrder(updatedOrder);
    this.props.history.push(routes.COUNTER)
  }

  render() {
    const {match} = this.props;
    const {shipTo} = this.state;
    const disabled = !shipTo;

    return (
      <Container style={{ marginTop: '1em' }}>
        <div>
          <Link to={routes.COUNTER}>
            <Button size='mini' labelPosition='left' icon='left chevron' content='Home' />
          </Link>
          <Header
            as='h2'
            content={`Order ID: ${match.params.id}`}
            subheader='Edit order shipping address'
          />
        </div>
        <Divider hidden/>
        <Form>
        <Form.TextArea name="shipTo" label='Ship To' onChange={this.handleChange} value={shipTo} />
        <Form.Button disabled={disabled} onClick={this.saveOrder}>Save</Form.Button>
      </Form>
      </Container>
    );
  }
}