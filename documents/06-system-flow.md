# 🔄 System Flow  
## Blog Management System (Clean Blog)

---

# 1. Tổng Quan Luồng Hệ Thống

Hệ thống hoạt động theo mô hình:

Client (ReactJS SPA)
        ↓ (HTTP/JSON)
API Server (NodeJS + Express, REST `/api/v1`)
        ↓
Database (MongoDB qua Mongoose)

Chuẩn phản hồi API (tối thiểu):

```
{
  code: Int,
  message: String,
  data: Array || Object || null
}
```

Với các API list (ví dụ: `/posts`, `/users`) backend có thể trả thêm `pagination`:

```
{
  code: 200,
  message: "Success",
  data: [...],
  pagination: {
    currentPage,
    limitItems,
    totalItems,
    totalPages
  }
}
```

Tất cả request protected/admin đều đi qua:
- Authentication middleware (JWT)
- Authorization middleware (role/permission)
- Controller
- Service/Model (Mongoose)

---

# 2. Authentication Flow (Register/Login/JWT)

## 2.1. Đăng ký (Public)

UI route: `/register`

Flow:

Client
→ `POST /api/v1/auth/register` (username, email, password)
→ Server validate
→ Hash password (bcrypt)
→ Tạo user với:
  - `roleId = defaultRoleUser`
  - `status = "active"`
  - `deleted = false`
→ Response `{ code: 200, message: "Đăng ký thành công", data: null }`
→ UI redirect `/login`

## 2.2. Đăng nhập (Public)

UI route: `/login`

Flow:

Client
→ `POST /api/v1/auth/login` (username hoặc email, password)
→ Server xác thực credentials
→ Tạo JWT token
→ Response `{ data: { token } }`

Client
→ Lưu token (localStorage)
→ Tất cả request sau đó gắn header:

```
Authorization: Bearer <token>
```

→ UI redirect `/dashboard`

## 2.3. Xác thực request (Protected/Admin)

Client
→ Gửi request kèm JWT header

Server
→ Verify JWT
→ Attach `req.user` (tối thiểu `id`, `roleId`/role)
→ Cho phép đi tiếp nếu hợp lệ, ngược lại trả 401

---

# 3. Authorization Flow (Role/Permission)

Theo API design:
- Có tầng **Admin-only** cho các API quản trị (ví dụ `GET /users`).
- Có tầng **owner-or-admin** cho các thao tác post edit/delete.

Các tình huống phổ biến:
- **401 Unauthorized**: không có token / token sai / token hết hạn
- **403 Forbidden**: có token nhưng không đủ quyền (không phải admin hoặc không phải chủ sở hữu)

UI xử lý:
- 401 → xoá token + redirect `/login`
- 403 → hiển thị “Không có quyền” và chặn thao tác

---

# 4. Public Content Flow (Posts)

## 4.1. Xem danh sách bài viết (Public)

UI route: `/posts`

Client
→ `GET /api/v1/posts?keyword=&categoryId=&sortKey=&sortValue=&page=&limit=`

Server
→ filter `{ deleted:false, status:"active" }`
→ áp dụng `keyword` (search theo title) nếu có
→ filter `categoryId` nếu có
→ sort + pagination
→ trả `data` + `pagination`

UI
→ render list + bộ lọc + phân trang dựa vào `pagination`

## 4.2. Xem chi tiết bài viết (Public)

UI route: `/posts/:id`

Client
→ `GET /api/v1/posts/detail/:id`

Server
→ `findById` + populate:
  - `userId` (username)
  - `categoryId` (title)
→ trả `data` chi tiết

---

# 5. Post Management Flow (Protected)

## 5.1. Tạo bài viết (Protected)

UI route: `/posts/create`

Client
→ `POST /api/v1/posts/create` (title, content, thumbnail, categoryId)

Server
→ Verify JWT
→ set:
  - `userId = req.user.id`
  - `status = "active"`
  - `deleted = false`
→ lưu post
→ trả response success

UI
→ redirect `/posts` và refresh list

## 5.2. Chỉnh sửa bài viết (Owner hoặc Admin)

UI route: `/posts/edit/:id`

Client
→ `PATCH /api/v1/posts/edit/:id`

Server
→ Verify JWT
→ kiểm tra quyền:
  - user là chủ bài viết hoặc admin → cho phép
  - ngược lại → 403
