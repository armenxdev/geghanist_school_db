import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { staffApi } from '../../api/staff.api.js';

const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Unexpected error';

export const fetchStaff = createAsyncThunk(
    'staff/fetchStaff',
    async ({ page, limit }, { rejectWithValue }) => {
        try {
            return await staffApi.fetchStaff({ page, limit });
        } catch (err) { return rejectWithValue(getErrorMessage(err)); }
    }
);

export const createEmployee = createAsyncThunk(
    'staff/createEmployee',
    async ({ fullName, role }, { rejectWithValue }) => {
        try {
            return await staffApi.createEmployee({ fullName, role });
        } catch (err) { return rejectWithValue(getErrorMessage(err)); }
    }
);

export const updateEmployee = createAsyncThunk(
    'staff/updateEmployee',
    async ({ id, fullName, role }, { rejectWithValue }) => {
        try {
            return await staffApi.updateEmployee(id, { fullName, role });
        } catch (err) { return rejectWithValue(getErrorMessage(err)); }
    }
);

export const deleteEmployee = createAsyncThunk(
    'staff/deleteEmployee',
    async (id, { rejectWithValue }) => {
        try {
            return await staffApi.deleteEmployee(id);
        } catch (err) { return rejectWithValue(getErrorMessage(err)); }
    }
);


const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        staffList: [],
        loading:   false,
        error:     null,
        page:      1,
        limit:     10,
        hasMore:   true,
        total:     0,
    },
    reducers: {
        resetStaff: (state) => {
            state.staffList = [];
            state.page      = 1;
            state.hasMore   = true;
            state.error     = null;
            state.total     = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaff.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.loading   = false;
                const { data, pagination } = action.payload;
                state.staffList = [...state.staffList, ...data];
                state.hasMore   = pagination.hasMore;
                state.total     = pagination.total;
                state.page     += 1;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
                toast.error(action.payload);
            })


            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.staffList.push(action.payload.data);
                state.total  += 1;
                toast.success('Աշխատակիցը հաջողությամբ ավելացվեց');
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
                toast.error(action.payload);
            })

            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading   = false;
                const updated   = action.payload.data;
                state.staffList = state.staffList.map(s =>
                    String(s.id) === String(updated.id) ? updated : s
                );
                toast.success('Աշխատակիցը հաջողությամբ թարմացվեց');
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
                toast.error(action.payload);
            })

            .addCase(deleteEmployee.pending, (state, action) => {
                state.loading   = true;
                state.error     = null;
                const id = action.meta.arg;
                state.staffList = state.staffList.filter(
                    s => String(s.id) !== String(id)
                );
                state.total -= 1;
            })
            .addCase(deleteEmployee.fulfilled, (state) => {
                state.loading = false;
                toast.success('Աշխատակիցը հաջողությամբ ջնջվեց');
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
                toast.error(action.payload);
            });
    },
});

export const { resetStaff } = staffSlice.actions;
export default staffSlice.reducer;