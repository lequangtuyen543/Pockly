# 📋 Yêu Cầu Hệ Thống

## Ứng Dụng Quản Lý Thu Chi Cá Nhân (Pockly)

---

## 1. Giới Thiệu

Tài liệu này mô tả chi tiết các yêu cầu chức năng (Functional Requirements) và yêu cầu phi chức năng (Non-Functional Requirements) của Pockly.

Mục tiêu của tài liệu:
- Đảm bảo hệ thống được xây dựng đúng mục tiêu
- Không thiếu tính năng quan trọng
- Hạn chế thay đổi requirement trong quá trình phát triển
- Yêu cầu thống nhất với thiết kế dữ liệu (LocalStorage schema + Backend API)

---

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### 2.1 Quản Lý Giao Dịch (Transactions)

#### FR-01: Tạo giao dịch (Create Transaction)
- Người dùng có thể tạo giao dịch mới (thu hoặc chi).
- Bắt buộc: `type` (expense/income), `amount` (số tiền), `date` (ngày giao dịch).
- Tùy chọn: `category` (danh mục), `note` (ghi chú).
- Hệ thống tự thêm `id` (UUID), `createdAt` (thời gian tạo).
- Giao dịch được lưu ngay vào **LocalStorage** (không cần API ở MVP).
- Thực hiện trong ≤ 3 giây, ≤ 3 thao tác.

#### FR-02: Xem danh sách giao dịch (List Transactions)
- Người dùng có thể xem toàn bộ giao dịch của mình theo thứ tự thời gian ngược (mới nhất trước).
- Hỗ trợ lọc theo:
  - **Khoảng thời gian**: ngày / tuần / tháng / tùy chọn
  - **Loại**: Thu hoặc Chi
  - **Danh mục**: Lọc theo từng danh mục cụ thể
- Hỗ trợ tìm kiếm: theo số tiền, ghi chú, hoặc danh mục.
- Kết quả hiển thị nhanh (< 500ms) ngay cả với 1000+ giao dịch.

#### FR-03: Xem chi tiết giao dịch (Detail)
- Người dùng có thể xem đầy đủ thông tin của một giao dịch.
- Hiển thị: loại, số tiền, danh mục, ghi chú, ngày, thời gian tạo.

#### FR-04: Chỉnh sửa giao dịch (Edit)
- Người dùng có thể sửa bất kỳ trường nào của giao dịch đã tạo.
- Cập nhật lại `updatedAt` khi chỉnh sửa.
- Lưu thay đổi ngay vào LocalStorage.

#### FR-05: Xóa giao dịch (Delete)
- Người dùng có thể xóa giao dịch của mình.
- **Xóa vật lý** khỏi LocalStorage (không cần soft delete ở MVP).
- Hiển thị confirm dialog trước khi xóa để tránh xóa nhầm.
- Hỗ trợ undo hoặc khôi phục trong 5 giây (optional).

---

### 2.2 Quản Lý Danh Mục (Categories)

#### FR-06: Danh mục mặc định
- Hệ thống cung cấp danh mục mặc định:
  - **Chi**: Ăn uống 🍜, Đi lại 🚗, Nhà ở 🏠, Giải trí 🎬, Mua sắm 🛍️, Y tế ⚕️, Học tập 📚, Khác 📌
  - **Thu**: Lương 💰, Thưởng 🎁, Ngoài kế hoạch 📈, Khác 📌
- Danh mục mặc định không thể xóa, chỉ có thể ẩn.

#### FR-07: Thêm danh mục tùy chỉnh (Create Custom Category)
- Người dùng có thể tạo danh mục mới với:
  - **Tên** (bắt buộc, ≤ 50 ký tự)
  - **Icon/Emoji** (tuỳ chọn, mặc định 📌)
  - **Loại**: Thu hoặc Chi (bắt buộc)
- Danh mục tùy chỉnh lưu vào LocalStorage, riêng biệt với danh mục mặc định.

#### FR-08: Chỉnh sửa danh mục (Edit Category)
- Người dùng có thể đổi tên hoặc icon của danh mục tùy chỉnh.
- Không thể đổi loại (Thu/Chi) sau khi tạo.

#### FR-09: Ẩn/hiển thị danh mục (Hide/Show)
- Người dùng có thể ẩn danh mục không dùng.
- Danh mục ẩn không hiển thị trong dropdown khi nhập giao dịch.
- Giao dịch cũ của danh mục ẩn vẫn giữ nguyên, nhưng danh mục sẽ hiển thị tên mặc định hoặc "Khác".

