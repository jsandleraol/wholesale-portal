import { combineReducers } from "redux";

const initialUser = {
  name: "",
};

const user = (state = initialUser, action) => {
  switch (action.type) {
    case "GET_USER":
      return action.payload;
    default:
      return state;
  }
};

const loaded = (state = false, action) => {
  switch (action.type) {
    case "APP_LOADED":
      return true;
    default:
      return state;
  }
};

const initialProducts = {
  products: [],
  category: "All"
}
const products = (state = initialProducts, action) => {
  switch (action.type) {
    case "ADD_ALL_PRODUCTS":
      return Object.assign({}, state, {
        products: action.payload
      })
    case "UPDATE_CATEGORY":
      return Object.assign({}, state, {
      category: action.payload
    })
    case "UPDATE_PRODUCTS":
      return Object.assign({}, state, {
        products: [
            ...state.products,
            action.payload
            ]
      })
      return state;
    default:
      return state;
  }
}
export default combineReducers({
  user,
  products,
  loaded,
});
