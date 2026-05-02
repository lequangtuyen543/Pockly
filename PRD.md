# PRD — Quản lý tiền cá nhân (Pockly)

> **Phiên bản:** 1.0 (MVP)
> **Cập nhật lần cuối:** 2025
> **Trạng thái:** Draft

---

## 1. Tổng quan

### Vấn đề

Sinh viên và người đi làm trẻ thường không kiểm soát được chi tiêu — không biết mình đã chi bao nhiêu, cho cái gì, và vì sao hết tiền trước cuối tháng. Các ứng dụng tài chính hiện tại thường phức tạp, yêu cầu đăng ký tài khoản hoặc kết nối ngân hàng, khiến người dùng bỏ cuộc sau vài ngày.

### Giải pháp

Web app ghi chép thu/chi đơn giản, khởi động trong vòng 10 giây, không cần tài khoản để bắt đầu sử dụng. Tập trung vào tốc độ nhập liệu và thống kê trực quan.

### Mục tiêu sản phẩm

- Giúp người dùng ghi lại mọi khoản thu/chi trong vòng dưới 3 giây
- Hiển thị trực quan "tiền đi đâu" theo ngày, tuần, tháng
- Cảnh báo khi sắp vượt ngân sách đã đặt ra
- Hoạt động ổn định, không mất dữ liệu, không phụ thuộc internet

---

## 2. Người dùng mục tiêu

| Phân khúc | Đặc điểm | Pain point chính |
|---|---|---|
| Sinh viên đại học | 18–24 tuổi, ngân sách hạn chế, dùng điện thoại nhiều | Không biết tiền tiêu vào đâu, hết tiền bất ngờ |
| Người đi làm mới (1–3 năm) | 22–28 tuổi, thu nhập chưa ổn định | Muốn tiết kiệm nhưng không tracking được |
| Người tự quản lý tài chính | Không muốn dùng app phức tạp, ngại kết nối ngân hàng | Cần công cụ đơn giản, nhanh, riêng tư |

---

## 3. Tính năng

### 3.1 Nhập thu/chi nhanh (P1)

- Form nhập tối giản: số tiền → danh mục → ghi chú ngắn → lưu
- Chọn loại: **Thu** hoặc **Chi** bằng 1 tap
- Bàn phím số hiện ngay khi mở form trên mobile
- Hỗ trợ phím tắt (Enter để lưu nhanh)
- Timestamp tự động, có thể chỉnh lại ngày giờ nếu cần

**Acceptance criteria:**
- Người dùng có thể ghi 1 khoản chi trong ≤ 3 thao tác
- Dữ liệu được lưu ngay lập tức, không cần bấm "save" thêm lần nữa

---

### 3.2 Danh sách giao dịch (P1)

- Xem toàn bộ lịch sử theo thứ tự thời gian ngược
- Lọc theo: ngày / tuần / tháng / danh mục
- Tìm kiếm theo số tiền hoặc ghi chú
- Chỉnh sửa hoặc xoá từng giao dịch
- Hiển thị màu phân biệt: xanh (thu) / đỏ (chi)

**Acceptance criteria:**
- Danh sách load dưới 200ms với 1000 giao dịch
- Có thể xoá giao dịch với confirm dialog để tránh xoá nhầm

---

### 3.3 Biểu đồ thống kê (P1)

- **Tổng quan tháng:** tổng thu, tổng chi, số dư
- **Biểu đồ cột:** chi tiêu theo ngày trong tháng
- **Biểu đồ tròn / donut:** breakdown chi tiêu theo danh mục
- **So sánh tháng:** tháng này vs tháng trước (dạng mini bar)
- Chuyển đổi nhanh giữa các khoảng thời gian: tuần / tháng / 3 tháng

**Acceptance criteria:**
- Biểu đồ render mượt, responsive trên mobile
- Tap vào phần biểu đồ để xem chi tiết danh mục đó

---

### 3.4 Cảnh báo ngân sách (P1)

- Đặt hạn mức chi tiêu theo tháng (tổng hoặc theo từng danh mục)
- Thanh progress bar hiển thị đã dùng bao nhiêu % ngân sách
- Hiển thị banner cảnh báo khi đạt **80%** ngân sách
- Hiển thị banner cảnh báo đỏ khi đạt **100%** (vượt ngân sách)
- Thông báo push notification (nếu trình duyệt cho phép)