#### FR-10: Xóa danh mục tùy chỉnh (Delete)
- Người dùng có thể xóa danh mục tùy chỉnh **nếu không có giao dịch nào sử dụng**.
- Nếu có giao dịch sử dụng, hệ thống gợi ý ẩn thay vì xóa.

---

### 2.3 Quản Lý Ngân Sách (Budget)

#### FR-11: Đặt hạn mức ngân sách tổng tháng (Set Monthly Budget)
- Người dùng có thể đặt hạn mức chi tiêu **tổng** cho mỗi tháng.
- Mỗi tháng có một hạn mức riêng (lưu theo year-month key, ví dụ: `2025-06`).
- Hạn mức có thể được cập nhật hoặc reset bất kỳ lúc nào.

#### FR-12: Đặt hạn mức theo danh mục (Per-Category Budget)
- Tùy chọn: người dùng có thể đặt hạn mức **riêng cho từng danh mục**.
- Nếu đặt hạn mục, tổng hạn mục không được vượt quá hạn mức tổng tháng (gợi ý, không bắt buộc).

#### FR-13: Theo dõi tiến độ ngân sách (Budget Progress)
- Hệ thống tự động tính toán:
  - **% đã dùng** = (tổng chi tháng) / (hạn mức) × 100
  - **Số tiền còn lại** = hạn mức - tổng chi tháng
- Hiển thị progress bar động: xanh (0–79%) → vàng (80–99%) → đỏ (100%+).
- Tính toán real-time khi có giao dịch mới.

#### FR-14: Cảnh báo vượt ngân sách (Budget Alert)
- Khi giao dịch mới đẩy chi tiêu **≥ 80%** hạn mức:
  - Hiển thị **banner cảnh báo vàng** ("Sắp vượt ngân sách")
  - Yêu cầu push notification (với fallback in-app alert)
- Khi giao dịch mới đẩy chi tiêu **≥ 100%** hạn mức:
  - Hiển thị **banner cảnh báo đỏ** ("Đã vượt ngân sách")
  - Push notification + audio feedback (tuỳ chọn)
- Cảnh báo hiển thị ngay sau khi ghi giao dịch, trước khi quay về danh sách.

#### FR-15: Điều chỉnh ngưỡng cảnh báo (Customize Alert Threshold)
- Người dùng có thể thay đổi ngưỡng cảnh báo mặc định (80%):
  - Ví dụ: đặt thành 70%, 90%, hoặc tắt cảnh báo hoàn toàn.
- Cài đặt này lưu vào LocalStorage `settings`.

---

### 2.4 Thống Kê & Biểu Đồ (Statistics & Charts)

#### FR-16: Tóm tắt tháng (Monthly Summary)
- Hiển thị 4 thẻ thông tin chính:
  - **Tổng thu**: tổng tất cả giao dịch loại `income`
  - **Tổng chi**: tổng tất cả giao dịch loại `expense`
  - **Số dư**: tổng thu - tổng chi
  - **Ngân sách**: hạn mức còn lại (hoặc % đã dùng)
- Tính toán cho tháng hiện tại hoặc tháng được chọn.
- Cập nhật real-time khi có giao dịch mới.

#### FR-17: Biểu đồ chi tiêu theo ngày (Daily Spending Chart)
- Hiển thị **biểu đồ cột** chi tiêu từng ngày trong khoảng thời gian chọn.
- Hỗ trợ khoảng thời gian:
  - **7 ngày gần nhất** (mặc định)
  - **Toàn tháng**
  - **Quý** (3 tháng)
  - **Năm**
- Trục X: ngày, Trục Y: số tiền (VND).
- Tap vào cột để xem chi tiết giao dịch của ngày đó.

#### FR-18: Biểu đồ breakdown theo danh mục (Category Breakdown)
- Hiển thị **biểu đồ tròn hoặc donut** chia chi tiêu theo danh mục.
- Hiển thị **phần trăm** và **số tiền** cho từng danh mục.
- Hiển thị danh sách bảng dưới biểu đồ: danh mục | % | số tiền | progress bar.
- Tap vào danh mục để lọc danh sách giao dịch của danh mục đó.

#### FR-19: So sánh tháng (Month-over-Month Comparison)
- Hiển thị **mini bar chart** so sánh tổng chi tháng này vs tháng trước.
- Hiển thị % tăng/giảm (ví dụ: "+15%" hoặc "-8%").
- Tap để xem chi tiết trend hàng tháng (optional).

