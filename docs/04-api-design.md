# 🔌 Thiết Kế API  
## Blog Management System

---

# 1. Tổng Quan

Hệ thống sử dụng RESTful API với chuẩn JSON.  
Tất cả endpoint được đặt tiền tố:

/api/v1

Dữ liệu trả về theo format:

{
  code: Int,
  message: String,
  data: Array || Object || null
}

Các route yêu cầu xác thực sẽ sử dụng JWT trong header:

Authorization: Bearer <token>

---

# 2. Authentication APIs

## 2.1. Đăng Ký

POST /api/v1/auth/register

Request Body:
{
  username: String,
  email: String,
  password: String
}

👉 Backend xử lý:

hash password (bcrypt)
set:
```
roleId = defaultRoleUser
status = "active"
deleted = false
```

Response (Success):
{
  code: 200,
  message: "Đăng ký thành công",
  data: null
}

---

## 2.2. Đăng Nhập

POST /api/v1/auth/login

Request Body:
{
  username: String, // hoặc email
  password: String
}

Response (Success):
{
  code: 200,
  message: "Đăng nhập thành công",
  data: {
    token: String
  }
}

---

# 3. User APIs

## 3.1. Lấy Danh Sách Người Dùng (Admin)

GET /api/v1/users

Auth: Required (Admin)

Query Params (optional):
- keyword (search theo username hoặc email)

filter thêm deleted: false
search đúng field

```
{
  $or: [
    { username: /keyword/i },
    { email: /keyword/i }
  ],
  deleted: false
}
```

Response:
{
  "code": 200,
  "message": "Success",
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "limitItems": 5,
    "totalItems": 23,
    "totalPages": 5
  }
}

---

## 3.2. Lấy Thông Tin Cá Nhân

GET /api/v1/users/info

Auth: Required

Response:
{
  code: 200,
  data: UserInfo
}

---

## 3.3. Cập Nhật Người Dùng

PATCH /api/v1/users/edit/:id

Auth: Required

Request Body:
{
  "username": "string",
  "avatar": "string",
  "roleId": "string",   // admin only
  "status": "active"      // admin only
}

Response:
{
  code: 200,
  message: "Cập nhật thành công",
  data: User
}

---

## 3.4. Đổi Mật Khẩu

PATCH /api/v1/users/change-password

Auth: Required

Request Body:
{
  oldPassword: String,
  newPassword: String
}

---

# 4. Post APIs

## 4.1. Tạo Bài Viết

POST /api/v1/posts/create

Auth: Required

Request Body:
{
  "title": "string",
  "content": "string",
  "thumbnail": "string",
  "categoryId": "ObjectId"
}

👉 Backend tự set:
```
userId = req.user.id
status = "active"
deleted = false
```

---

## 4.2. Lấy Danh Sách Bài Viết

GET /api/v1/posts

Auth: Optional

Find: 
{
  deleted: false,
  status: "active"
}

Query Params (optional): /api/v1/posts?keyword=react&categoryId=...&page=1&limit=5

| Param      | Kiểu   | Mô tả                |
| ---------- | ------ | -------------------- |
| keyword    | String | search theo title    |
| sortKey    | String | title, createdAt     |
| sortValue  | String | asc / desc           |
| page       | Number | mặc định 1           |
| limit      | Number | mặc định 5           |

👉 Thêm filter category:
if (categoryId) filter.categoryId = categoryId

Chỉ trả về bài viết có deleted = false.

Response:
{
  "code": 200,
  "message": "Success",
  "data": [Post],
  "pagination": {
    "currentPage": 1,
    "limitItems": 5,
    "totalItems": 23,
    "totalPages": 5
  }
}

---

## 4.3. Lấy Chi Tiết Bài Viết

GET /api/v1/posts/detail/:id

Auth: Optional

Populate đúng theo DB:
```
Post.findById(id)
  .populate("userId", "username")
  .populate("categoryId", "title")
```

Response: 
```
{
  "_id": "...",
  "title": "...",
  "content": "...",
  "status": "active",

  "user": {
    "_id": "...",
    "username": "..."
  },

  "category": {
    "_id": "...",
    "title": "..."
  }
}
```

---

## 4.4. Cập Nhật Bài Viết

PATCH /api/v1/posts/edit/:id

Auth: Required

- User chỉ cập nhật bài của mình
- Admin cập nhật mọi bài

Logic:
```
{
  deleted: true,
  updatedAt: new Date()
}
```

Response: 
{
  "title": "string",
  "content": "string",
  "thumbnail": "string",
  "categoryId": "ObjectId",
  "status": "active" // admin only
}

---

