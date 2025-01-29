import { takeLatest, call, put } from 'redux-saga/effects';

// API call function
const fetchApi = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  return response.json();
};

// Worker saga
function* fetchData() {
  try {
    const data = yield call(fetchApi);
    yield put({ type: 'FETCH_DATA_SUCCESS', payload: data });
  } catch (error) {
    yield put({ type: 'FETCH_DATA_FAILURE', error: error.message });
  }
}

// Watcher saga
export function* watchFetchData() {
  yield takeLatest('FETCH_DATA_REQUEST', fetchData);
}
