import uuid from 'uuid/v4';
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

export function addEmployee({firstName, lastName, nickName, id = uuid()}) {
  return (dispatch) => {
    if(nickName !== '') {
      employeesRef
        .child(nickName)
        .set({firstName, lastName, nickName, id})
        .then(dispatch({type: ADD_EMPLOYEE, firstName, lastName, nickName, id}))
        .catch((err) => console.log('error saving employee data!!!', err))
    }
  };
}