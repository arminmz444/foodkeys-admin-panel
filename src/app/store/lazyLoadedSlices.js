import { combineSlices } from '@reduxjs/toolkit';
import { fuseSettingsSlice } from '@fuse/core/FuseSettings/fuseSettingsSlice';
import { i18nSlice } from 'app/store/i18nSlice';
import apiService from './apiService';
import { userSlice } from '../auth/user/store/userSlice';
import { notificationsSlice } from '../main/apps/notifications/models/notificationSlice';
import categorySlice from '../main/category/categorySlice.js';
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
	/**
	 * Static slices
	 */
	userSlice,
	notificationsSlice,
	fuseSettingsSlice,
	i18nSlice,
	categorySlice,
	/**
	 * Dynamic slices
	 */
	{
		[apiService.reducerPath]: apiService.reducer
	}
).withLazyLoadedSlices();