**Acceptance criteria:**
- Cảnh báo hiển thị ngay sau khi ghi giao dịch đẩy vượt ngưỡng
- Người dùng có thể tắt cảnh báo hoặc điều chỉnh ngưỡng %

---

### 3.5 Danh mục tuỳ chỉnh (P2)

Danh mục mặc định có sẵn:

- Ăn uống, Đi lại, Nhà ở, Giải trí, Mua sắm, Y tế, Học tập, Khác

Người dùng có thể:
- Thêm danh mục mới với tên và icon emoji tuỳ chọn
- Đổi tên danh mục hiện có
- Ẩn danh mục không dùng (không xoá để tránh mất lịch sử)

---

### 3.6 Xuất dữ liệu CSV (P3)

- Export toàn bộ giao dịch ra file `.csv`
- Lọc theo khoảng thời gian trước khi export
- Format: Ngày, Loại, Danh mục, Số tiền, Ghi chú

---

## 4. Yêu cầu phi chức năng

| Tiêu chí | Mục tiêu |
|---|---|
| Thời gian load lần đầu | < 2 giây trên 4G |
| Ghi 1 giao dịch | ≤ 3 thao tác, ≤ 3 giây |
| Offline | Hoạt động đầy đủ không cần internet |
| Mobile-first | Tối ưu cho màn hình 375px trở lên |
| Dữ liệu | Không gửi lên server, 100% local |
| Dung lượng lưu trữ | Hỗ trợ 10.000+ giao dịch (~3–4 MB) |

---

## 5. Stack kỹ thuật

### Frontend

```
React 18           — UI framework
Vite               — Build tool, dev server nhanh
Tailwind CSS       — Utility-first styling
shadcn/ui          — Component library (Claude design system)
Recharts           — Biểu đồ thống kê
date-fns           — Xử lý thời gian
Zustand            — State management nhẹ
```

### Backend

```
Node.js + Express  — REST API server
```

> **Lưu ý:** MVP sử dụng **LocalStorage** cho dữ liệu client-side. Backend Node.js chuẩn bị sẵn cho v1.1 khi cần sync cloud / multi-device.

### Infra & Tooling

```
Vercel             — Deploy frontend (CI/CD tự động từ GitHub)
GitHub             — Version control
Claude Code        — AI-assisted coding (vibe coding workflow)
ESLint + Prettier  — Code quality
```

### Kiến trúc dữ liệu (LocalStorage)

```json
{
  "transactions": [
    {
      "id": "uuid-v4",
      "type": "expense",
      "amount": 50000,
      "category": "food",
      "note": "Phở sáng",
      "date": "2025-06-15T08:30:00Z",
      "createdAt": "2025-06-15T08:31:00Z"
    }
  ],
  "categories": [...],
  "budgets": {
    "2025-06": {
      "total": 5000000,
      "byCategory": { "food": 1500000 }
    }
  },
  "settings": {
    "currency": "VND",
    "budgetAlertThreshold": 80
  }
}
```

---

## 6. Workflow phát triển với Claude Code

Dự án sử dụng **vibe coding** với Claude Code để tăng tốc phát triển:

### Cách làm việc

1. **Mô tả tính năng bằng ngôn ngữ tự nhiên** cho Claude Code
2. Claude Code **generate code, component, logic** theo yêu cầu
3. Developer **review, test, và tinh chỉnh** output
4. Lặp lại với feedback loop nhanh

### Quy ước prompt cho Claude Code

```
# Ví dụ prompt hiệu quả

"Tạo component TransactionForm với:
- Input số tiền (focus auto, bàn phím số)
- Toggle Thu/Chi
- Dropdown danh mục (lấy từ categories store)
- Input ghi chú optional
- Submit bằng Enter hoặc nút Lưu
- Dùng Tailwind + shadcn/ui
- TypeScript"
```

### File structure gợi ý

```
src/
├── components/
│   ├── transaction/
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   └── TransactionItem.tsx
│   ├── dashboard/
│   │   ├── SummaryCards.tsx
│   │   ├── SpendingChart.tsx
│   │   └── CategoryBreakdown.tsx
│   └── budget/
│       ├── BudgetSetting.tsx
│       └── BudgetProgress.tsx
├── store/
│   ├── transactionStore.ts
│   ├── categoryStore.ts
│   └── budgetStore.ts
├── lib/
│   ├── storage.ts      — LocalStorage helpers
│   ├── calculations.ts — Tính toán thống kê
│   └── export.ts       — CSV export
└── types/
    └── index.ts
```

