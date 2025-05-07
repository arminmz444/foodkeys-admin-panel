// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import excelTemplateReducer from './excelTemplateSlice';

export const store = configureStore({
  reducer: {
    excelTemplate: excelTemplateReducer,
  },
});

export default store;