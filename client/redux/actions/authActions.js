// redux/actions/authActions.js
export const signInRequest = (payload) => ({
    type: 'SIGN_IN_REQUEST',
    payload,
  });
  
  export const signInSuccess = (data) => ({
    type: 'SIGN_IN_SUCCESS',
    payload: data,
  });
  
  export const signInFailure = (error) => ({
    type: 'SIGN_IN_FAILURE',
    payload: error,
  });
  