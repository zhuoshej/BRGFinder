import {
  FETCH_OFFICIAL_HOTELS_LIST,
  FETCH_OFFICIAL_HOTELS_LIST_SUCCESS,
  FETCH_OFFICIAL_HOTELS_LIST_FAIL,
  FETCH_COMPETE_SUCCESS,
  FETCH_COMPETE_FAIL
} from '../actions/types';

const INITIAL_STATE = {
  fetchOfficialHotelsListError: '',
  isFetchingHotelsList: false,
  hotelsList: []
};

const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_OFFICIAL_HOTELS_LIST:
      return { ...INITIAL_STATE, isFetchingHotelsList: true };
    case FETCH_OFFICIAL_HOTELS_LIST_SUCCESS:
      return { ...state, isFetchingHotelsList: false, hotelsList: action.payload };
    case FETCH_OFFICIAL_HOTELS_LIST_FAIL:
      return { ...state, isFetchingHotelsList: false, fetchOfficialHotelsListError: action.payload };
    case FETCH_COMPETE_SUCCESS:
      return { ...state, [action.payload.hotel]: action.payload.result };
    case FETCH_COMPETE_FAIL:
      return { ...state, [action.payload.hotel]: { error: action.payload.error } };
    default:
      return state;
  }
};

export default SearchResultReducer;
