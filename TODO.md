# 📋 KẾ HOẠCH TRIỂN KHAI DỰ ÁN POCKLY

### 1. **Phân tích & Thiết kế**
- [x] Đặt tên dự án: **Pockly** — ứng dụng quản lý tiền cá nhân đơn giản, nhanh, mobile-first.
- [x] Viết tài liệu yêu cầu sản phẩm (`prd.md`): nhập thu/chi nhanh, thống kê biểu đồ, cảnh báo ngân sách, LocalStorage-first.
- [x] Thiết kế UI Prototypes (Stitch) cho các màn hình chính.
- [x] Viết tài liệu tổng quan (`docs/01-project-overview.md`).
- [x] Viết tài liệu yêu cầu (`docs/02-requirements.md`).
- [x] Viết tài liệu thiết kế database & LocalStorage schema (`docs/03-data-design.md`).
- [x] Viết tài liệu đặc tả API Node.js v1 (`docs/04-api-design.md`).
- [x] Viết tài liệu cấu trúc giao diện & component tree (`docs/05-ui-structure.md`).
- [x] Viết tài liệu luồng hệ thống: nhập liệu → lưu → thống kê → cảnh báo (`docs/06-system-flow.md`).
- [x] Viết AI Agent Knowledge Base (`PROJECT_KNOWLEDGE.md`).

---

### 2. **Thiết lập dự án**
- [x] Khởi tạo monorepo hoặc tách `frontend/` và `backend`.
- [x] Khởi tạo Frontend: `pnpm create vite@latest pockly-client --template react-ts`.
- [x] Cài đặt dependencies Frontend: Tailwind CSS, shadcn/ui, Recharts, Zustand, date-fns.
- [x] Cấu hình shadcn/ui (Claude design system): theme, color tokens, typography.
- [x] Khởi tạo Backend: `pnpm init` trong `pockly-server/`, cài Express + TypeScript.
- [x] Cấu hình ESLint + Prettier cho cả frontend và backend.
- [x] Tạo repository GitHub, cấu hình `.gitignore`, `README.md` ban đầu.
- [x] Cấu hình deploy pipeline: Vercel cho frontend, Railway/Render cho backend.

---

### 3. **Thiết lập Backend (Node.js + Express)**
- [x] Khởi tạo project Express với TypeScript (`tsconfig.json`, `nodemon`).
- [x] Cấu hình cấu trúc thư mục: `routes/`, `controllers/`, `middleware/`, `lib/`.
- [x] Xây dựng các Routes:
  - [x] `GET/POST /api/transactions` — lấy và tạo giao dịch.
  - [x] `PUT/DELETE /api/transactions/:id` — sửa và xoá giao dịch.
  - [x] `GET/POST /api/categories` — danh mục.
  - [x] `GET/PUT /api/budgets/:month` — ngân sách theo tháng.
  - [x] `GET /api/stats/:month` — thống kê tổng hợp.
- [x] Xây dựng các Controllers:
  - [x] Transaction Controller (`transaction.controller.ts`).
  - [x] Category Controller (`category.controller.ts`).
  - [x] Budget Controller (`budget.controller.ts`).
  - [x] Stats Controller (`stats.controller.ts`).
- [x] Viết middleware xử lý lỗi tập trung (`errorHandler.ts`).
- [x] Viết middleware validate input (`validateRequest.ts`).
- [x] Viết unit test cơ bản cho controllers (Jest).

> **MVP note:** Backend được chuẩn bị sẵn cấu trúc, nhưng v1.0 frontend chạy hoàn toàn với LocalStorage. Backend sẽ kích hoạt ở v1.1 khi cần sync cloud.

---

### 4. **Thiết lập Frontend (React + Vite + Tailwind + shadcn/ui)**
- [x] Cấu hình Tailwind CSS (`tailwind.config.ts`), custom color palette Pockly.
- [x] Cài đặt và cấu hình shadcn/ui components: Button, Input, Dialog, Select, Progress, Badge.
- [x] Tạo các Layout cơ bản:
  - [x] `AppLayout` — layout chính với bottom navigation (mobile).
  - [x] `FullscreenLayout` — cho màn hình nhập liệu nhanh.
- [x] Cấu hình React Router: định nghĩa các routes trong `src/routes/index.tsx`.
- [x] Xây dựng LocalStorage layer (`src/lib/storage.ts`): CRUD helpers, schema validation.
- [x] Xây dựng Zustand stores:
  - [x] `transactionStore.ts` — danh sách giao dịch, CRUD actions.
  - [x] `categoryStore.ts` — danh mục, default categories.
  - [x] `budgetStore.ts` — ngân sách theo tháng, tính % đã dùng.

---

