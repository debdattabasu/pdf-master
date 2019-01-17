import { employeesRef } from '../config/firebase';

export const FETCH_EMPLOYEES = 'FETCH_EMPLOYEES';
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';

export const fetchEmployees = () => async dispatch => {
  employeesRef.once('value', (snapshot) => {
    if (snapshot.val()) {
      const employees = Object.keys(snapshot.val()).map(i => snapshot.val()[i])
      dispatch({type: FETCH_EMPLOYEES, employees});
    }
  });
}; 