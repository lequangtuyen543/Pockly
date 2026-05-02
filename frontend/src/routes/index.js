import PrivateRoutes from "../components/PrivateRoutes/index.js";
import { LayoutAdmin } from "../layout/admin/index.js";
import { LayoutClient } from "../layout/client";
import { Home } from "../pages/client/Home";
import { Login } from "../pages/auth/login.js";
import { Logout } from "../pages/auth/logout.js";
import { Register } from "../pages/auth/register.js";
import { Dashboard } from "../pages/admin/Dashboard";
import { Posts } from "../pages/client/Posts/index.js";
import { PostDetail } from "../pages/client/Posts/detail.js";
import { About } from "../pages/client/About/index.js";
import { Contact } from "../pages/client/Contact/index.js";


import { BlogList } from "../pages/admin/Blogs/index.js";
import { CreateBlog } from "../pages/admin/Blogs/create.js";
import { DetailBlog } from "../pages/admin/Blogs/detail.js";
import NotFound from "../pages/client/NotFound/index.js";
import { UserList } from "../pages/admin/Users/index.js";
import { UserProfile } from "../pages/admin/User/Profile.jsx";
import { LayoutAuth } from "../layout/auth/index.js";
import { RolesIndex } from "../pages/admin/Roles/index.js";

import { UserPreferences } from "../pages/admin/User/Preferences.jsx";

import { CategoryList } from "../pages/admin/Categories/index.js";
import { SettingsPage } from "../pages/admin/Settings/index.js";

export const routes = [
  // 1. Public Layout (Dành cho khách)
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      { index: true, element: <Home /> },
      { path: "posts", element: <Posts /> },
      { path: "posts/:id", element: <PostDetail /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },

      { path: "*", element: <NotFound /> },
    ],
  },

  // 2. Auth Layout (Login/Register)
  {
    path: "/",
    element: <LayoutAuth />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },
    ],
  },

  // 3. Admin Layout (Protected - Cần đăng nhập)
  {
    path: "/admin",
    element: <PrivateRoutes />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          
          // Quản lý Bài viết (Posts - đổi từ Blogs để đồng bộ API)
          { path: "posts", element: <BlogList /> },
          { path: "posts/create", element: <CreateBlog /> },
          { path: "posts/edit/:id", element: <DetailBlog /> },
          
          // Quản lý Người dùng (Users)
          { path: "users", element: <UserList /> },

          
          // Quản lý Vai trò (Roles)
          { path: "roles", element: <RolesIndex /> },


          // Thông tin cá nhân
          { path: "profile", element: <UserProfile /> },
          { path: "preferences", element: <UserPreferences /> },

          // Quản lý Danh mục & Cài đặt
          { path: "categories", element: <CategoryList /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
];

