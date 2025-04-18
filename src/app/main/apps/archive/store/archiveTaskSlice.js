import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = { 
  searchText: '',
  selectedStatus: null
};

/**
 * The Archive Task App slice.
 */
export const archiveTaskSlice = createSlice({
  name: 'archiveTaskApp',
  initialState,
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({
        payload: event?.target?.value || '',
        meta: undefined,
        error: null
      })
    },
    resetSearchText: (state) => {
      state.searchText = initialState.searchText;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    resetFilters: (state) => {
      state.selectedStatus = null;
    }
  },
  selectors: {
    selectSearchText: (state) => state.searchText,
    selectSelectedStatus: (state) => state.selectedStatus,
    selectFilters: (state) => ({
      status: state.selectedStatus
    })
  }
});

/**
 * Lazy load
 * */
rootReducer.inject(archiveTaskSlice);
const injectedSlice = archiveTaskSlice.injectInto(rootReducer);

// Export actions and selectors
export const {
  setSearchText,
  resetSearchText,
  setSelectedStatus,
  resetFilters
} = archiveTaskSlice.actions;

export const {
  selectSearchText,
  selectSelectedStatus,
  selectFilters
} = injectedSlice.selectors;

export default archiveTaskSlice.reducer;