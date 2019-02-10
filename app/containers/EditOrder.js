import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import EditOrder from '../components/EditOrder';
import * as OrderActions from '../actions/orders';
import * as EmployeeActions from '../actions/employees';
import _ from 'lodash';

function mapStateToProps(state, ownProps) {
  const orderId = ownProps.match.params.id;
  return {
    orders: state.orders,
    order: _.find(state.orders, (order) => order.id === orderId),
    employees: state.employees,
    auth: state.auth,
    ...ownProps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...OrderActions, ...EmployeeActions}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditOrder);
