const initialState = {};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'BANKING_DATA_RECEIVED':
        return Object.assign({}, state, {bankingData: action.data});
    default:
        return state;
  }
}
