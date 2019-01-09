// @flow
import { ADD_ORDER } from '../actions/orders';
import type { Action } from './types';

export default function orders(state = [], action: Action) {
  switch (action.type) {
    case ADD_ORDER: {
      return [
        ...state,
        action
      ]
    }
    default:
      return state;
  }
}
