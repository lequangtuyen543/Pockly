# 🗄 Thiết Kế Cơ Sở Dữ Liệu
## Blog Management System

---

# 1. Tổng Quan

Hệ thống sử dụng **MongoDB** làm cơ sở dữ liệu dạng NoSQL.  
Dữ liệu được tổ chức theo collection và liên kết thông qua `ObjectId` (dạng string khi truyền qua API).

Hệ thống bao gồm **5 collection chính:**

| Collection   | Mô tả ngắn                        |
|--------------|-----------------------------------|
| `users`      | Tài khoản người dùng              |
| `roles`      | Phân quyền hệ thống               |
| `posts`      | Bài viết                          |
| `categories` | Danh mục bài viết                 |
| `settings`   | Cấu hình chung của hệ thống       |

---

# 2. Collection: `users`

## 2.1. Mô Tả

Lưu trữ thông tin tài khoản người dùng và phân quyền.

## 2.2. Cấu Trúc Schema

```
users {
  _id:       ObjectId,
  username:  String,      // bắt buộc, unique
  email:     String,      // bắt buộc, unique
  password:  String,      // bắt buộc, hash bằng bcrypt (không dùng md5)
  avatar:    String,      // URL ảnh đại diện, không bắt buộc
  roleId:    ObjectId,    // tham chiếu roles._id
  status:    String,      // "active" | "inactive", mặc định "active"
  createdAt: Date,
  updatedAt: Date,
  deleted:   Boolean      // soft delete, mặc định false
}
```

## 2.3. Ràng Buộc

| Trường     | Bắt buộc | Unique | Mặc định   | Ghi chú                        |
|------------|----------|--------|------------|-------------------------------|
| `username` | ✓        | ✓      |            |                               |
| `email`    | ✓        | ✓      |            |                               |
| `password` | ✓        |        |            | Hash bcrypt, không lưu plaintext |
| `roleId`   | ✓        |        | id của role "user" |                     |
| `status`   |          |        | `"active"` |                               |
| `deleted`  |          |        | `false`    |                               |

## 2.4. Index Đề Xuất

```js
{ email: 1 }     // unique
{ username: 1 }  // unique
```

> ⚠️ **Lưu ý bảo mật:** Nên dùng **bcrypt** thay cho md5. MD5 đã bị phá vỡ từ lâu và không an toàn để hash mật khẩu. bcrypt có built-in salt, chống rainbow table attack.

---

# 3. Collection: `roles`

## 3.1. Mô Tả

Lưu trữ danh sách vai trò và quyền hạn trong hệ thống.

## 3.2. Cấu Trúc Schema

```
roles {
  _id:         ObjectId,
  title:       String,    // tên hiển thị, vd: "Admin", "Editor"
  description: String,    // mô tả vai trò, không bắt buộc
  permissions: [String],  // danh sách quyền, vd: ["posts_create", "posts_delete"]
  createdAt:   Date,
  updatedAt:   Date,
  deleted:     Boolean    // soft delete, mặc định false
}
```

## 3.3. Ràng Buộc

| Trường        | Bắt buộc | Ghi chú                               |
|---------------|----------|---------------------------------------|
| `title`       | ✓        | Unique                                |
| `permissions` |          | Mảng rỗng nếu không có quyền nào     |

---

# 4. Collection: `posts`

## 4.1. Mô Tả

Lưu trữ nội dung bài viết được tạo bởi người dùng.

## 4.2. Cấu Trúc Schema

```
posts {
  _id:        ObjectId,
  title:      String,     // bắt buộc
  content:    String,     // bắt buộc, nội dung HTML hoặc Markdown
  thumbnail:  String,     // URL ảnh đại diện, không bắt buộc
  categoryId: ObjectId,   // tham chiếu categories._id
  userId:  ObjectId,   // tham chiếu users._id
  status:     String,     // "active" | "inactive", mặc định "active"
  deleted:    Boolean,    // soft delete, mặc định false
  createdAt:  Date,
  updatedAt:  Date
}
```

## 4.3. Ràng Buộc

| Trường       | Bắt buộc | Mặc định    | Ghi chú         |
|--------------|----------|-------------|-----------------|
| `title`      | ✓        |             |                 |
| `content`    | ✓        |             |                 |
| `userId`  | ✓        |             | Không được null |
| `status`     |          | `"active"`  |                 |
| `deleted`    |          | `false`     |                 |

