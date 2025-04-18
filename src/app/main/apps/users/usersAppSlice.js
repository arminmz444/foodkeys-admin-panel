// import { createSlice } from '@reduxjs/toolkit';
// import { rootReducer } from 'app/store/lazyLoadedSlices';

// const initialState = { searchText: '' };
// /**
//  * The Users App slice.
//  */
// export const usersAppSlice = createSlice({
// 	name: 'usersApp',
// 	initialState,
// 	reducers: {
// 		setSearchText: {
// 			reducer: (state, action) => {
// 				state.searchText = action.payload;
// 			},
// 			prepare: (event) => ({
// 				payload: `${event?.target?.value}` || '',
// 				meta: undefined,
// 				error: null
// 			})
// 		},
// 		resetSearchText: (state) => {
// 			state.searchText = initialState.searchText;
// 		}
// 	},
// 	selectors: {
// 		selectSearchText: (state) => state.searchText
// 	}
// });
// /**
//  * Lazy load
//  * */
// rootReducer.inject(usersAppSlice);
// const injectedSlice = usersAppSlice.injectInto(rootReducer);
// export const { setSearchText, resetSearchText } = usersAppSlice.actions;
// export const { selectSearchText } = injectedSlice.selectors;
// const searchTextReducer = usersAppSlice.reducer;
// export default searchTextReducer;

import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = { searchText: '' };

/**
 * The Users App slice.
 */
export const usersAppSlice = createSlice({
  name: 'usersApp',
  initialState,
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({
        payload: `${event?.target?.value}` || '',
        meta: undefined,
        error: null
      })
    },
    resetSearchText: (state) => {
      state.searchText = initialState.searchText;
    }
  },
  selectors: {
    selectSearchText: (state) => state.searchText
  }
});

/**
 * Lazy load
 * */
rootReducer.inject(usersAppSlice);
const injectedSlice = usersAppSlice.injectInto(rootReducer);
export const { setSearchText, resetSearchText } = usersAppSlice.actions;
export const { selectSearchText } = injectedSlice.selectors;
const searchTextReducer = usersAppSlice.reducer;
export default searchTextReducer;