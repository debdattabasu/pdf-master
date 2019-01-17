import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as OrderActions from '../actions/orders';
import { signOut } from "../actions/auth";

const getVisibleOrders = (orders, filter) => {
  switch (filter) {
    case OrderActions.VisibilityFilters.SHOW_ALL:
      return orders
    case OrderActions.VisibilityFilters.SHOW_COMPLETED:
      return orders.filter(el => el.completed)
    case OrderActions.VisibilityFilters.SHOW_ACTIVE:
      return orders.filter(el => !el.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    orders: getVisibleOrders(state.orders, state.visibilityFilter),
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...OrderActions, signOut}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
