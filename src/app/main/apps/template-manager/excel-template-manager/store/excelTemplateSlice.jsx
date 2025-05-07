// src/store/slices/excelTemplateSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as excelTemplateService from '../../services/excelTemplateService';

// Async thunks for API calls
export const fetchTemplates = createAsyncThunk(
  'excelTemplate/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      return await excelTemplateService.getAllTemplates();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addTemplate = createAsyncThunk(
  'excelTemplate/addTemplate',
  async ({ file, data }, { rejectWithValue }) => {
    try {
      return await excelTemplateService.uploadTemplate(file, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateTemplateInfo = createAsyncThunk(
  'excelTemplate/updateTemplate',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await excelTemplateService.updateTemplate(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeTemplate = createAsyncThunk(
  'excelTemplate/removeTemplate',
  async (id, { rejectWithValue }) => {
    try {
      await excelTemplateService.deleteTemplate(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const downloadTemplateFile = createAsyncThunk(
  'excelTemplate/downloadTemplate',
  async (id, { rejectWithValue }) => {
    try {
      const blob = await excelTemplateService.downloadTemplate(id);
      return { id, blob };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const generateExcelFromTemplate = createAsyncThunk(
  'excelTemplate/generateExcel',
  async ({ templateId, data }, { rejectWithValue }) => {
    try {
      const blob = await excelTemplateService.generateExcel(templateId, data);
      return { templateId, blob };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice definition
const excelTemplateSlice = createSlice({
  name: 'excelTemplate',
  initialState: {
    templates: [],
    loading: false,
    generating: false,
    error: null,
    currentTemplate: null,
    generatedFile: null
  },
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
      
      // Download template
      .addCase(downloadTemplateFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(downloadTemplateFile.fulfilled, (state) => {
        state.loading = false;
        // We don't update state for downloads as they're handled by the browser
      })
      .addCase(downloadTemplateFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to download template';
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
      });
  }
});

export const { 
  setCurrentTemplate, 
  clearCurrentTemplate, 
  clearError,
  clearGeneratedFile
} = excelTemplateSlice.actions;

export default excelTemplateSlice.reducer;