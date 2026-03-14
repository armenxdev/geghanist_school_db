import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {authApi} from "../../api/auth.api.js";

export const checkAuthThunk = createAsyncThunk(
    'auth/check',
    async (_, { rejectWithValue }) => {
        try {
            return await authApi.me();
        } catch (err) {
            return rejectWithValue(null);
        }
    }
);

export const loginThunk = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            return await authApi.login(email, password);
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || 'Սխալ տեղի ունեցավ փորձեք մի փոքր ուշ'
            );
        }
    }
);

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            return await authApi.logout();
        } catch (err) {
            return rejectWithValue(err.response?.data?.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        admin:   null,
        loading: false,
        error:   null,
        authChecked: false,
    },
    reducers: {
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuthThunk.pending, (state) => {
                state.authChecked = false;
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.admin       = action.payload.data;
                state.authChecked = true;
            })
            .addCase(checkAuthThunk.rejected, (state) => {
                state.admin       = null;
                state.authChecked = true;
            })

            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.admin   = action.payload.data;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
            })

            .addCase(logoutThunk.fulfilled, (state) => {
                state.admin = null;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
