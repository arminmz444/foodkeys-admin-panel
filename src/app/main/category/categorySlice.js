import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
	name: 'categories',
	initialState: {
		list: []
	},
	reducers: {
		setCategories: (state, action) => {
			state.list = action.payload;
		}
	}
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
