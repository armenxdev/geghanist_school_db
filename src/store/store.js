import {configureStore} from '@reduxjs/toolkit';
import staffReducer from './reducers/staffSlice.js';
import authSlice from './reducers/authSlice.js';
import schoolReducer from './reducers/attributeSlice.js';
import reportSlice from "./reducers/documentsSlice.js";
import postsReducer from './reducers/postSlice.js';

export const store = configureStore({
    reducer: {
        staff: staffReducer,
        auth: authSlice,
        posts: postsReducer,
        school: schoolReducer,
        reportsSlice: reportSlice,
    },
});

export default store;