## 4.4. Index Đề Xuất

```js
{ userId: 1 }    // query bài viết theo user
{ categoryId: 1 }   // query bài viết theo danh mục
{ status: 1 }       // filter theo trạng thái
```

---

# 5. Collection: `categories`

## 5.1. Mô Tả

Lưu trữ danh mục phân loại bài viết.

## 5.2. Cấu Trúc Schema

```
categories {
  _id:       ObjectId,
  title:     String,    // bắt buộc, tên danh mục
  slug:      String,    // URL-friendly, unique, vd: "lap-trinh"
  status:    String,    // "active" | "inactive", mặc định "active"
  createdAt: Date,
  updatedAt: Date,
  deleted:   Boolean    // soft delete, mặc định false
}
```

## 5.3. Ràng Buộc

| Trường   | Bắt buộc | Unique | Mặc định   |
|----------|----------|--------|------------|
| `title`  | ✓        |        |            |
| `slug`   | ✓        | ✓      |            |
| `status` |          |        | `"active"` |

---

# 6. Collection: `settings`

## 6.1. Mô Tả

Lưu trữ cấu hình chung của hệ thống (tên website, logo, mô tả...).

## 6.2. Cấu Trúc Schema

```
settings {
  _id:       ObjectId,
  key:       String,    // bắt buộc, unique, vd: "site_name"
  value:     String,    // giá trị tương ứng
  createdAt: Date,
  updatedAt: Date
}
```

> Dùng cặp `key/value` để linh hoạt thêm config mà không cần thay đổi schema.

---

# 7. Quan Hệ Giữa Các Collection

```
roles  (1) ──── (N)  users
                      │
                      │ userId
                      ▼
categories (1) ─(N) posts
```

| Quan hệ                | Trường liên kết     |
|------------------------|---------------------|
| `roles` → `users`      | `users.roleId`      |
| `users` → `posts`      | `posts.userId`   |
| `categories` → `posts` | `posts.categoryId`  |

## Xử lý khi xóa User

Hệ thống áp dụng **soft delete** — không xóa vật lý khỏi database.  
Khi `users.deleted = true`, bài viết của user đó vẫn giữ nguyên.

---

# 8. Quy Tắc Thiết Kế

| Quy tắc                  | Áp dụng                                              |
|--------------------------|------------------------------------------------------|
| Soft delete              | Tất cả collection (trừ `settings`)                   |
| Không nhúng document     | Dùng reference (`ObjectId`) thay vì embed toàn bộ   |
| Đặt tên trường nhất quán | `userId`, `categoryId`, `roleId` — camelCase      |
| Bảo mật password         | Dùng bcrypt, không dùng md5                          |
| Timestamps               | Tất cả collection có `createdAt`, `updatedAt`        |

---

# 9. Mở Rộng Trong Tương Lai

Có thể bổ sung thêm các collection:

```
comments {
  _id:       ObjectId,
  content:   String,     // bắt buộc
  postId:    ObjectId,   // tham chiếu posts._id
  userId: ObjectId,   // tham chiếu users._id
  deleted:   Boolean,
  createdAt: Date,
  updatedAt: Date
}

tags {
  _id:   ObjectId,
  title: String,         // unique
  slug:  String          // unique
}

// Quan hệ N-N giữa posts và tags
post_tags {
  postId: ObjectId,
  tagId:  ObjectId
}

refreshTokens {
  _id:       ObjectId,
  userId:    ObjectId,   // tham chiếu users._id
  token:     String,     // unique
  expiresAt: Date,
  createdAt: Date
}
```

---

# 10. Tiêu Chuẩn Hoàn Thành

Thiết kế database được xem là hoàn chỉnh khi:

- [ ] Đủ để triển khai toàn bộ chức năng FR-01 đến FR-15
- [ ] Không cần thay đổi cấu trúc lớn trong quá trình code
- [ ] Quan hệ dữ liệu rõ ràng, có tài liệu
- [ ] Không trùng lặp dữ liệu không cần thiết
- [ ] Đặt tên trường nhất quán xuyên suốt
- [ ] Đã review bảo mật (password hashing, soft delete)

---

> **Tác giả:** Lê Quang Tuyến  
> **Phiên bản:** 1.1  
> **Trạng thái:** Giai đoạn phân tích & thiết kế  
> **Cập nhật:** 03/2026

---