## 4.5. Xóa Bài Viết (Soft Delete)

DELETE /api/v1/posts/delete/:id

Auth: Required

Hệ thống chỉ cập nhật:

deleted = true

---

# 5. Category APIs

## 5.1. GET /api/v1/categories

Auth: Optional

Find: { deleted: false }

Query Params (optional): /api/v1/categories?keyword=react&page=1&limit=10

| Param      | Kiểu   | Mô tả                |
| ---------- | ------ | -------------------- |
| keyword    | String | search theo title    |
| page       | Number | mặc định 1           |
| limit      | Number | mặc định 10          |

👉 Thêm search:
if (keyword) filter.title = /keyword/i

Response:
{
  "code": 200,
  "message": "Success",
  "data": [Category],
  "pagination": {
    "currentPage": 1,
    "limitItems": 10,
    "totalItems": 5,
    "totalPages": 1
  }
}

## 5.2. POST /api/v1/categories

Auth: Required (Admin)

Request Body:
{
  "title": "Programming",
  "slug": "programming"
}

👉 Backend xử lý:
- Validate title, slug unique
- set deleted: false

Response (Success):
{
  code: 200,
  message: "Tạo danh mục thành công",
  data: Category
}

## 5.3. PATCH /api/v1/categories/:id

Auth: Required (Admin)

Request Body:
{
  "title": "Updated Title",
  "slug": "updated-slug"
}

👉 Backend xử lý:
- Validate title, slug unique (không trùng với category khác)
- Update fields

Response:
{
  code: 200,
  message: "Cập nhật thành công",
  data: Category
}

## 5.4. DELETE /api/v1/categories/:id

Auth: Required (Admin)

→ Soft delete: update deleted = true, deletedAt = new Date()

Response:
{
  code: 200,
  message: "Xóa thành công",
  data: null
}

# 6. ROLE APIs

## 6.1. GET /api/v1/roles

Auth: Required (Admin)

Find: { deleted: false }

Response:
{
  "code": 200,
  "message": "Success",
  "data": [Role]
}

## 6.2. POST /api/v1/roles

Auth: Required (Admin)

Request Body:
{
  "title": "Admin",
  "description": "Administrator role",
  "permissions": ["posts_create", "posts_delete", "users_manage"]
}

👉 Backend xử lý:
- Validate title unique
- permissions là array of strings

Response (Success):
{
  code: 200,
  message: "Tạo vai trò thành công",
  data: Role
}

## 6.3. PATCH /api/v1/roles/:id

Auth: Required (Admin)

Request Body:
{
  "title": "Updated Role",
  "description": "Updated description",
  "permissions": ["posts_view", "posts_edit"]
}

👉 Backend xử lý:
- Validate title unique (nếu update)
- Update fields

Response:
{
  code: 200,
  message: "Cập nhật thành công",
  data: Role
}

## 6.4. DELETE /api/v1/roles/:id

Auth: Required (Admin)

→ Soft delete: update deleted = true, deletedAt = new Date()

Response:
{
  code: 200,
  message: "Xóa thành công",
  data: null
}

# 7. SETTINGS APIs

## 7.1. GET /api/v1/settings

Auth: Required (Admin)

Response:
{
  "code": 200,
  "message": "Success",
  "data": { "site_name": "My Blog", "site_description": "..." }
}

## 7.2. PATCH /api/v1/settings

Auth: Required (Admin)

Request Body:
{
  "key": "site_name",
  "value": "Updated Blog Name"
}

👉 Backend xử lý:
- Update hoặc tạo setting theo key

Response:
{
  code: 200,
  message: "Cập nhật thành công",
  data: null
}

# 8. HTTP Status Codes

- 200: Thành công
- 201: Tạo mới thành công
- 400: Lỗi dữ liệu đầu vào
- 401: Chưa xác thực
- 403: Không có quyền
- 404: Không tìm thấy
- 500: Lỗi server

---

# 9. Quy Tắc Thiết Kế

- Sử dụng danh từ cho route (users, posts)
- Không dùng động từ trong URL
- Dùng đúng HTTP method (GET, POST, PATCH, DELETE)
- Luôn trả về JSON
- Xử lý lỗi tập trung

---

# 10. Tiêu Chí Hoàn Thành

API được xem là hoàn chỉnh khi:

- Đáp ứng đầy đủ FR-01 đến FR-15
- Phân quyền hoạt động đúng
- Soft delete hoạt động chính xác
- JWT xác thực ổn định
- Không có route trùng lặp hoặc dư thừa

---

Tác giả: [Lê Quang Tuyến]  
Phiên bản: 1.1
Trạng thái: Giai đoạn phân tích & thiết kế