# 📋 Yêu Cầu Hệ Thống  
## Blog Management System

---

## 1. Giới Thiệu

Tài liệu này mô tả các yêu cầu chức năng và phi chức năng của Hệ Thống Quản Lý Bài Viết.

Mục tiêu của tài liệu nhằm đảm bảo:
- Hệ thống được xây dựng đúng mục tiêu
- Không thiếu chức năng quan trọng
- Hạn chế thay đổi lớn trong quá trình lập trình
- Yêu cầu thống nhất với thiết kế cơ sở dữ liệu (MongoDB: `users`, `roles`, `posts`, `categories`, `settings`)

---

# 2. Yêu Cầu Chức Năng (Functional Requirements)

## 2.1. Xác Thực Người Dùng (Auth)

### FR-01: Đăng ký tài khoản (Register)
- Người dùng có thể tạo tài khoản mới.
- Hệ thống phải kiểm tra `username` và `email` không trùng lặp (unique).
- Mật khẩu phải được hash bằng **bcrypt** trước khi lưu (không lưu plaintext; không dùng MD5).
- Tài khoản mới được gán `roleId` tương ứng vai trò mặc định (ví dụ: User).

### FR-02: Đăng nhập (Login)
- Người dùng có thể đăng nhập bằng `username` và mật khẩu.
- Chỉ tài khoản `status = active` và không bị loại khỏi sử dụng theo quy tắc nghiệp vụ (xem FR-15 và soft delete) mới đăng nhập được.
- Nếu thông tin hợp lệ, hệ thống trả về JWT token.
- Nếu sai thông tin, hiển thị thông báo lỗi phù hợp.


### FR-03: Phân quyền (Roles & Permissions)
- Hệ thống quản lý vai trò qua collection `roles`: mỗi role có `title` (unique), tùy chọn `description`, và mảng `permissions` (ví dụ: `posts_create`, `posts_delete`).
- Phải hỗ trợ ít nhất hai vai trò nghiệp vụ: **Admin** và **User** (ánh xạ tới bản ghi trong `roles`).
- Admin có quyền quản lý toàn bộ bài viết và các chức năng quản trị theo `permissions`.
- User chỉ được quản lý bài viết của chính mình (`posts.userId` trùng với user đăng nhập).
- Gán vai trò cho user thông qua `users.roleId` (tham chiếu `roles._id`).

---

## 2.2. Quản Lý Bài Viết (Posts)

### FR-04: Tạo bài viết (Create)
- Người dùng đã đăng nhập có thể tạo bài viết.
- Bài viết gồm tối thiểu: `title`, `content` (HTML hoặc Markdown); tùy chọn: `thumbnail` (URL), `categoryId` (tham chiếu `categories._id`).
- Bài viết được gắn với tác giả qua `userId` (tham chiếu `users._id`).
- Trạng thái hiển thị theo `status` (`active` | `inactive`, mặc định `active`).

### FR-05: Xem danh sách bài viết (Index)
- Người dùng và khách có thể xem danh sách bài viết phù hợp chính sách công khai (thường là `deleted = false`, `status = active` — chi tiết hiển thị theo API/thiết kế).
- Có thể hỗ trợ lọc theo danh mục (`categoryId`), tác giả (`userId`), hoặc tìm kiếm theo tiêu đề.

### FR-06: Xem chi tiết bài viết (Detail)
- Người dùng có thể xem nội dung đầy đủ của một bài viết (theo quy tắc trạng thái và quyền).

### FR-07: Chỉnh sửa bài viết (Edit)
- User chỉ được chỉnh sửa bài viết có `userId` là chính mình.
- Admin có thể chỉnh sửa mọi bài viết (theo `permissions`).
- Cho phép cập nhật các trường theo mô hình dữ liệu: tiêu đề, nội dung, thumbnail, danh mục, trạng thái (trong phạm vi quyền).

### FR-08: Xóa bài viết (Delete)
- Hệ thống **không xóa vật lý** bản ghi khỏi database.
- Chỉ đánh dấu soft delete: `posts.deleted = true` (và cập nhật `updatedAt`).

---

## 2.3. Quản Lý Danh Mục (Categories)

### FR-09: Quản lý danh mục
- Admin (hoặc role có `permissions` tương ứng) có thể tạo, xem danh sách, xem chi tiết, cập nhật danh mục.
- Mỗi danh mục có `title` (bắt buộc), `slug` (bắt buộc, unique, URL-friendly), `status` (`active` | `inactive`).
- Xóa danh mục theo **soft delete**: `categories.deleted = true`, không xóa vật lý.
- Bài viết liên kết danh mục qua `posts.categoryId` (bài viết vẫn tồn tại nếu danh mục bị vô hiệu hóa/xóa mềm — xử lý hiển thị theo quy tắc API).

---

## 2.4. Cấu Hình Hệ Thống (Settings)

### FR-10: Quản lý cài đặt chung
- Admin có thể đọc và cập nhật cấu hình dạng key/value (`settings.key`, `settings.value`, `key` unique), ví dụ: tên site, logo, mô tả.
- Collection `settings` không dùng cờ soft delete theo thiết kế CSDL hiện tại.

---

## 2.5. Quản Lý Người Dùng (Users)