→ cập nhật các field cho phép (admin có thể cập nhật thêm `status` nếu backend hỗ trợ)

## 5.3. Xóa bài viết (Soft delete, Owner hoặc Admin)

UI action (từ list/detail)

Client
→ `DELETE /api/v1/posts/delete/:id`

Server
→ Verify JWT + check quyền
→ update `deleted = true`
→ trả success

---

# 6. Profile Flow (Protected)

## 6.1. Xem thông tin cá nhân

UI route: `/profile`

Client
→ `GET /api/v1/users/info`

Server
→ Verify JWT
→ trả thông tin user hiện tại

## 6.2. Đổi mật khẩu

Client
→ `PATCH /api/v1/users/change-password` (oldPassword, newPassword)

Server
→ Verify JWT
→ validate oldPassword
→ hash newPassword + update
→ trả success

---

# 7. Admin Flows (Protected + Admin)

## 7.1. Quản lý Users

UI route: `/admin/users`

Client (Admin)
→ `GET /api/v1/users?keyword=&page=&limit=`

Server
→ Verify JWT + Admin check
→ search theo `username` hoặc `email` + filter `deleted:false`
→ trả `data` + `pagination`

UI route: `/admin/users/:id/edit`

Client (Admin)
→ `PATCH /api/v1/users/edit/:id`

Server
→ Verify JWT + quyền (admin cập nhật `roleId`, `status`; user thường chỉ nên cập nhật thông tin của mình)

## 7.2. Quản lý Categories

UI route: `/admin/categories`

Client (Admin)
→ `GET /api/v1/categories`
→ `POST /api/v1/categories`
→ `PATCH /api/v1/categories/:id`
→ `DELETE /api/v1/categories/:id` (soft delete)

## 7.3. Quản lý Roles

UI route: `/admin/roles`

Client (Admin)
→ `GET /api/v1/roles`
→ `POST /api/v1/roles` (title, permissions[])
→ `PATCH /api/v1/roles/:id`
→ `DELETE /api/v1/roles/:id`

## 7.4. Quản lý Settings

UI route: `/admin/settings`

Client (Admin)
→ `GET /api/v1/settings`
→ `PATCH /api/v1/settings` (key, value)

---

# 8. Error Handling Flow (Client/Server)

Server:
- Controller/Service throw error
- Global error handler chuẩn hoá response:

```
{
  code: 400,
  message: "Error message",
  data: null
}
```

Client:
- Interceptor bắt lỗi theo status:
  - 400: hiển thị lỗi validate
  - 401: xoá token + redirect `/login`
  - 403: hiển thị “Không có quyền”
  - 404: hiển thị “Không tìm thấy”
  - 500: thông báo lỗi hệ thống

---

# 9. Logout Flow

Client:
→ Xoá token localStorage
→ Redirect `/login`

Server:
→ Không cần xử lý (JWT stateless)

---

# 10. Luồng Tổng Thể (Theo Nhóm Người Dùng)

## 10.1. Guest (Public)

1. Xem `/posts`
2. Xem `/posts/:id`
3. (Tuỳ chọn) đăng ký `/register`
4. đăng nhập `/login`

## 10.2. User (Protected)

1. Xem `/posts` / `/posts/:id`
2. Tạo bài viết `/posts/create`
3. Sửa/xoá bài viết của mình `/posts/edit/:id` / delete action
4. Xem profile `/profile`
5. Đổi mật khẩu `/profile`
6. Logout

## 10.3. Admin

1. Toàn bộ quyền User
2. Quản trị Users `/admin/users`
3. Quản trị Categories `/admin/categories`
4. Quản trị Roles `/admin/roles`
5. Quản trị Settings `/admin/settings`

---

# 11. Tiêu Chí Hoàn Thành System Flow

- Tất cả route protected/admin đều có auth guard (JWT)
- Owner/admin rule cho post edit/delete hoạt động đúng (403 khi vi phạm)
- Admin-only cho các module quản trị hoạt động đúng
- List endpoints sử dụng `pagination` đúng format
- UI xử lý 401/403 thống nhất theo mục 8

---

Tác giả: Lê Quang Tuyến  
Phiên bản: 1.1  
Trạng thái: Cập nhật theo UI Structure & API Design v1.1