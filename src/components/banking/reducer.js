const initialState = {};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'BANKING_DATA_RECEIVED':
        return Object.assign({}, state, {bankingData: action.data});
    case 'BANKING_DATA_CLEARED':
        return {};
    default:
        return state;
  }
}
