# 🎨 Cấu Trúc Giao Diện (UI Structure)  
## Blog Management System (Clean Blog)

---

# 1. Tổng Quan

Frontend là SPA (ReactJS). UI được thiết kế bám sát tài liệu API `04-api-design.md` với các nguyên tắc:

- Base URL API: `/api/v1`
- Chuẩn phản hồi (tối thiểu):

```
{
  code: Int,
  message: String,
  data: Array || Object || null
}
```

- Các route cần xác thực gửi JWT qua header:

```
Authorization: Bearer <token>
```

Tech stack UI đề xuất (giữ như hiện tại):
- React Router (routing)
- Axios (HTTP client)
- Ant Design (UI kit)

---

# 2. Phân Nhóm Trang (Pages)

## 2.1. Public Pages (không cần đăng nhập)

- `/login`
- `/register`
- `/posts` (danh sách bài viết)
- `/posts/:id` (chi tiết bài viết)

## 2.2. Protected Pages (cần đăng nhập)

- `/dashboard`
- `/profile` (thông tin cá nhân)
- `/posts/create` (tạo bài viết)
- `/posts/edit/:id` (sửa bài viết)

## 2.3. Admin Pages (cần đăng nhập + quyền Admin)

Nhóm trang này được map theo các API quản trị trong `04-api-design.md`:

- **Users**
  - `/admin/users` (danh sách + tìm kiếm)
  - `/admin/users/:id/edit` (cập nhật user)
- **Categories**
  - `/admin/categories` (danh sách + CRUD)
- **Roles**
  - `/admin/roles` (danh sách + CRUD)
- **Settings**
  - `/admin/settings` (xem + cập nhật cấu hình hệ thống)

---

# 3. Layout Structure

## 3.1. `AuthLayout`

Áp dụng cho:
- `/login`
- `/register`

Gợi ý cấu trúc:

AuthLayout
 └── AuthCard (LoginForm | RegisterForm)

## 3.2. `MainLayout`

Áp dụng cho toàn bộ phần còn lại (public + protected + admin).

Gợi ý cấu trúc:

MainLayout
 ├── Header (user menu, logout)
 ├── Sidebar (menu theo role/permissions)
 └── Content (Outlet)

---

# 4. Cấu Trúc Thư Mục Theo Tính Năng (Feature-based)

Gợi ý tổ chức (tên thư mục có thể điều chỉnh theo codebase, nhưng nên giữ nhóm theo feature):

```
src/
  pages/
    auth/
      LoginPage
      RegisterPage
    posts/
      PostListPage
      PostDetailPage
      PostCreatePage
      PostEditPage
    profile/
      ProfilePage
    admin/
      users/
        AdminUserListPage
        AdminUserEditPage
      categories/
        AdminCategoryPage
      roles/
        AdminRolePage
      settings/
        AdminSettingsPage

  components/
    auth/
      LoginForm
      RegisterForm
    posts/
      PostCard
      PostForm
      PostSearchBar
      PostSort
      PaginationBar
    profile/
      ProfileInfo
      ChangePasswordForm
    admin/
      users/
        UserTable
        UserEditForm
      categories/
        CategoryTable
        CategoryForm
      roles/
        RoleTable
        RoleForm
        PermissionPicker
      settings/
        SettingsForm

  services/
    httpClient.(js|ts)
    auth.service.(js|ts)
    user.service.(js|ts)
    post.service.(js|ts)
    category.service.(js|ts)
    role.service.(js|ts)
    settings.service.(js|ts)

  routes/
    index.(js|ts)
    guards.(js|ts)   // Protected/Admin route guards
```

---

# 5. Routing Design (UI Routes ↔ API Mapping)

## 5.1. Authentication

- **Login Page**: `/login`
  - API: `POST /api/v1/auth/login`
  - Success: lưu `token` và điều hướng về `/dashboard` (hoặc quay lại trang trước đó)

- **Register Page**: `/register`
  - API: `POST /api/v1/auth/register`
  - Success: điều hướng sang `/login`

## 5.2. Posts (Public + Protected)

- **Post List Page**: `/posts`
  - API: `GET /api/v1/posts`
  - Query params hỗ trợ UI:
    - `keyword` (search theo title)
    - `categoryId`
    - `sortKey` (`title`, `createdAt`)
    - `sortValue` (`asc`, `desc`)
    - `page`, `limit`
  - Response có `pagination` → UI hiển thị phân trang chuẩn (currentPage/totalPages/totalItems)

- **Post Detail Page**: `/posts/:id`
  - API: `GET /api/v1/posts/detail/:id`
  - UI hiển thị thêm thông tin `user.username` và `category.title` (backend populate theo tài liệu API)

