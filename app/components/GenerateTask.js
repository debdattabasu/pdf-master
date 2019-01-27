import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import { Container, Button, Header, Divider } from 'semantic-ui-react'

export default class GenerateTask extends Component<Props> {
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
      </Container>
    );
  }
}