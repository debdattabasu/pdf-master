import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { signIn } from '../actions/auth';
import SignInForm from '../components/SignInForm'

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
    return <SignInForm handleChange={this.handleChange} handleSubmit={this.handleSubmit}/>
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  { signIn }
)(SignInContainer);
