import { combineReducers } from 'redux';
import SearchFormReducer from './SearchFormReducer';
import SearchResultReducer from './SearchResultReducer';

export default combineReducers({
  searchFormInfomation: SearchFormReducer,
  searchResultInformation: SearchResultReducer
});