#### FR-20: Chuyển đổi khoảng thời gian (Time Range Toggle)
- Giao diện có tab hoặc dropdown chuyển đổi giữa:
  - Hôm nay, Tuần này, Tháng này, Quý, Năm, Tùy chọn (date picker)
- Tất cả biểu đồ và summary cập nhật khi thay đổi khoảng thời gian.

---

### 2.5 Xuất Dữ Liệu (Data Export)

#### FR-21: Xuất CSV
- Người dùng có thể xuất toàn bộ giao dịch hoặc lọc theo khoảng thời gian.
- Format CSV: `Ngày, Loại, Danh mục, Số tiền, Ghi chú`
- Ví dụ:
  ```csv
  2025-06-15,Chi,Ăn uống,50000,Phở sáng
  2025-06-15,Thu,Lương,10000000,Lương tháng 6
  ```
- Encoding UTF-8 (hỗ trợ tiếng Việt).
- Tên file: `pockly-export-YYYY-MM-DD.csv`.
- Download phía client, không cần server.

#### FR-22: Backup dữ liệu
- Gợi ý export CSV định kỳ (ví dụ: mỗi 30 ngày).
- Reminder notification: "Bạn chưa backup 30 ngày rồi, hãy xuất CSV".
- Cho phép người dùng hoãn lại reminder.

---

### 2.6 Cài Đặt & Tuỳ Chỉnh (Settings)

#### FR-23: Thông tin cá nhân (User Profile)
- Người dùng có thể xem và cập nhật thông tin cá nhân:
  - **Tên hiển thị** (optional)
  - **Email** (hiển thị, không có tùy chọn đổi ở MVP)
  - **Avatar** (URL, tuỳ chọn)
  - **Mata khẩu** (xem FR-24)
- Lưu vào LocalStorage.

#### FR-24: Đổi mật khẩu (Change Password)
- Người dùng có thể thay đổi mật khẩu.
- Yêu cầu:
  - **Mật khẩu cũ** (xác thực)
  - **Mật khẩu mới** (≥ 6 ký tự)
  - **Xác nhận mật khẩu mới**
- Nếu mật khẩu cũ sai, hiển thị lỗi.
- Nếu thành công, yêu cầu đăng nhập lại (optional).

> **Note:** Ở MVP, không có hash mật khẩu (lưu plaintext). Ở v1.1+, integrate Backend + bcrypt.

#### FR-25: Cài đặt chung (App Settings)
- Người dùng có thể tuỳ chỉnh:
  - **Tiền tệ**: VND (mặc định, v1.1+ hỗ trợ USD, EUR, etc.)
  - **Định dạng hiển thị tiền**: `50.000 ₫` (mặc định)
  - **Ngôn ngữ**: Tiếng Việt (mặc định), English (optional)
  - **Thông báo**: bật/tắt push notification, cảnh báo
  - **Ngưỡng cảnh báo**: 80% (mặc định), tuỳ chỉnh
  - **Dark mode**: bật/tắt (v1.1+)
- Lưu vào LocalStorage `settings`.

#### FR-26: Quản lý dữ liệu (Data Management)
- Nút **"Xoá tất cả dữ liệu"**: xoá toàn bộ giao dịch, danh mục, ngân sách (confirm dialog).
- Nút **"Import từ CSV"**: cho phép tải file CSV và import giao dịch (v1.1+, optional).
- Nút **"Export toàn bộ"**: export settings, categories, transactions (JSON format, optional).

---

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 3.1 Hiệu Năng (Performance)

#### NFR-01: Tốc độ ghi giao dịch
- Thời gian từ bấm submit đến lưu xong: **≤ 3 giây** (điều kiện bình thường).
- Animation feedback: ≤ 500ms.

#### NFR-02: Tốc độ load
- Load lần đầu (cold start): **< 2 giây** (trên mạng 4G).
- Chuyển tab/trang: **< 500ms**.
- Danh sách 1000+ giao dịch: scroll mượt không lag.

#### NFR-03: Lighthouse Score
- **Performance**: ≥ 90
- **Accessibility**: ≥ 85
- **Best Practices**: ≥ 90
- **SEO**: ≥ 85 (nếu có trang landing)

#### NFR-04: Kích thước bundle
- Bundle chính: < 150 KB (gzipped)
- Tối ưu được Tree-shaking, code-splitting cho các tính năng optional

---

### 3.2 Khả Dụng (Availability)

