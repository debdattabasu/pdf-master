import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import Employees from '../components/Employees'
import * as EmployeeActions from '../actions/employees';

function mapStateToProps(state, ownProps) {
  return {
    employees: state.employees,
    auth: state.auth,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...EmployeeActions}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Employees)