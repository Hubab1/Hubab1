const initialState = {};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'MANUAL_BANKING_DATA_RECEIVED':
        return Object.assign({}, state, {manualBankingData: action.data});
    default:
        return state;
  }
}
