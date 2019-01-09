// @flow
import * as React from 'react';
import { connect } from "react-redux";
import { fetchUser } from "../actions/auth";

type Props = {
  children: React.Node
};

class App extends React.Component<Props> {
  props: Props;

  componentWillMount() {
    this.props.fetchUser();
  }
  
  render() {
    const { children } = this.props;
    return <React.Fragment>{children}</React.Fragment>;
  }
}

export default connect(null, { fetchUser })(App);
