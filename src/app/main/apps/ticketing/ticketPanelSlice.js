import { createSlice } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';

const initialState = {
  selectedTicketId: '',
  open: false
};

export const ticketPanelSlice = createSlice({
  name: 'ticketPanel',
  initialState,
  reducers: {
    setSelectedTicketId: (state, action) => {
      state.selectedTicketId = action.payload;
    },
    removeSelectedTicketId: (state) => {
      state.selectedTicketId = '';
    },
    toggleTicketPanel: (state) => {
      state.open = !state.open;
    },
    openTicketPanel: (state) => {
      state.open = true;
    },
    closeTicketPanel: (state) => {
      state.open = false;
    }
  },
  selectors: {
    selectSelectedTicketId: (state) => state.selectedTicketId,
    selectTicketPanelOpen: (state) => state.open
  }
});

// Lazy load
rootReducer.inject(ticketPanelSlice);
const injectedSlice = ticketPanelSlice.injectInto(rootReducer);

export const { setSelectedTicketId, openTicketPanel, toggleTicketPanel, removeSelectedTicketId, closeTicketPanel } =
  ticketPanelSlice.actions;
export const { selectSelectedTicketId, selectTicketPanelOpen } = injectedSlice.selectors;
export default ticketPanelSlice.reducer;