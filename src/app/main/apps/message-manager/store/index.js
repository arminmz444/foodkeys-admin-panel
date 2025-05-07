import { combineReducers } from "@reduxjs/toolkit";
import templates from "./templatesSlice";
import { templatesApi } from "./templatesApi";


const reducer = combineReducers({
  templates,
  [templatesApi.reducerPath]: templatesApi.reducer
});

export default reducer;