- **Create Post Page**: `/posts/create` (protected)
  - API: `POST /api/v1/posts/create`
  - UI fields: `title`, `content`, `thumbnail`, `categoryId`
  - Backend tự set: `userId`, `status`, `deleted=false` → UI không cần gửi các field này

- **Edit Post Page**: `/posts/edit/:id` (protected)
  - API: `PATCH /api/v1/posts/edit/:id`
  - Quyền:
    - User thường: chỉ sửa bài của mình
    - Admin: sửa mọi bài (có thể cập nhật thêm `status` nếu backend cho phép)

- **Delete Post Action**: (trên list/detail, protected)
  - API: `DELETE /api/v1/posts/delete/:id` (soft delete)
  - UI: xác nhận xóa, xóa xong refresh list hoặc điều hướng về list

## 5.3. Profile (Protected)

- **Profile Page**: `/profile`
  - API lấy info: `GET /api/v1/users/info`
  - API đổi mật khẩu: `PATCH /api/v1/users/change-password`

## 5.4. Admin (Users, Categories, Roles, Settings)

- **Admin Users**: `/admin/users`
  - API: `GET /api/v1/users` (Admin)
  - Query param: `keyword` (search username/email)
  - Response có `pagination` → UI table + paging

- **Admin Edit User**: `/admin/users/:id/edit`
  - API: `PATCH /api/v1/users/edit/:id`
  - UI:
    - User self-edit: `username`, `avatar`
    - Admin: thêm `roleId`, `status`

- **Admin Categories**: `/admin/categories`
  - API:
    - `GET /api/v1/categories`
    - `POST /api/v1/categories`
    - `PATCH /api/v1/categories/:id`
    - `DELETE /api/v1/categories/:id` (soft delete)

- **Admin Roles**: `/admin/roles`
  - API:
    - `GET /api/v1/roles`
    - `POST /api/v1/roles`
    - `PATCH /api/v1/roles/:id`
    - `DELETE /api/v1/roles/:id`
  - UI: quản lý `permissions` (multi-select)

- **Admin Settings**: `/admin/settings`
  - API:
    - `GET /api/v1/settings`
    - `PATCH /api/v1/settings` (key/value)

---

# 6. State & Data Strategy

- **Auth token**: lưu ở `localStorage` (hoặc `sessionStorage` nếu cần “đăng nhập theo phiên”).
- **Current user**: lưu trong Context (hoặc React Query/SWR nếu dự án có dùng).
- **HTTP client**:
  - 1 instance Axios dùng `baseURL=/api/v1`
  - Interceptor tự gắn `Authorization` nếu có token
  - Chuẩn hoá xử lý lỗi theo status code: 400/401/403/404/500
- **Pagination**: lấy từ `response.pagination` (áp dụng cho `/posts`, `/users`).

---

# 7. Quy Tắc Thiết Kế UI (bám theo API design)

- Không gọi API trực tiếp trong component trình bày; gọi qua `services/` hoặc layer `api/`.
- Route/UI có thể “thân thiện” hơn, nhưng **API mapping phải đúng endpoint** (đặc biệt: `posts/create`, `posts/edit/:id`, `posts/delete/:id`).
- Guard theo auth/role:
  - 401 → điều hướng `/login`
  - 403 → hiển thị trang “Không có quyền” (hoặc message và quay lại)
- Tận dụng `pagination` từ backend thay vì tự tính.

---

# 8. Luồng UI Chính (Happy Path)

## 8.1. Đăng nhập

Login form → `POST /api/v1/auth/login` → nhận `{ token }` → lưu token → điều hướng `/dashboard`.

## 8.2. Xem danh sách bài viết + lọc/sort/phân trang

Mở `/posts` → `GET /api/v1/posts?keyword=&categoryId=&sortKey=&sortValue=&page=&limit=` → render list + pagination.

## 8.3. Tạo bài viết

Mở `/posts/create` → nhập dữ liệu → `POST /api/v1/posts/create` → success → điều hướng `/posts` và refresh.

## 8.4. Quản trị (Admin)

Admin vào `/admin/*` → gọi các API tương ứng (`/users`, `/categories`, `/roles`, `/settings`) → CRUD theo quyền.

---

# 9. Tiêu Chí Hoàn Thành

UI được xem là hoàn chỉnh khi:

- Tất cả route trong mục 2 hoạt động đúng (public/protected/admin)
- Mapping UI ↔ API đúng 100% theo `04-api-design.md`
- Guard 401/403 hoạt động đúng
- List có phân trang dựa vào `pagination` từ backend
- Các màn hình Admin (Users/Categories/Roles/Settings) đầy đủ theo API

---

Tác giả: Lê Quang Tuyến  
Phiên bản: 1.1  
Trạng thái: Cập nhật theo API Design v1.1