### 5. **Xây dựng tính năng chính**

#### 5.1 Nhập thu/chi nhanh
- [x] Component `TransactionForm`: toggle Thu/Chi, input số tiền (auto-focus, bàn phím số), dropdown danh mục, ghi chú optional.
- [x] Submit bằng Enter hoặc nút Lưu.
- [x] Timestamp tự động, có thể chỉnh lại ngày giờ.
- [x] Animation feedback sau khi lưu thành công (micro-interaction).

#### 5.2 Danh sách giao dịch
- [x] Component `TransactionList`: hiển thị theo ngày, màu xanh/đỏ phân biệt thu/chi.
- [x] Component `TransactionItem`: hiển thị danh mục icon, số tiền, ghi chú, thời gian.
- [x] Filter theo: ngày / tuần / tháng / danh mục.
- [x] Tìm kiếm theo số tiền hoặc ghi chú.
- [x] Swipe-to-delete trên mobile hoặc long press menu (Sửa / Xoá).
- [x] Confirm dialog khi xoá.

#### 5.3 Dashboard & thống kê
- [x] Component `SummaryCards`: tổng thu, tổng chi, số dư trong tháng.
- [x] Component `SpendingChart`: biểu đồ cột chi tiêu theo ngày (Recharts BarChart).
- [x] Component `CategoryBreakdown`: biểu đồ tròn donut theo danh mục (Recharts PieChart).
- [x] Component `MonthComparison`: mini bar so sánh tháng này vs tháng trước.
- [x] Tab/toggle chuyển đổi: tuần / tháng / 3 tháng.
- [x] Tap vào phần biểu đồ để xem chi tiết danh mục.

#### 5.4 Cảnh báo ngân sách
- [x] Màn hình cài đặt budget: input hạn mức tổng tháng, hạn mức theo từng danh mục.
- [x] Component `BudgetProgress`: progress bar với màu động (xanh → vàng → đỏ theo %).
- [x] Logic trigger cảnh báo khi đạt 80% và 100%.
- [x] Banner in-app alert hiển thị sau mỗi lần ghi giao dịch vượt ngưỡng.
- [x] Request push notification permission (với fallback graceful nếu từ chối).

#### 5.5 Danh mục tuỳ chỉnh
- [x] Màn hình quản lý danh mục: danh sách, thêm mới, đổi tên, ẩn.
- [x] Picker emoji cho icon danh mục.
- [x] Không xoá danh mục đã có giao dịch (chỉ ẩn).

#### 5.6 Xuất dữ liệu CSV
- [x] Nút Export trong Settings.
- [x] Lọc khoảng thời gian trước khi export.
- [x] Generate và download file `.csv` phía client.

---

### 6. **UX & Onboarding**
- [x] Màn hình onboarding cho người dùng mới (3 bước: chào mừng → đặt budget → thêm giao dịch đầu tiên).
- [x] Empty state có hướng dẫn khi chưa có giao dịch nào.
- [x] Reminder nhắc export CSV sau 30 ngày (localStorage-based).
- [x] Format hiển thị tiền tệ nhất quán: `50.000 ₫`.
- [x] Responsive đầy đủ: test trên 375px (iPhone SE), 390px (iPhone 14), 414px (Android).

---

### 7. **Kiểm thử & Hoàn thiện**
- [ ] Test toàn bộ CRUD giao dịch (thêm, sửa, xoá, lọc).
- [ ] Test logic tính toán thống kê (tổng thu/chi, số dư, breakdown).
- [ ] Test cảnh báo budget ở các ngưỡng 0%, 80%, 100%, 120%.
- [ ] Test LocalStorage: lưu đúng, đọc đúng sau khi reload trang.
- [ ] Test export CSV: dữ liệu đầy đủ, encoding UTF-8 (tiếng Việt).
- [ ] Kiểm tra hiệu năng: 1000+ giao dịch, danh sách không bị lag.
- [ ] Test trên iOS Safari (14+) và Android Chrome (100+).
- [ ] Test offline: ngắt mạng, app vẫn hoạt động đầy đủ.
- [ ] Lighthouse audit: Performance ≥ 90, Accessibility ≥ 85.

---

### 8. **Triển khai & Tài liệu hóa**
- [ ] Build production: `pnpm run build`, kiểm tra bundle size.
- [ ] Deploy lên Vercel, cấu hình custom domain (nếu có).
- [ ] Viết `README.md` đầy đủ: giới thiệu, hướng dẫn cài đặt, screenshot.
- [ ] Viết `CHANGELOG.md` cho v1.0.
- [ ] Kiểm tra lỗi cuối cùng trên production URL.
- [ ] Đóng gói và tag release `v1.0.0` trên GitHub.