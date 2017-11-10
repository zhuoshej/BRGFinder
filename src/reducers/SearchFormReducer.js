import {
  SEARCH_FORM_UPDATE,
  AUTOCOMPLETE_UPDATE
} from '../actions/types';

const INITIAL_STATE = {
  destination: '',
  startDate: undefined,
  endDate: undefined,
  autoCompleteCandidates: []
};

const SearchFormReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_FORM_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
    case AUTOCOMPLETE_UPDATE:
      if (action.payload.hint !== state.destination.toLowerCase()) {
        return state;
      }
      return { ...state, autoCompleteCandidates: action.payload.result };
    default:
      return state;
  }
};

export default SearchFormReducer;