#### NFR-05: Offline-first
- Ứng dụng hoạt động **100% offline** mà không cần internet.
- Tất cả dữ liệu được lưu LocalStorage.
- Khi có kết nối, có thể sync với backend (v1.1+).

#### NFR-06: Dung lượng lưu trữ
- Hỗ trợ tối thiểu **10.000 giao dịch** (~3–4 MB LocalStorage).
- LocalStorage hạn chế ~5–10 MB (browser-dependent), đủ cho MVP.
- Khi gần đầy, gợi ý export / upgrade v1.1 cloud sync.

#### NFR-07: Data Persistence
- Dữ liệu không bị xoá tự động khi refresh trang (trừ khi user clear browser data).
- Nhắc user export CSV định kỳ để backup.

---

### 3.3 Bảo Mật (Security)

#### NFR-08: Lưu trữ mật khẩu
- **MVP**: Lưu plaintext LocalStorage (demo only, không dùng trong production).
- **v1.1+**: Hash bcrypt trên backend, không lưu plaintext.

#### NFR-09: Dữ liệu cá nhân
- Tất cả dữ liệu lưu **LOCAL** (không gửi lên server ở MVP).
- Khi đăng nhập (v1.1+), sử dụng HTTPS + JWT.

#### NFR-10: Validate input
- Validate client-side: số tiền ≥ 0, danh mục valid, ghi chú ≤ 500 ký tự.
- Gợi ý số tiền: tối thiểu 1.000 VND.

---

### 3.4 Usability (Khả Năng Sử Dụng)

#### NFR-11: Mobile-first
- Giao diện tối ưu cho mobile **375px–414px** (focus iPhone SE, iPhone 14, Android).
- Desktop view (> 768px) được responsive nhưng không phải ưu tiên.
- Touch targets ≥ 44x44px (WCAG).

#### NFR-12: Accessibility
- Hỗ trợ screen reader (ARIA labels, semantic HTML).
- Contrast tối thiểu 4.5:1 (WCAG AA).
- Hỗ trợ keyboard navigation.

#### NFR-13: Responsiveness
- Danh sách giao dịch scroll mượt kể cả 1000+ bản ghi.
- Biểu đồ responsive, không overflow.
- Form input tự động focus bàn phím số trên mobile.

#### NFR-14: UX Consistency
- Sử dụng **Claude Design System** (shadcn/ui + Tailwind).
- Màu sắc nhất quán: xanh (thu), đỏ (chi), xám (trung tính).
- Font: system-ui hoặc Inter.
- Spacing: 8px grid, 16px padding.

---

### 3.5 Maintainability (Khả Năng Bảo Trì)

#### NFR-15: Code structure
- Tách riêng: component, store (Zustand), lib (helpers), types (TypeScript).
- Tên file & hàm rõ ràng, dễ hiểu.
- Component reusable, không duplicate.

#### NFR-16: Error handling
- Catch lỗi tập trung (error boundary, try-catch).
- Hiển thị thông báo lỗi user-friendly.
- Ghi log errors (console ở MVP, cloud ở v1.1+).

#### NFR-17: Documentation
- README hướng dẫn cài đặt & sử dụng.
- Inline comments cho logic phức tạp.
- Commit messages theo convention (feat, fix, docs, etc.).

---

### 3.6 Compatibility (Tương Thích)

#### NFR-18: Browser support
- **iOS Safari**: 14.x trở lên
- **Android Chrome**: 100+ (hoặc 90+ với fallback)
- **Desktop**: Chrome, Firefox, Safari, Edge (mới nhất)

#### NFR-19: OS support
- **iOS**: 14+
- **Android**: 10+ (API 29+)
- **Desktop**: Windows 10+, macOS 10.14+, Linux (modern)

---

## 4. Phạm Vi Dự Án

### 4.1 Bao Gồm (MVP v1.0)

✅ **Nhập liệu:**
- Tạo/sửa/xoá giao dịch
- Nhập nhanh < 3 giây, ≤ 3 thao tác

✅ **Quản lý danh mục:**
- Danh mục mặc định có sẵn
- Thêm/sửa/ẩn danh mục tùy chỉnh

✅ **Ngân sách:**
- Đặt hạn mức tháng
- Cảnh báo khi vượt 80% / 100%

✅ **Thống kê:**
- Summary tháng (thu, chi, số dư)
- Biểu đồ cột, tròn, so sánh tháng
- Lọc theo khoảng thời gian

✅ **Xuất dữ liệu:**
- Export CSV

