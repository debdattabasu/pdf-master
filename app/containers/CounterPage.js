import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as OrderActions from '../actions/orders';
import { signOut } from "../actions/auth";

function mapStateToProps(state) {
  return {
    orders: state.orders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...OrderActions, signOut}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
