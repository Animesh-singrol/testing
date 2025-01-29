// redux/sagas/authSaga.js
import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { signInSuccess, signInFailure } from '../actions/authActions';

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function* handleSignIn({ payload }) {
  try {
    const response = yield call(axios.post, `${Base_URL}auth/signin`, payload);
    yield put(signInSuccess(response.data));
    // Optionally redirect after successful sign-in
  } catch (error) {
    yield put(signInFailure(error.response?.data?.message || 'Sign-in failed'));
  }
}

export default function* authSaga() {
  yield takeLatest('SIGN_IN_REQUEST', handleSignIn);
}
