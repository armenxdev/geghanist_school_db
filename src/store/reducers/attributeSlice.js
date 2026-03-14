import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import {schoolApi} from "../../api/attribute.api.js";

const initialState = {
  data: [],
  loading: false,
  actionLoading: false,
  error: null,
};

const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Unexpected error';

// ─────────────────────────────────────────────────────────
// Thunks
// ─────────────────────────────────────────────────────────

export const fetchAttributes = createAsyncThunk(
    'school/fetchAttributes',
    async (_, { rejectWithValue }) => {
      try {
        const data = await schoolApi.fetchAttributes();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        return rejectWithValue(getErrorMessage(err));
      }
    }
);

export const addAttribute = createAsyncThunk(
    'school/addAttribute',
    async (payload, { rejectWithValue }) => {
      try {
        const data = await schoolApi.addAttribute(payload);
        return data;
      } catch (err) {
        return rejectWithValue(getErrorMessage(err));
      }
    }
);

export const updateAttribute = createAsyncThunk(
    'school/updateAttribute',
    async ({ id, ...payload }, { rejectWithValue }) => {
      try {
        const data = await schoolApi.updateAttribute(id, payload);
        return data;
      } catch (err) {
        return rejectWithValue(getErrorMessage(err));
      }
    }
);

export const deleteAttribute = createAsyncThunk(
    'school/deleteAttribute',
    async (id, { rejectWithValue }) => {
      try {
        await schoolApi.deleteAttribute(id);
        return id;
      } catch (err) {
        return rejectWithValue(getErrorMessage(err));
      }
    }
);

// ─────────────────────────────────────────────────────────
// Slice
// ─────────────────────────────────────────────────────────

const attributeSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
        // Fetch
        .addCase(fetchAttributes.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAttributes.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchAttributes.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          toast.error(action.payload);
        })

        // Add
        .addCase(addAttribute.pending, (state) => {
          state.actionLoading = true;
          state.error = null;
        })
        .addCase(addAttribute.fulfilled, (state, action) => {
          state.actionLoading = false;
          state.data.unshift(action.payload);
          toast.success('Attribute added');
        })
        .addCase(addAttribute.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
          toast.error(action.payload);
        })

        // Update
        .addCase(updateAttribute.pending, (state) => {
          state.actionLoading = true;
          state.error = null;
        })
        .addCase(updateAttribute.fulfilled, (state, action) => {
          state.actionLoading = false;
          const idx = state.data.findIndex((x) => String(x.id) === String(action.payload.id));
          if (idx !== -1) state.data[idx] = action.payload;
          toast.success('Attribute updated');
        })
        .addCase(updateAttribute.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
          toast.error(action.payload);
        })

        // Delete (optimistic)
        .addCase(deleteAttribute.pending, (state, action) => {
          state.actionLoading = true;
          state.error = null;
          // Remove immediately for optimistic UI
          const id = action.meta.arg;
          state.data = state.data.filter((x) => String(x.id) !== String(id));
        })
        .addCase(deleteAttribute.fulfilled, (state) => {
          state.actionLoading = false;
          const msg = 'Attribute deleted';
          state.successMessage = msg;
          toast.success(msg);
        })
        .addCase(deleteAttribute.rejected, (state, action) => {
          state.actionLoading = false;
          state.error = action.payload;
          toast.error(action.payload);
        });
  },
});

export const { clearError } = attributeSlice.actions;
export default attributeSlice.reducer;
