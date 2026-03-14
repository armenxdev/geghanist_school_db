import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
    createPost,
    clearCreateError,
    clearLastCreated,
    selectCreating,
    selectCreateError,
    selectLastCreated,
} from "../../store/reducers/postSlice.js";
import PostForm from "../components/PostForm.jsx";

const CreatePostPage = () => {
    const dispatch    = useDispatch();
    const navigate    = useNavigate();
    const creating    = useSelector(selectCreating);
    const createError = useSelector(selectCreateError);
    const lastCreated = useSelector(selectLastCreated);

    useEffect(() => {
        if (lastCreated) {
            dispatch(clearLastCreated());
            navigate("/admin/posts");
        }
    }, [lastCreated, dispatch, navigate]);

    useEffect(() => {
        return () => { dispatch(clearCreateError()); };
    }, [dispatch]);

    const handleSubmit = (payload) => {
        dispatch(createPost(payload));
    };

    return (
        <div className="page">
            <div className="page-header">
                <div className="page-header__left">
                    <Link to="/admin/posts" className="back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="15,18 9,12 15,6"/>
                        </svg>
                        Վերադառնալ
                    </Link>
                    <h1 className="page-title">Նոր հրապարակում</h1>
                </div>
            </div>

            <PostForm
                onSubmit={handleSubmit}
                isSubmitting={creating}
                submitError={createError}
            />
        </div>
    );
};

export default CreatePostPage;