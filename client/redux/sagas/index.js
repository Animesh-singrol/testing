import { all } from 'redux-saga/effects';
import { watchFetchData } from './dataSaga';
import authSaga from './authSaga';

export default function* rootSaga() {
  yield all([
    watchFetchData(),
    authSaga(),
  ]);
}
