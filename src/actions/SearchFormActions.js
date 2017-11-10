import axios from 'axios';
import {
  SEARCH_FORM_UPDATE,
  AUTOCOMPLETE_UPDATE
} from './types';

export const searchFormUpdate = ({ prop, value }) => {
  if (prop === 'destination') {
    return updateDestination(value);
  }
  return {
    type: SEARCH_FORM_UPDATE,
    payload: { prop, value }
  };
};

const updateDestination = (destination) => {
  return (dispatch) => {
    dispatch({
      type: SEARCH_FORM_UPDATE,
      payload: { prop: 'destination', value: destination }
    });

    axios
    .get(`https://brgfinder.herokuapp.com/autoComplete/${destination}`)
    .then(response => {
        dispatch({
          type: AUTOCOMPLETE_UPDATE,
          payload: { hint: response.data.hint, result: response.data.result }
        });
    })
    .catch(() => {
      dispatch({
        type: AUTOCOMPLETE_UPDATE,
        payload: { hint: '', result: [] }
      });
    });
  };
};
