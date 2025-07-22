export const useGlobalReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONTACTS":
      return { ...state, contacts: action.payload };
    default:
      return state;
  }
};
