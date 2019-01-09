import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react';
import { signIn } from '../actions/auth';

class SignInContainer extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      submitted: false
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.auth) {
        this.context.router.history.push('/counter');
      }
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;
    console.log('username, password: ', username, password);
    if (username && password) {
      this.props.signIn({username, password});
    }
  }

  render() {
    return (
      <div className="login-form">
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
        <Grid
          textAlign="center"
          style={{ height: '100%' }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              PRESSCCOO
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="username"
                  onChange={this.handleChange}
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  onChange={this.handleChange}
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={this.handleSubmit}
                >
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { signIn }
)(SignInContainer);
