// redux/reducers/authReducer.js
const initialState = {
    doctor: null,
    token: null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SIGN_IN_SUCCESS':
        return { ...state, doctor: action.payload.doctor, token: action.payload.token, error: null };
      case 'SIGN_IN_FAILURE':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  export default authReducer;
  