✅ **Cài đặt:**
- Tuỳ chỉnh ngưỡng cảnh báo
- Tuỳ chỉnh format tiền tệ
- Đổi mật khẩu (plaintext MVP)

✅ **UX:**
- Mobile-first (375px–414px)
- Offline-first, LocalStorage 100%
- Responsive, accessible

### 4.2 Chưa Bao Gồm (v1.1+)

❌ Đăng nhập / account sync  
❌ Nhập tự động từ SMS / API ngân hàng  
❌ Quản lý nhiều ví / tài khoản  
❌ Lập kế hoạch tiết kiệm  
❌ Chia sẻ dữ liệu  
❌ Multi-currency (chỉ VND)  
❌ Dark mode  
❌ Mobile app native  
❌ Bình luận / ghi chú chi tiết  
❌ Hình ảnh / receipt scanning  

---

## 5. Giả Định & Ràng Buộc

### 5.1 Giả Định

- Người dùng có trình duyệt hiện đại (Chrome, Safari, Firefox).
- Người dùng có kết nối internet ít nhất lần đầu tiên (download app).
- Người dùng không clear browser data thường xuyên.
- Dữ liệu lưu LocalStorage không bị mất vì thiếu storage space.

### 5.2 Ràng Buộc

- **Frontend:**
  - React 18+ (TypeScript)
  - Vite (build tool)
  - Tailwind CSS + shadcn/ui (UI library)
  - Zustand (state management)
  - Recharts (charts)
  - date-fns (datetime)
  - LocalStorage API (data storage)

- **Backend (Chuẩn bị):**
  - Node.js + Express
  - TypeScript
  - MongoDB (v1.1+)

- **Data Storage:**
  - LocalStorage (MVP) — ~5–10 MB max
  - Backend (v1.1+) — MongoDB

- **Deployment:**
  - Frontend: Vercel (CI/CD tự động)
  - Backend: Railway / Render / Heroku (v1.1+)

---

## 6. Tiêu Chí Hoàn Thành (Acceptance Criteria)

Hệ thống **MVP v1.0** được xem là hoàn thành khi:

✅ Người dùng có thể ghi giao dịch trong ≤ 3 giây, ≤ 3 thao tác  
✅ LocalStorage lưu & đọc dữ liệu chính xác, không mất dữ liệu  
✅ Danh sách giao dịch lọc, tìm kiếm hoạt động chính xác  
✅ Biểu đồ thống kê tính toán & render đúng  
✅ Cảnh báo ngân sách trigger tại đúng ngưỡng (80%, 100%)  
✅ Export CSV có format đúng, encoding UTF-8  
✅ Giao diện responsive trên mobile (375px–414px)  
✅ Offline hoạt động 100% mà không lỗi  
✅ Lighthouse: Performance ≥ 90, Accessibility ≥ 85  
✅ Không có lỗi console, warning cảnh báo tối thiểu  
✅ Danh mục custom lưu & hiển thị đúng  
✅ Cài đặt (ngưỡng, format tiền tệ) áp dụng đúng  

---

## 7. Dependencies & Libraries

### Frontend

| Library | Version | Mục đích |
|---------|---------|---------|
| React | 18+ | UI framework |
| React Router | 6+ | Client routing |
| Zustand | 4+ | State management |
| Tailwind CSS | 3+ | Styling |
| shadcn/ui | Latest | Component library |
| Recharts | 2+ | Charts |
| date-fns | 3+ | Date utilities |
| uuid | 9+ | ID generation |
| clsx | 2+ | Conditional classNames |

### Development

| Tool | Mục đích |
|------|---------|
| Vite | Build & dev server |
| TypeScript | Type safety |
| ESLint | Code quality |
| Prettier | Code formatting |
| Vitest (optional) | Unit testing |

---

## 8. Tham Chiếu

- [01-project-overview.md](./01-project-overview.md) — Tổng quan dự án
- [prd.md](../prd.md) — Product Requirements Document
- [TODO.md](../TODO.md) — Kế hoạch phát triển
- [02-data-design.md](./02-data-design.md) — Thiết kế dữ liệu LocalStorage
- [03-api-design.md](./03-api-design.md) — API endpoints (v1.1+)

---

**Tác giả:** [Your Name]  
**Phiên bản:** 1.0  
**Trạng thái:** Giai đoạn phân tích & thiết kế  
**Cập nhật lần cuối:** 2025-06-15  

---

*Tài liệu này sẽ được cập nhật khi có thay đổi requirement. Mọi thay đổi phải được phê duyệt trước khi implement.*