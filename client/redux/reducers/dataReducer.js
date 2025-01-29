const initialState = {
    loading: false,
    data: null,
    error: null,
  };
  
  export default function dataReducer(state = initialState, action) {
    switch (action.type) {
      case 'FETCH_DATA_REQUEST':
        return { ...state, loading: true, error: null };
      case 'FETCH_DATA_SUCCESS':
        return { ...state, loading: false, data: action.payload };
      case 'FETCH_DATA_FAILURE':
        return { ...state, loading: false, error: action.error };
      default:
        return state;
    }
  }
  