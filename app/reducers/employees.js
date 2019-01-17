import {FETCH_EMPLOYEES, ADD_EMPLOYEE} from '../actions/employees';

const employeeExists = (employees, {name, surname}) => {
  return employees.some((e) => e.name === name && e.surname === surname);
}

export default function orders(state = [], action: Action) {
  switch (action.type) {
    case ADD_EMPLOYEE: {
      const {name, surname} = action;
      if (employeeExists(state, {name, surname})) {
        return state;
      } else {
        return [...state, action];
      }
    }
    case FETCH_EMPLOYEES: {
      return action.employees
    }
    default:
      return state;
  }
}
