import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { documentApi } from '../../api/document.api.js';

const LIMIT = 15;


const getErrorMessage = (err) =>
    err?.response?.data?.message || err?.message || 'Unexpected error';

const normalizeReport = (item) => ({
    ...item,
    createdAt: item.createdAt || item.created_at || null,
    filePath:  item.filePath  || item.file_path  || null,
});



export const fetchReports = createAsyncThunk(
    'reports/fetchReports',
    async ({ page = 1, search = '', orderBy = '', type = '' }, { rejectWithValue }) => {
        try {
            const params = { limit: LIMIT, page };
            if (search)  params.search  = search;
            if (orderBy) params.orderBy = orderBy;
            if (type)    params.type    = type;

            const data = await documentApi.fetchReports({ page, search, orderBy, type });
            return { data, page };
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const createReport = createAsyncThunk(
    'reports/createReport',
    async ({ title, file, type }, { rejectWithValue }) => {
        try {
            const fd = new FormData();
            fd.append('title', title.trim());
            fd.append('file', file);
            fd.append('type', type);

            const { data } = documentApi.createReport({ title, file, type });
            return data.report ?? data;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);

export const deleteReport = createAsyncThunk(
    'reports/deleteReport',
    async (id, { rejectWithValue }) => {
        try {
            await documentApi.deleteReport(id);
            return id;
        } catch (err) {
            return rejectWithValue(getErrorMessage(err));
        }
    }
);



const documentsSlice = createSlice({
    name: 'reports',
    initialState: {
        reportList:    [],
        total:         0,
        page:          1,
        hasMore:       false,
        search:        '',
        orderBy:       '',

        fetchLoading:  false,
        createLoading: false,
        deleteLoading: false,

        createSuccess: false,
        error:         null,
    },
    reducers: {
        setSearch(state, { payload }) {
            state.search = payload;
        },
        setOrderBy(state, { payload }) {
            state.orderBy = payload;
        },
        resetCreateSuccess(state) {
            state.createSuccess = false;
            state.error         = null;
        },
        resetReports(state) {
            state.reportList = [];
            state.page       = 1;
            state.hasMore    = false;
            state.total      = 0;
            state.error      = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.fetchLoading = true;
                state.error        = null;
            })
            .addCase(fetchReports.fulfilled, (state, { payload }) => {
                state.fetchLoading = false;
                const { data, page } = payload;

                const raw   = Array.isArray(data) ? data : (data.rows ?? []);
                const list  = raw.map(normalizeReport);   // ← normalize
                const count = data.count ?? list.length;

                state.reportList = page > 1 ? [...state.reportList, ...list] : list;
                state.total      = count;
                state.page       = page;
                state.hasMore    = page * LIMIT < count;
            })
            .addCase(fetchReports.rejected, (state, { payload }) => {
                state.fetchLoading = false;
                state.error        = payload;
                toast.error(payload);
            })

            .addCase(createReport.pending, (state) => {
                state.createLoading = true;
                state.createSuccess = false;
                state.error         = null;
            })
            .addCase(createReport.fulfilled, (state) => {
                state.createLoading = false;
                state.createSuccess = true;
                toast.success('Հաշվետվությունը հաջողությամբ ավելացվեց');
            })
            .addCase(createReport.rejected, (state, { payload }) => {
                state.createLoading = false;
                state.error         = payload;
                toast.error(payload);
            })

            .addCase(deleteReport.pending, (state, { meta }) => {
                state.deleteLoading = true;
                state.error         = null;
                const id = meta.arg;
                state.reportList = state.reportList.filter(
                    (r) => String(r.id) !== String(id)
                );
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(deleteReport.fulfilled, (state) => {
                state.deleteLoading = false;
                toast.success('Հաշվետվությունը հաջողությամբ ջնջվեց');
            })
            .addCase(deleteReport.rejected, (state, { payload }) => {
                state.deleteLoading = false;
                state.error         = payload;
                toast.error(payload);
            });
    },
});

export const { setSearch, setOrderBy, resetCreateSuccess, resetReports } =
    documentsSlice.actions;

export const selectReports       = (s) => s.reportsSlice.reportList;
export const selectTotal         = (s) => s.reportsSlice.total;
export const selectHasMore       = (s) => s.reportsSlice.hasMore;
export const selectPage          = (s) => s.reportsSlice.page;
export const selectSearch        = (s) => s.reportsSlice.search;
export const selectOrderBy       = (s) => s.reportsSlice.orderBy;
export const selectFetchLoading  = (s) => s.reportsSlice.fetchLoading;
export const selectCreateLoading = (s) => s.reportsSlice.createLoading;
export const selectDeleteLoading = (s) => s.reportsSlice.deleteLoading;
export const selectCreateSuccess = (s) => s.reportsSlice.createSuccess;
export const selectReportError   = (s) => s.reportsSlice.error;

export default documentsSlice.reducer;