### FR-11: Xem danh sách người dùng (Index)
- Chỉ Admin được phép xem danh sách tất cả người dùng.
- Danh sách hiển thị các thông tin cơ bản: `username`, `email`, vai trò (qua `roleId` / thông tin role), `status`, có thể kèm `avatar`.
- Có thể hỗ trợ tìm kiếm theo `email` hoặc `username`.

### FR-12: Xem chi tiết người dùng (Detail)
- Admin có thể xem thông tin chi tiết của một người dùng.
- User có thể xem thông tin cá nhân của chính mình.

### FR-13: Cập nhật thông tin người dùng (Edit)
- User có thể cập nhật thông tin cá nhân trong phạm vi cho phép (ví dụ: `avatar`, và các trường profile được mở — không tự đổi `roleId`).
- Admin có thể cập nhật thông tin và gán `roleId` cho người dùng khác.

### FR-14: Thay đổi mật khẩu (ChangePassword)
- Người dùng đã đăng nhập có thể thay đổi mật khẩu.
- Phải xác thực mật khẩu cũ trước khi đổi.
- Mật khẩu mới phải được hash bằng **bcrypt** trước khi lưu.

### FR-15: Vô hiệu hóa / quản lý trạng thái tài khoản (ChangeStatus)
- Admin có thể đặt `users.status = inactive` để vô hiệu hóa đăng nhập.
- Không xóa vật lý dữ liệu user; có thể bổ sung soft delete `users.deleted = true` theo thiết kế CSDL (khi `deleted = true`, bài viết của user vẫn giữ nguyên theo tài liệu thiết kế).

---

# 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

## 3.1. Bảo Mật
- Mật khẩu phải được hash bằng **bcrypt** (có salt), không dùng MD5.
- API bảo vệ bằng JWT.
- Các route nhạy cảm phải yêu cầu xác thực và kiểm tra `permissions` / vai trò phù hợp.

## 3.2. Hiệu Năng
- Thời gian phản hồi API không quá 2 giây trong điều kiện bình thường.
- Hệ thống phải xử lý tối thiểu 50 người dùng đồng thời (mức mô phỏng).

## 3.3. Khả Năng Mở Rộng
- Cấu trúc dự án phải rõ ràng, dễ thêm tính năng.
- Tách riêng controller, model, route.
- Đặt tên trường tham chiếu nhất quán với CSDL: `userId`, `categoryId`, `roleId` (camelCase).

## 3.4. Khả Năng Bảo Trì
- Code phải có cấu trúc sạch.
- Tên biến, hàm rõ ràng.
- Có xử lý lỗi tập trung.

---

# 4. Phạm Vi Hệ Thống

## 4.1. Bao Gồm
- CRUD bài viết (soft delete trên `posts`)
- Đăng ký, đăng nhập (JWT)
- Phân quyền theo `roles` và `permissions`, gán qua `users.roleId`
- Quản lý danh mục (`categories`)
- Cấu hình key/value (`settings`)
- Quản lý người dùng (danh sách, chi tiết, cập nhật, đổi mật khẩu, trạng thái / soft delete theo thiết kế)
- Giao diện cơ bản

## 4.2. Không Bao Gồm (Giai đoạn hiện tại)
- Bình luận bài viết (`comments` — mở rộng sau)
- Thẻ (tags) và quan hệ N-N với bài viết
- Refresh token lưu collection (có thể bổ sung sau)
- Upload hình ảnh (thumbnail có thể là URL sẵn có)
- Hệ thống thông báo
- Thanh toán

---

# 5. Giả Định & Ràng Buộc

## 5.1. Giả Định
- Người dùng có kết nối internet ổn định.
- Hệ thống chạy trên môi trường NodeJS.

## 5.2. Ràng Buộc
- Sử dụng **MongoDB** làm cơ sở dữ liệu; các thực thể chính: `users`, `roles`, `posts`, `categories`, `settings`.
- Liên kết bằng `ObjectId` (chuỗi khi trao đổi qua API).
- Soft delete áp dụng cho `users`, `roles`, `posts`, `categories` (không áp dụng cho `settings` theo thiết kế hiện tại).
- Backend sử dụng ExpressJS.
- Frontend sử dụng ReactJS.

---

# 6. Tiêu Chí Hoàn Thành (Acceptance Criteria)

Hệ thống được xem là hoàn thành khi:

- Người dùng có thể đăng ký và đăng nhập thành công; mật khẩu được hash bcrypt.
- JWT hoạt động chính xác.
- User không thể chỉnh sửa bài viết của người khác; bài viết gắn đúng `userId`.
- Admin có thể quản lý toàn bộ bài viết, danh mục, cài đặt hệ thống và người dùng (trong phạm vi FR).
- CRUD danh mục và đọc/ghi `settings` hoạt động ổn định.
- Soft delete trên bài viết (và các thực thể có trong thiết kế) hoạt động đúng.
- Không có lỗi nghiêm trọng trong luồng chính.

---

Tác giả: [Lê Quang Tuyến]  
Phiên bản: 1.1  
Trạng thái: Giai đoạn phân tích & thiết kế  
Cập nhật: đồng bộ với `03-database-design.md`
