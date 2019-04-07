import uuid from 'uuid/v4';
import { fireStore, employeesRef } from '../config/firebase';
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
  fireStore.collection("employees").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      dispatch({type: ADD_EMPLOYEE, ...doc.data()});
    });
});
}; 

export function addEmployee({firstName, lastName, nickName, id = uuid()}) {
  return (dispatch) => {
    if(nickName !== '') {
      const employee = {firstName, lastName, nickName, id, image: getRandomImage()}
      fireStore.collection("employees").add(employee)
      .then(function() {
          // console.log("Document written with ID: ", docRef.id);
          dispatch({type: ADD_EMPLOYEE, ...employee});
      })
      .catch(function(error) {
          console.error("Error adding employee: ", error);
      });
    }
  };
}