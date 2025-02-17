import { createSlice } from '@reduxjs/toolkit';

const subscriptionSlice = createSlice({
	name: 'subscriptions',
	initialState: {
		list: []
	},
	reducers: {
		setSubscriptions: (state, action) => {
			state.list = action.payload;
		}
	}
});

export const { setSubscriptions } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
