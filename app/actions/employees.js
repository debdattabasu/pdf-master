import uuid from 'uuid/v4';
import { employeesRef } from '../config/firebase';
import _ from 'lodash';

export const FETCH_EMPLOYEES = 'FETCH_EMPLOYEES';
export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';

const images = [
  'https://react.semantic-ui.com/images/avatar/small/matthew.png',
  'https://react.semantic-ui.com/images/avatar/small/molly.png',
  'https://react.semantic-ui.com/images/avatar/small/daniel.jpg',
  'https://react.semantic-ui.com/images/avatar/small/joe.jpg',
  'https://react.semantic-ui.com/images/avatar/small/stevie.jpg',
  'https://react.semantic-ui.com/images/avatar/small/zoe.jpg',
  'https://react.semantic-ui.com/images/avatar/small/ade.jpg',
  'https://react.semantic-ui.com/images/avatar/small/nan.jpg',
  'https://react.semantic-ui.com/images/avatar/small/veronika.jpg'
];

const getRandomImage = () => {
  const randomImages = _.shuffle(images);
  return randomImages[0]
}

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
      const employee = {firstName, lastName, nickName, id, image: getRandomImage()}
      employeesRef
        .child(nickName)
        .set(employee)
        .then(dispatch({type: ADD_EMPLOYEE, ...employee}))
        .catch((err) => console.log('error saving employee data!!!', err))
    }
  };
}