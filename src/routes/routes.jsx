import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login.jsx';
import About from '../pages/About';
import Announcements from '../pages/Announcements';
import Staff from '../pages/Staff';
import Contact from '../pages/Contact';
import ProtectedRoute from './ProtectedRoute.jsx';
import NotFound from '../pages/NotFound';
import AdminLayout from "../admin/Layout.jsx";
import AdminDashboard from "../admin/pages/Dashboard.jsx";
import AdminStaff from "../admin/pages/Staff.jsx";
import AdminProfile from "../admin/components/Profile/ProfileDropdown.jsx";
import AdminDocuments from "../admin/pages/AdminDocuments.jsx";
import AdminAbout from "../admin/pages/AdminAbout.jsx";
import Documents from "../pages/Documents.jsx";
import Posts from "../pages/Posts.jsx";
import PostDetail from '../pages/PostDetail.jsx';
import Publications from "../admin/pages/Publications.jsx";
import CreatePostPage from "../admin/pages/CreatePost.jsx";
import EditPostPage from "../admin/pages/EditPostPage.jsx";

export const routes = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about"         element={<About />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="posts"         element={<Posts />} />
                <Route path="posts/:id"     element={<PostDetail />} />
                <Route path="staff"         element={<Staff />} />
                <Route path="documents"     element={<Documents />} />
                <Route path="contact"       element={<Contact />} />
            </Route>

            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index              element={<AdminDashboard />} />
                    <Route path="dashboard"   element={<AdminDashboard />} />
                    <Route path="staff"       element={<AdminStaff />} />
                    <Route path="profile"     element={<AdminProfile />} />
                    <Route path="about"       element={<AdminAbout />} />
                    <Route path="documents"   element={<AdminDocuments />} />
                    <Route path="posts"       element={<Publications />} />
                    <Route path="posts/new"   element={<CreatePostPage />} />
                    <Route path="posts/:id/edit" element={<EditPostPage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </>
    )
);

export default routes;