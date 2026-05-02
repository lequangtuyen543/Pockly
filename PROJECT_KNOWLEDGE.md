# 🧠 AI Agent Knowledge Base: Pockly

File này là nguồn dữ liệu chuẩn để AI Agent nắm bắt nhanh kiến thức hệ thống, quy trình và các tiêu chuẩn của dự án Pockly (Ứng dụng quản lý tiền cá nhân).

## 1. 🎯 Tổng Quan (Project Overview)
- **Tên dự án:** Pockly
- **Mục tiêu:** Web app ghi chép thu/chi cá nhân siêu tốc (dưới 3 giây), đơn giản, không cần tài khoản, hoạt động offline. Giúp người dùng dễ dàng theo dõi "tiền đi đâu" và quản lý ngân sách.
- **Trạng thái:** MVP (v1.0) - Đang phát triển.
- **Tech Stack (Frontend):** React 18, Vite, Tailwind CSS, shadcn/ui, Recharts (biểu đồ), date-fns (xử lý thời gian), Zustand (state management).
- **Tech Stack (Backend):** Node.js + Express (Ở giai đoạn MVP v1.0, ứng dụng hoàn toàn dùng LocalStorage client-side, backend chuẩn bị cho v1.1).

## 2. 🏛️ Kiến Trúc & Dữ Liệu (Architecture & Data)

### A. Kiến trúc Dữ liệu (LocalStorage)
Giai đoạn MVP lưu trữ 100% dữ liệu tại LocalStorage của trình duyệt. Không gọi API, không dùng server.
Cấu trúc JSON (LocalStorage):
- `transactions`: Mảng chứa các giao dịch (id, type, amount, category, note, date).
- `categories`: Danh mục thu/chi (tên, icon).
- `budgets`: Ngân sách thiết lập theo tháng (tổng và theo danh mục).
- `settings`: Cài đặt ứng dụng (tiền tệ, hạn mức cảnh báo).

### B. Cấu Trúc Mã Nguồn Frontend (Gợi ý)
- `/src/components/transaction/`: Các component ghi chép và hiển thị giao dịch (TransactionForm, TransactionList).
- `/src/components/dashboard/`: Các component biểu đồ, thống kê (SummaryCards, SpendingChart).
- `/src/components/budget/`: Các component quản lý ngân sách, cảnh báo.
- `/src/store/`: Các store của Zustand (transactionStore, categoryStore, budgetStore).
- `/src/lib/`: Các hàm tiện ích (storage, calculations, export CSV).

## 3. 🛠️ Quy Trình Làm Việc Với Agent (Vibe Coding Workflow)
Yêu cầu Agent tuân thủ các bước:
1. **Tiếp nhận ngữ cảnh:** Luôn đọc file này và `PRD.md` để hiểu yêu cầu và giới hạn của MVP.
2. **Tuân thủ Stack:** Sử dụng đúng stack đã định (Tailwind + shadcn/ui cho giao diện, Zustand cho state).
3. **Phát triển Tốc độ:** Tập trung tạo ra các component hoạt động nhanh, mượt. Form nhập liệu ưu tiên bàn phím số, focus tự động.
4. **Local First:** Không viết code gọi API, mọi thao tác CRUD phải tương tác với LocalStorage/Zustand store.

## 4. 📝 Tiêu Chuẩn & Quy Tắc (Standards & Conventions)
- **Hiệu suất:** Tối ưu để ứng dụng load < 2 giây, ghi giao dịch ≤ 3 thao tác / 3 giây.
- **Thiết kế (Mobile-first):** Giao diện phải hoàn hảo trên màn hình mobile (375px trở lên) vì người dùng nhập liệu chủ yếu trên điện thoại.
- **Offline & Reliability:** Ứng dụng phải hoạt động bình thường khi mất mạng. Tránh làm mất dữ liệu người dùng trong LocalStorage.
- **Code Quality:** Sử dụng TypeScript chặt chẽ, chia nhỏ component hợp lý, tái sử dụng UI từ shadcn/ui.

## 5. 🔑 Từ Khóa & Thuật Ngữ (Glossary)
- `MVP`: Minimum Viable Product (Phiên bản v1.0 tập trung cốt lõi).
- `Transaction`: Giao dịch (Thu hoặc Chi).
- `Budget`: Ngân sách (giới hạn chi tiêu theo tháng).
- `LocalStorage`: Cơ chế lưu trữ chính của ứng dụng ở phiên bản này.

---
*Lưu ý: Nếu cần xem yêu cầu tính năng chi tiết, hãy đọc file `PRD.md`.*