---

## 7. Milestones & timeline

### Sprint 1 — Tuần 1–2: Core nhập liệu

- [ ] Setup project: Vite + React + Tailwind + shadcn/ui
- [ ] TransactionForm component (nhập thu/chi)
- [ ] LocalStorage layer (save/read/delete)
- [ ] TransactionList với filter theo tháng
- [ ] Responsive mobile layout

**Deliverable:** Người dùng có thể ghi và xem lại giao dịch

---

### Sprint 2 — Tuần 3: Dashboard & thống kê

- [ ] SummaryCards (tổng thu, tổng chi, số dư)
- [ ] Biểu đồ cột chi tiêu theo ngày (Recharts)
- [ ] Biểu đồ tròn breakdown theo danh mục
- [ ] Chuyển đổi tuần/tháng/3 tháng

**Deliverable:** Người dùng thấy được "tiền đi đâu"

---

### Sprint 3 — Tuần 4: Ngân sách & cảnh báo

- [ ] Màn hình đặt budget (tổng tháng + theo danh mục)
- [ ] BudgetProgress bar
- [ ] Logic cảnh báo 80% và 100%
- [ ] Push notification (nếu browser hỗ trợ)

**Deliverable:** Cảnh báo vượt ngân sách hoạt động

---

### Sprint 4 — Tuần 5–6: Polish & launch

- [ ] Danh mục tuỳ chỉnh (thêm/đổi tên/ẩn)
- [ ] Export CSV
- [ ] Test trên iOS Safari + Android Chrome
- [ ] Performance optimization (lazy load, memo)
- [ ] Deploy lên Vercel
- [ ] Onboarding screen cho người dùng mới

**Deliverable:** Production-ready, public URL

---

## 8. Tiêu chí thành công (MVP)

| Metric | Mục tiêu |
|---|---|
| Ghi 1 giao dịch | ≤ 3 giây |
| Load lần đầu | < 2 giây |
| Server calls | 0 (LocalStorage only) |
| Mobile usability | Hoạt động tốt trên iOS Safari & Android Chrome |
| Crash rate | < 1% |
| Dữ liệu bị mất | 0 lần (không tự xoá data) |

---

## 9. Rủi ro & giải pháp

| Rủi ro | Xác suất | Giải pháp |
|---|---|---|
| LocalStorage bị xoá khi clear browser | Trung bình | Nhắc export CSV định kỳ; v1.1 thêm cloud sync |
| Giới hạn dung lượng LocalStorage (~5–10 MB) | Thấp | 5 giao dịch/ngày × 3 năm ≈ < 2 MB, không vấn đề ở MVP |
| Người dùng không duy trì thói quen ghi chép | Cao | Tối giản UI tối đa, nhập bằng số nhanh, không bắt đăng ký |
| Mất dữ liệu khi đổi thiết bị | Cao | Hiển thị warning, export CSV, v1.1 sync cloud |
| Browser không hỗ trợ notification API | Thấp | Fallback sang in-app banner alert |

---

## 10. Ngoài phạm vi MVP (v1.1+)

Các tính năng **không** nằm trong MVP v1.0:

- Đăng nhập / đồng bộ cloud (Google Account, etc.)
- Nhập tự động từ SMS ngân hàng
- Quản lý nhiều tài khoản / ví
- Lập kế hoạch tài chính dài hạn
- Chia sẻ dữ liệu với người khác (gia đình, nhóm)
- Multi-currency (chỉ hỗ trợ VND ở v1.0)
- Dark mode (xem xét sau launch)
- Mobile app native (React Native hoặc PWA cài được)

---

## 11. Open questions

- [ ] Có cần onboarding wizard hướng dẫn đặt budget lần đầu không?
- [ ] Định dạng hiển thị số tiền: `50,000 ₫` hay `50.000 đ`?
- [ ] Cho phép ghi giao dịch recurring (hàng tháng) không?
- [ ] Backup tự động (remind export) sau bao nhiêu ngày?

---

*PRD này được viết cho MVP v1.0. Mọi thay đổi cần được cập nhật vào tài liệu và thông báo cho team.*