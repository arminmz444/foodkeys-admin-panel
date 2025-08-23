// src/app/excel-templates/store/templatesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { rootReducer } from 'app/store/lazyLoadedSlices';
import * as excelTemplateService from '../services/excelTemplateService';

// Async thunks
export const fetchTemplates = createAsyncThunk(
  'excelTemplates/templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await excelTemplateService.getAllTemplates();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getTemplateById = createAsyncThunk(
  'excelTemplates/templates/getTemplateById',
  async (id, { rejectWithValue }) => {
    try {
      return await excelTemplateService.getTemplateById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTemplate = createAsyncThunk(
  'excelTemplates/templates/addTemplate',
  async ({ file, data }, { rejectWithValue }) => {
    try {
      return await excelTemplateService.uploadTemplate(file, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTemplateInfo = createAsyncThunk(
  'excelTemplates/templates/updateTemplate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await excelTemplateService.updateTemplate(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeTemplate = createAsyncThunk(
  'excelTemplates/templates/removeTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await excelTemplateService.deleteTemplate(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateExcelFromTemplate = createAsyncThunk(
  'excelTemplates/templates/generateExcel',
  async ({ templateId, data }, { rejectWithValue }) => {
    try {
      const blob = await excelTemplateService.generateExcel(templateId, data);
      return { templateId, blob };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  templates: [],
  loading: false,
  generating: false,
  error: null,
  currentTemplate: null,
  generatedFile: null
};

// Slice definition
export const templatesSlice = createSlice({
  name: 'excelTemplates/templates',
  initialState,
  reducers: {
    // Synchronous reducers
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearGeneratedFile: (state) => {
      state.generatedFile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch templates';
      })
      
      // Get template by ID
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
        
        // Update the template in the list if it exists
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch template';
      })
      
      // Add template
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add template';
      })
      
      // Update template
      .addCase(updateTemplateInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplateInfo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.currentTemplate?.id === action.payload.id) {
          state.currentTemplate = action.payload;
        }
      })
      .addCase(updateTemplateInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update template';
      })
      
      // Remove template
      .addCase(removeTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(t => t.id !== action.payload);
        if (state.currentTemplate?.id === action.payload) {
          state.currentTemplate = null;
        }
      })
      .addCase(removeTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete template';
      })
      
      // Generate Excel
      .addCase(generateExcelFromTemplate.pending, (state) => {
        state.generating = true;
        state.error = null;
        state.generatedFile = null;
      })
      .addCase(generateExcelFromTemplate.fulfilled, (state, action) => {
        state.generating = false;
        state.generatedFile = {
          templateId: action.payload.templateId,
          blob: action.payload.blob
        };
      })
      .addCase(generateExcelFromTemplate.rejected, (state, action) => {
        state.generating = false;
        state.error = action.payload || 'Failed to generate Excel file';
      })
  },
  selectors: {
    selectTemplates: (state) => state.templates,
    selectCurrentTemplate: (state) => state.currentTemplate,
    selectLoading: (state) => state.loading,
    selectGenerating: (state) => state.generating,
    selectError: (state) => state.error,
    selectGeneratedFile: (state) => state.generatedFile
  }
});

/**
 * Lazy load
 * */
rootReducer.inject(templatesSlice);
const injectedSlice = templatesSlice.injectInto(rootReducer);

export const { 
  setCurrentTemplate, 
  clearCurrentTemplate, 
  clearError,
  clearGeneratedFile
} = templatesSlice.actions;

export const { 
  selectTemplates, 
  selectCurrentTemplate, 
  selectLoading, 
  selectGenerating, 
  selectError,
  selectGeneratedFile
} = injectedSlice.selectors;

export default templatesSlice.reducer;