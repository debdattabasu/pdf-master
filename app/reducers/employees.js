import {FETCH_EMPLOYEES, ADD_EMPLOYEE} from '../actions/employees';

const employeeExists = (employees, nickName) => employees.some((e) => e.nickName === nickName);

export default function orders(state = [], action: Action) {
  switch (action.type) {
    case ADD_EMPLOYEE: {
      const {nickName} = action;
      if (employeeExists(state, nickName)) {
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
