import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import GenerateTask from '../components/GenerateTask';
import * as OrderActions from '../actions/orders';
import * as EmployeeActions from '../actions/employees';

function mapStateToProps(state, ownProps) {
  return {
    orders: state.orders,
    employees: state.employees,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...OrderActions, ...EmployeeActions}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GenerateTask);
