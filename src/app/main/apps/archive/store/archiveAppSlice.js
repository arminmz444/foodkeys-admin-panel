// src/app/main/apps/archive/store/archiveAppSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = { 
  searchText: '',
  selectedEntityType: null,
  selectedArchiveType: null,
  selectedTimeRange: null,
  selectedViewMode: 'grid', // 'grid' or 'list'
  compareMode: {
    active: false,
    firstArchiveId: null,
    secondArchiveId: null
  }
};


export const archiveAppSlice = createSlice({
  name: 'archiveApp',
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
    },
    setSelectedEntityType: (state, action) => {
      state.selectedEntityType = action.payload;
    },
    setSelectedArchiveType: (state, action) => {
      state.selectedArchiveType = action.payload;
    },
    setSelectedTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload;
    },
    setViewMode: (state, action) => {
      state.selectedViewMode = action.payload;
    },
    toggleCompareMode: (state) => {
      state.compareMode.active = !state.compareMode.active;
      if (!state.compareMode.active) {
        state.compareMode.firstArchiveId = null;
        state.compareMode.secondArchiveId = null;
      }
    },
    setFirstArchiveForCompare: (state, action) => {
      state.compareMode.firstArchiveId = action.payload;
    },
    setSecondArchiveForCompare: (state, action) => {
      state.compareMode.secondArchiveId = action.payload;
    },
    resetCompareMode: (state) => {
      state.compareMode = initialState.compareMode;
    },
    resetFilters: (state) => {
      state.selectedEntityType = null;
      state.selectedArchiveType = null;
      state.selectedTimeRange = null;
    }
  },
  selectors: {
    selectSearchText: (state) => state.searchText,
    selectSelectedEntityType: (state) => state.selectedEntityType,
    selectSelectedArchiveType: (state) => state.selectedArchiveType,
    selectSelectedTimeRange: (state) => state.selectedTimeRange,
    selectViewMode: (state) => state.selectedViewMode,
    selectCompareMode: (state) => state.compareMode,
    selectFilters: (state) => ({
      entityType: state.selectedEntityType,
      archiveType: state.selectedArchiveType,
      timeRange: state.selectedTimeRange
    })
  }
});


rootReducer.inject(archiveAppSlice);
const injectedSlice = archiveAppSlice.injectInto(rootReducer);
export const { 
  setSearchText, 
  resetSearchText,
  setSelectedEntityType,
  setSelectedArchiveType,
  setSelectedTimeRange,
  setViewMode,
  toggleCompareMode,
  setFirstArchiveForCompare,
  setSecondArchiveForCompare,
  resetCompareMode,
  resetFilters
} = archiveAppSlice.actions;

export const {
  selectSearchText,
  selectSelectedEntityType,
  selectSelectedArchiveType,
  selectSelectedTimeRange,
  selectViewMode,
  selectCompareMode,
  selectFilters
} = injectedSlice.selectors;

const archiveSearchReducer = archiveAppSlice.reducer;
export default archiveSearchReducer;