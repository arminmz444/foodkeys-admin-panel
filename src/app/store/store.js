import { configureStore, createSelector } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import apiService from 'app/store/apiService';
import { rootReducer } from './lazyLoadedSlices';
import { dynamicMiddleware } from './middleware';
import { createPreloadedState } from './rehydration';

const middlewares = [apiService.middleware, dynamicMiddleware];

// Create preloaded state from localStorage
const preloadedState = createPreloadedState();

export const makeStore = (preloadedState) => {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middlewares),
		preloadedState
	});
	// configure listeners using the provided defaults
	// optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
	setupListeners(store.dispatch);
	return store;
};
export const store = makeStore(preloadedState);
export const createAppSelector = createSelector.withTypes();
export default store;
