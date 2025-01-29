import { combineReducers } from 'redux';
import dataReducer from './dataReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
  data: dataReducer, // Add more reducers here as needed
  auth: authReducer,
});

export default rootReducer;
