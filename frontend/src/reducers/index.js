import { combineReducers } from "redux";
import loginReducer from "./login";
import { userReducer } from "./user";
import { systemReducer } from "./system";

const allReducers = combineReducers({
  loginReducer,
  userReducer,
  systemReducer
});

export default allReducers;