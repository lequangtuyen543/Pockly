# 📘 Tổng Quan Dự Án  
## Hệ Thống Quản Lý Bài Viết (Blog Management System)

---

## 1. Mô Tả Dự Án

Hệ Thống Quản Lý Bài Viết là một ứng dụng web fullstack cho phép người dùng đăng ký/đăng nhập, tạo và quản lý bài viết, đồng thời hỗ trợ phân quyền theo vai trò và quyền hạn.

Dự án được xây dựng nhằm mục đích luyện tập và nâng cao kỹ năng phát triển fullstack sử dụng NodeJS (backend) và ReactJS (frontend).

---

## 2. Mục Tiêu Dự Án

- Xây dựng hệ thống CRUD hoàn chỉnh cho blog
- Triển khai xác thực bằng JWT và phân quyền theo `roles` / `permissions`
- Thiết kế RESTful API rõ ràng và chuẩn chỉnh
- Kết nối backend và frontend một cách hiệu quả
- Áp dụng cấu trúc dự án sạch và dễ mở rộng
- Rèn luyện tư duy thiết kế hệ thống trước khi lập trình

---

## 3. Đối Tượng Sử Dụng

- **Quản trị viên (Admin):**
  - Quản lý toàn bộ bài viết, danh mục, cài đặt hệ thống và người dùng (theo `permissions`)
  - Quản lý vai trò/quyền hạn theo thiết kế dữ liệu `roles`

- **Người dùng (User):**
  - Tạo và quản lý bài viết của chính mình (theo `posts.userId`)
  - Cập nhật thông tin cá nhân trong phạm vi cho phép
  - Đổi mật khẩu

- **Khách (Guest):**
  - Xem danh sách bài viết công khai
  - Xem chi tiết bài viết

---

## 4. Chức Năng Chính

### Xác Thực Người Dùng
- Đăng ký tài khoản
- Đăng nhập
- Xác thực API bằng JWT
- Hash mật khẩu bằng **bcrypt**
- Phân quyền theo vai trò và quyền hạn (`roles.title`, `roles.permissions`, gán qua `users.roleId`)

### Quản Lý Bài Viết
- Tạo bài viết mới
- Chỉnh sửa bài viết
- Xóa mềm (soft delete)
- Xem chi tiết bài viết
- Xem danh sách bài viết
- Lọc/tìm kiếm (ví dụ theo `categoryId`, `userId`, tiêu đề)

### Quản Lý Danh Mục (Categories)
- Tạo / xem / cập nhật danh mục (theo quyền)
- Hỗ trợ `slug` unique, URL-friendly
- Xóa mềm (soft delete)

### Cấu Hình Hệ Thống (Settings)
- Admin đọc/cập nhật cấu hình dạng key/value (`settings.key` unique)

### Quản Lý Người Dùng (Users)
- Admin xem danh sách và chi tiết người dùng
- User xem/cập nhật thông tin cá nhân (không tự đổi `roleId`)
- Đổi mật khẩu (xác thực mật khẩu cũ)
- Admin quản lý trạng thái tài khoản (`active`/`inactive`) và cơ chế soft delete theo thiết kế

---

## 5. Công Nghệ Sử Dụng

### Backend
- NodeJS
- ExpressJS
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt

### Frontend
- ReactJS
- React Router
- UI library/framework: tùy chọn (ví dụ TailwindCSS hoặc Ant Design)

---

## 6. Kiến Trúc Hệ Thống

ReactJS (Client)  
↓  
REST API (ExpressJS)  
↓  
MongoDB (Database)

Luồng xác thực:

Người dùng → Đăng nhập → Nhận JWT → Lưu token →  
Gửi token trong header Authorization → Backend xác thực → Trả dữ liệu

Các collection chính theo thiết kế dữ liệu: `users`, `roles`, `posts`, `categories`, `settings`.

---

## 7. Phạm Vi Dự Án

### Bao Gồm
- CRUD bài viết (soft delete trên `posts`)
- Đăng ký, đăng nhập (JWT), hash mật khẩu bằng bcrypt
- Phân quyền theo `roles` và `permissions`, gán qua `users.roleId`
- Quản lý danh mục (`categories`, soft delete)
- Cấu hình key/value (`settings`)
- Quản lý người dùng (danh sách, chi tiết, cập nhật, đổi mật khẩu, trạng thái/soft delete theo thiết kế)
- Route/API bảo vệ theo xác thực & quyền hạn
- Cấu trúc dự án rõ ràng (tách `route` / `controller` / `model`), dễ mở rộng
- Giao diện cơ bản

### Chưa Bao Gồm (giai đoạn hiện tại)
- Bình luận bài viết (`comments`)
- Tags và quan hệ N-N với bài viết
- Refresh token lưu collection (có thể bổ sung sau)
- Upload hình ảnh (thumbnail dùng URL có sẵn)
- Hệ thống thông báo
- Thanh toán

---

## 8. Hướng Phát Triển Tương Lai

- Bổ sung bình luận, tags
- Upload hình ảnh và quản lý media
- Phân trang (Pagination), tối ưu truy vấn
- Tài liệu API (Swagger/OpenAPI)
- Refresh token/rotate token (nếu mở rộng yêu cầu bảo mật)
- Triển khai lên cloud (Render / Vercel / AWS)

---

## 9. Phương Pháp Phát Triển

1. Phân tích yêu cầu
2. Thiết kế cơ sở dữ liệu
3. Thiết kế API
4. Xây dựng backend
5. Xây dựng frontend
6. Kết nối và kiểm thử
7. Tối ưu và refactor

---

## 10. Mục Đích Thực Hiện Dự Án

- Luyện tập phát triển fullstack
- Rèn luyện tư duy thiết kế hệ thống
- Tránh lập trình theo kiểu "làm đến đâu nghĩ đến đó"
- Chuẩn bị cho môi trường làm việc thực tế

---

Tác giả: [Lê Quang Tuyến]  
Phiên bản: 1.1  
Trạng thái: Giai đoạn phân tích & thiết kế
