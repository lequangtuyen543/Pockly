# 🧠 AI Agent Knowledge Base: Clean Blog FS

File này là nguồn dữ liệu chuẩn để AI Agent nắm bắt nhanh kiến thức hệ thống, quy trình và các tiêu chuẩn của dự án Clean Blog Management System.

## 1. 🎯 Tổng Quan (Project Overview)
- **Tên dự án:** Clean Blog FS
- **Mục tiêu:** Hệ thống quản lý bài viết fullstack với phân quyền (RBAC), quản lý danh mục và tích hợp AI.
- **Trạng thái:** Phát triển (Development) - Đã hoàn xong phần Phân tích & Thiết kế.
- **Tech Stack:** NodeJS (Express), MongoDB (Mongoose), ReactJS (Vite), TypeScript, TailwindCSS, Ant Design.

## 2. 🏛️ Kiến Trúc & Tài Liệu (Architecture & Docs)

### A. Tài Liệu Thiết Kế (Design Documents)
Toàn bộ "linh hồn" thiết kế nằm tại thư mục `/documents`:
- `01-project-overview.md`: Tầm nhìn và phạm vi dự án.
- `02-requirements.md`: Danh sách chức năng (FR) và yêu cầu bảo mật (NFR).
- `03-database-design.md`: Cấu trúc các Collection (Users, Roles, Posts, Categories, Settings).
- `04-api-design.md`: Đặc tả chi tiết các Endpoint RESTful API v1.
- `05-ui-structure.md`: Sơ đồ trang, layout và luồng tương tác người dùng.
- `06-system-flow.md`: Luồng hoạt động của hệ thống (Auth, CRUD).
- **UI Prototypes:** `/stitch_clean_blog_management_system`: Chứa các mẫu giao diện và cấu trúc UI chi tiết được thiết kế bằng Stitch.

### B. Cấu Trúc Mã Nguồn (Codebase Structure)
- **Backend:** `/backend`
    - Logic/API: `/backend/api/v1` (Routes, Controllers).
    - Database: `/backend/api/v1/models` (Mongoose Schemas).
    - Helpers: `/backend/helpers` (Phân trang, xử lý slug, search).
- **Frontend:** `/frontend`
    - Framework/UI: ReactJS + Vite.
    - Pages: `/frontend/src/pages` (Admin, Client, Auth).
    - Styling: TailwindCSS + Ant Design.

## 3. 🛠️ Quy Trình Làm Việc Với Agent (Agent Workflow)
Yêu cầu Agent tuân thủ các bước sau:
1.  **Tiếp nhận ngữ cảnh:** Luôn đọc file này, tài liệu trong `/documents` và các bản mẫu thiết kế trong `/stitch_clean_blog_management_system` trước khi sửa code UI.
2.  **Đối chiếu thiết kế:** Tuyệt đối không thay đổi cấu trúc Database hoặc API mà không xem file `03` và `04`.
3.  **Xử lý Logic:** Ưu tiên xử lý Backend (API/Model) trước, sau đó mới cập nhật UI Frontend.
4.  **Kiểm chứng:** Đảm bảo mọi bài viết/danh mục đều có logic Soft Delete và Auth check (JWT).

## 4. 📝 Tiêu Chuẩn & Quy Tắc (Standards & Conventions)
- **Naming:** camelCase cho biến/hàm, PascalCase cho React Component, kebab-case cho URL/Slug.
- **Security:** Mật khẩu hash Bcrypt, API bảo vệ bằng JWT Bearer Token.
- **Data Integrity:** **Luôn sử dụng Soft Delete** (`deleted: true`), không xóa vật lý.
- **API Response:** Luôn trả về đúng format `{ code, message, data }`.

## 5. 🔑 Từ Khóa & Thuật Ngữ (Glossary)
- `Soft Delete`: Đánh dấu bản ghi đã xóa bằng field `deleted` để có thể khôi phục.
- `RBAC`: Phân quyền dựa trên vai trò (Admin, User) qua collection `roles`.
- `Slug`: Chuỗi URL thân thiện (VD: `hoc-javascript-co-ban`).
- `Populate`: Kỹ thuật của Mongoose để lấy dữ liệu liên kết (VD: Post lấy thêm thông tin User).

---
*Cập nhật lần cuối: 25-04-2026*
