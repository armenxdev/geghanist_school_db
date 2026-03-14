import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { postsApi } from "../../api/posts.api.js";


export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (params = {}, { rejectWithValue }) => {
        try {
            const data = await postsApi.fetchPosts(params);
            return data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Հրապարակումները բեռնելը ձախողվեց"
            );
        }
    }
);

export const createPost = createAsyncThunk(
    "posts/createPost",
    async (postData, { rejectWithValue }) => {
        try {
            const data = await postsApi.createPost(postData);
            return data.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message ||
                err.response?.data?.errors?.join(", ") ||
                "Հրապարակումը ստեղծելը ձախողվեց"
            );
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async (id, { rejectWithValue }) => {
        try {
            return await postsApi.deletePost(id);
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Հրապարակումը ջնջելը ձախողվեց"
            );
        }
    }
);



const postsSlice = createSlice({
    name: "posts",
    initialState: {
        items:        [],
        activeFilter: "",
        loading:      false,
        creating:     false,
        deleting:     null,
        error:        null,
        createError:  null,
        deleteError:  null,
        lastCreated:  null,
    },
    reducers: {
        setActiveFilter(state, action) {
            state.activeFilter = action.payload;
        },
        clearCreateError(state) {
            state.createError = null;
        },
        clearDeleteError(state) {
            state.deleteError = null;
        },
        clearLastCreated(state) {
            state.lastCreated = null;
        },
    },
    extraReducers: (builder) => {


        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.items   = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload;
                toast.error(action.payload);
            });


        builder
            .addCase(createPost.pending, (state) => {
                state.creating    = true;
                state.createError = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.creating   = false;
                state.lastCreated = action.payload;
                state.items.unshift(action.payload);
                toast.success("✅ Հրապարակումը հաջողությամբ ստեղծվեց");
            })
            .addCase(createPost.rejected, (state, action) => {
                state.creating    = false;
                state.createError = action.payload;
                toast.error(`❌ ${action.payload}`);
            });

        builder
            .addCase(deletePost.pending, (state, action) => {
                state.deleting    = action.meta.arg;
                state.deleteError = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.deleting = null;
                state.items    = state.items.filter((p) => p.id !== action.payload);
                toast.success("🗑️ Հրապարակումը հաջողությամբ ջնջվեց");
            })
            .addCase(deletePost.rejected, (state, action) => {
                state.deleting    = null;
                state.deleteError = action.payload;
                toast.error(`❌ ${action.payload}`);
            });
    },
});

export const {
    setActiveFilter,
    clearCreateError,
    clearDeleteError,
    clearLastCreated,
} = postsSlice.actions;


export const selectAllPosts     = (s) => s.posts.items;
export const selectPostsLoading = (s) => s.posts.loading;
export const selectPostsError   = (s) => s.posts.error;
export const selectCreating     = (s) => s.posts.creating;
export const selectCreateError  = (s) => s.posts.createError;
export const selectDeleting     = (s) => s.posts.deleting;
export const selectDeleteError  = (s) => s.posts.deleteError;
export const selectActiveFilter = (s) => s.posts.activeFilter;
export const selectLastCreated  = (s) => s.posts.lastCreated;

export default postsSlice.reducer;