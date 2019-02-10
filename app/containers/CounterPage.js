import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as OrderActions from '../actions/orders';
import { signOut } from "../actions/auth";
import * as EmployeeActions from '../actions/employees';
import _ from 'lodash';

const getVisibleOrders = (orders, filter) => {
  switch (filter) {
    case OrderActions.VisibilityFilters.SHOW_ALL:
      return orders
    case OrderActions.VisibilityFilters.SHOW_COMPLETED:
      return orders.filter(el => el.completed)
    case OrderActions.VisibilityFilters.SHOW_ACTIVE:
      return orders.filter(el => !el.completed)
    case OrderActions.VisibilityFilters.ORDER_BY_RATING: {
      const activeOrders = orders.filter(el => !el.completed);
      return _.sortBy(activeOrders, ['rating', 'timeRegistered']);
    }
    default:
      throw new Error(`Unknown filter:  ${filter}`)
  }
}

function mapStateToProps(state, ownProps) {
  return {
    orders: getVisibleOrders(state.orders, state.visibilityFilter),
    employees: state.employees,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...OrderActions, signOut, ...EmployeeActions}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Counter);
