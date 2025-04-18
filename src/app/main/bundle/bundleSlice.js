import { createSlice } from '@reduxjs/toolkit';

const bundleSlice = createSlice({
	name: 'bundles',
	initialState: {
		list: []
	},
	reducers: {
		setBundles: (state, action) => {
			state.list = action.payload;
		}
	}
});

export const { setBundles } = bundleSlice.actions;
export default bundleSlice.reducer;
