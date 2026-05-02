# 📘 Tổng Quan Dự Án

## Ứng Dụng Quản Lý Thu Chi Cá Nhân (Pockly)

---

## 1. Mô Tả Dự Án

**Pockly** là một ứng dụng web đơn giản, nhanh gọn giúp người dùng quản lý thu chi cá nhân. Người dùng có thể ghi chép mọi khoản tiền trong vòng 3 giây, xem thống kê trực quan theo ngày/tuần/tháng, và nhận cảnh báo khi sắp vượt ngân sách.

Dự án được xây dựng nhằm mục đích:
- Luyện tập phát triển fullstack với React + Node.js
- Áp dụng Claude Design System (shadcn/ui + Tailwind CSS)
- Rèn luyện vibe coding workflow với Claude Code
- Tập trung vào UX đơn giản và tốc độ (mobile-first, 375px)

---

## 2. Mục Tiêu Dự Án

### Mục tiêu chức năng
- Xây dựng CRUD hoàn chỉnh cho giao dịch (thu/chi)
- Thống kê dữ liệu và hiển thị biểu đồ trực quan
- Quản lý ngân sách và cảnh báo vượt mức
- Quản lý danh mục giao dịch (có thể tuỳ chỉnh)
- Xuất dữ liệu ra CSV để backup

### Mục tiêu kỹ thuật
- Frontend hoàn toàn hoạt động offline với LocalStorage (MVP)
- Chuẩn bị backend Node.js để sync cloud v1.1+
- Responsive trên mobile (375px — 414px)
- Tối ưu performance: load < 2s, ghi giao dịch < 3s
- Áp dụng Claude Design System (shadcn/ui patterns)

### Mục tiêu học tập
- Thực hành vibe coding: describe → generate → iterate với Claude Code
- Hiểu cấu trúc fullstack: frontend state (Zustand) ↔ backend API
- Thực hành design thinking trước khi code (PRD → prototype → code)

---

## 3. Đối Tượng Sử Dụng

| Phân khúc | Đặc điểm | Nhu cầu chính |
|---|---|---|
| **Sinh viên (18–24)** | Ngân sách hạn chế, dùng điện thoại nhiều | Ghi chép nhanh, biết tiền tiêu vào đâu |
| **Người đi làm mới (22–28)** | Thu nhập chưa ổn định, muốn tiết kiệm | Tracking chi tiêu, lập kế hoạch ngân sách |
| **Người tự quản lý tài chính** | Không tin tưởng ứng dụng phức tạp | Công cụ đơn giản, riêng tư, offline |

---

## 4. Chức Năng Chính

### 4.1 Nhập thu/chi nhanh (P1 — Sprint 1)
- Form tối giản: chọn loại (Thu/Chi) → số tiền → danh mục → ghi chú → lưu
- Hoàn thành trong ≤ 3 thao tác, ≤ 3 giây
- Bàn phím số hiển thị tự động trên mobile
- Timestamp tự động, có thể chỉnh lại ngày giờ
- Dữ liệu lưu ngay vào LocalStorage (không cần "save" thêm)

### 4.2 Danh sách giao dịch (P1 — Sprint 1)
- Xem lịch sử giao dịch theo thứ tự thời gian ngược
- Lọc theo: ngày / tuần / tháng / danh mục
- Tìm kiếm theo số tiền hoặc ghi chú
- Màu phân biệt: xanh (thu) / đỏ (chi)
- Sửa / xoá từng giao dịch với confirm dialog
- Swipe-to-delete hoặc long-press menu trên mobile

### 4.3 Biểu đồ thống kê (P1 — Sprint 2)
- **Summary cards**: tổng thu, tổng chi, số dư tháng này
- **Biểu đồ cột**: chi tiêu theo ngày (7 ngày gần nhất hoặc toàn tháng)
- **Biểu đồ tròn/donut**: breakdown chi tiêu theo danh mục
- **So sánh tháng**: mini bar tháng này vs tháng trước
- Chuyển đổi khoảng thời gian: tuần / tháng / 3 tháng (tabs hoặc dropdown)
- Tap vào phần biểu đồ để xem chi tiết danh mục đó

### 4.4 Cảnh báo ngân sách (P1 — Sprint 3)
- Đặt hạn mức chi tiêu tổng tháng
- Tùy chọn: đặt hạn mức theo từng danh mục
- Progress bar động: xanh → vàng (80%) → đỏ (100%+)
- Cảnh báo banner khi đạt 80% và 100%
- Push notification (nếu browser cho phép, fallback in-app alert)
- Người dùng có thể điều chỉnh ngưỡng cảnh báo

### 4.5 Danh mục tuỳ chỉnh (P2 — Sprint 4)
- Danh mục mặc định: Ăn uống, Đi lại, Nhà ở, Giải trí, Mua sắm, Y tế, Học tập, Khác
- Thêm danh mục mới với tên + icon emoji
- Đổi tên danh mục hiện có
- Ẩn danh mục không dùng (không xoá để bảo toàn lịch sử)
- Danh mục hiển thị trong dropdown khi nhập giao dịch

### 4.6 Xuất dữ liệu CSV (P3 — Sprint 4)
- Export toàn bộ giao dịch hoặc lọc theo khoảng thời gian
- Format CSV: Ngày, Loại (Thu/Chi), Danh mục, Số tiền, Ghi chú
- Encoding UTF-8 (hỗ trợ tiếng Việt)
- Download file về máy

### 4.7 Onboarding & UX (P2 — Sprint 5)
- Màn hình welcome cho người dùng mới (3 bước)
- Empty state có hướng dẫn
- Reminder export CSV sau 30 ngày
- Format hiển thị tiền tệ nhất quán: `50.000 ₫`

---

## 5. Công Nghệ Sử Dụng

### Frontend (MVP)
```
React 18          — UI framework
Vite              — Build tool
Tailwind CSS      — Utility-first CSS
shadcn/ui         — Component library (Claude Design System)
Recharts          — Biểu đồ thống kê
Zustand           — State management
date-fns          — Xử lý thời gian
TypeScript        — Type safety
```

### Backend (Chuẩn bị cho v1.1)
```
Node.js           — JavaScript runtime
Express           — Web framework
TypeScript        — Type safety
REST API          — HTTP endpoints
```

### Data Storage (MVP)
```
LocalStorage      — Client-side storage, 100% offline
```

### Infra & Tooling
```
Vercel            — Deploy frontend
GitHub            — Version control
Claude Code       — AI-assisted vibe coding
ESLint + Prettier — Code quality
```

---

## 6. Kiến Trúc Hệ Thống

### MVP (v1.0) — LocalStorage-First

```
┌─────────────────────────┐
│   React Frontend        │
│  (Vite + Tailwind)      │
├─────────────────────────┤
│  Zustand Stores         │
│  - transactionStore     │
│  - categoryStore        │
│  - budgetStore          │
├─────────────────────────┤
│  LocalStorage API       │
│  (CRUD helpers)         │
├─────────────────────────┤
│  Browser LocalStorage   │
│  (JSON serialized)      │
└─────────────────────────┘
```

**Luồng dữ liệu:**
1. Người dùng ghi giao dịch → Form component
2. Submit → Zustand store action
3. Store tính toán (tổng, breakdown, cảnh báo)
4. LocalStorage helper lưu JSON
5. Component re-render với dữ liệu mới

### v1.1+ — Với Backend Sync

```
Frontend (LocalStorage)
        ↓ (API call)
Node.js Backend (Express)
        ↓
MongoDB Database
```

**Backend endpoints (chuẩn bị sẵn):**
- `POST /api/transactions` — tạo giao dịch
- `GET /api/transactions` — lấy danh sách
- `PUT /api/transactions/:id` — sửa
- `DELETE /api/transactions/:id` — xoá
- `GET /api/categories` — danh mục
- `GET /api/budgets/:month` — ngân sách
- `GET /api/stats/:month` — thống kê

---

## 7. Data Schema (LocalStorage)

### Cấu trúc JSON trong LocalStorage

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
  "categories": [
    {
      "id": "uuid-v4",
      "name": "Ăn uống",
      "emoji": "🍜",
      "hidden": false
    }
  ],
  "budgets": {
    "2025-06": {
      "totalBudget": 5000000,
      "byCategory": {
        "food": 1500000,
        "transport": 1000000
      }
    }
  },
  "settings": {
    "currency": "VND",
    "budgetAlertThreshold": 80,
    "lastExportDate": "2025-06-15"
  }
}
```

---

## 8. Phạm Vi Dự Án

### Bao Gồm (MVP v1.0)
✅ CRUD giao dịch (thu/chi)  
✅ LocalStorage lưu trữ đầy đủ  
✅ Danh sách giao dịch với lọc/tìm kiếm  
✅ Biểu đồ thống kê (cột, tròn, so sánh tháng)  
✅ Cảnh báo ngân sách (banner + notification)  
✅ Quản lý danh mục (thêm/đổi tên/ẩn)  
✅ Xuất CSV  
✅ Responsive mobile (375px–414px)  
✅ Offline-first hoạt động đầy đủ  

### Chưa Bao Gồm (v1.1+)
❌ Đăng nhập / đồng bộ cloud  
❌ Multi-device sync  
❌ Nhập tự động từ SMS ngân hàng  
❌ Quản lý nhiều ví / tài khoản  
❌ Lập kế hoạch tài chính dài hạn  
❌ Share dữ liệu với người khác  
❌ Multi-currency (chỉ VND ở MVP)  
❌ Dark mode (có thể làm sau)  
❌ Mobile app native  

---

## 9. Hướng Phát Triển Tương Lai

### Phase 2 (v1.1) — Cloud Sync
- Backend Node.js hoạt động
- MongoDB database
- Authentication JWT
- Multi-device sync
- Export PDF (ngoài CSV)

### Phase 3 (v1.2) — Nâng cao
- Lập kế hoạch tài chính (goals)
- Quản lý nợ / cho vay
- Biểu đồ trend chi tiêu theo năm
- Dark mode
- PWA (cài được trên home screen)

### Phase 4 (v2.0) — Advanced
- Nhập tự động từ ngân hàng (API banking)
- Tags + search nâng cao
- Sharing chi tiêu nhóm / gia đình
- AI recommendation ("chi tiêu đang tăng ở danh mục X")

---

## 10. Phương Pháp Phát Triển (Vibe Coding)

1. **Describe (Mô tả)** — Viết prompt chi tiết cho Claude Code
2. **Generate (Tạo)** — Claude Code sinh component/logic
3. **Review (Xem xét)** — Developer kiểm tra output
4. **Iterate (Lặp)** — Feedback → refine → loop lại

### Ví dụ workflow
```
Prompt: "Tạo TransactionForm component với..."
     ↓
Claude Code generate → TransactionForm.tsx
     ↓
Dev review & test
     ↓
"Thêm animation khi submit" → refine prompt
     ↓
Loop cho feature tiếp theo
```

### Lợi ích
- ⚡ Tốc độ phát triển nhanh (sprint 1 tuần)
- 🎨 Consistent UI (shadcn/ui + Tailwind)
- 🧠 Học từ generated code
- 🔄 Dễ refactor / adjust requirement

---

## 11. Tiêu Chí Thành Công

| Tiêu chí | Mục tiêu |
|---|---|
| Ghi 1 giao dịch | ≤ 3 thao tác, ≤ 3 giây |
| Load lần đầu | < 2 giây (4G) |
| Offline hoạt động | 100%, không gọi API |
| Mobile usability | Mượt trên iOS Safari 14+ & Android Chrome 100+ |
| Data persistence | Không tự xoá data, hỗ trợ 10.000+ giao dịch |
| Crash rate | < 1% |
| Lighthouse | Performance ≥ 90, Accessibility ≥ 85 |

---

## 12. Timeline & Milestones

| Sprint | Tuần | Deliverable |
|---|---|---|
| 1 | 1–2 | Core nhập liệu + danh sách |
| 2 | 3 | Dashboard + biểu đồ thống kê |
| 3 | 4 | Ngân sách + cảnh báo |
| 4 | 5–6 | Polish + deploy v1.0 |

---

## 13. Mục Đích Thực Hiện Dự Án

### Học tập & Rèn luyện
- Phát triển fullstack (React + Node.js)
- Design thinking trước code (PRD → prototype → implement)
- Vibe coding workflow (describe → generate → iterate)
- State management (Zustand)
- Responsive design & mobile UX

### Thực hành
- Áp dụng Claude Design System
- Tư duy offline-first (LocalStorage)
- Performance optimization (< 2s load, < 3s transaction)
- Git workflow & GitHub collaboration

### Portfolio
- Hoàn thành sản phẩm MVP
- Deploy public URL (Vercel)
- README + tài liệu chi tiết
- Chuẩn bị cho phỏng vấn / internship

---

## 14. Tài Liệu Liên Quan

- [PRD](../prd.md) — Product Requirements Document
- [TODO](../TODO.md) — Kế hoạch phát triển chi tiết
- [Database Design](./02-data-design.md) — Schema & relationships
- [API Design](./03-api-design.md) — REST endpoints & responses
- [UI Structure](./04-ui-structure.md) — Component tree & layouts
- [System Flow](./05-system-flow.md) — Luồng dữ liệu & logic

---

**Tác giả:** [Your Name]  
**Phiên bản:** 1.0  
**Trạng thái:** Phân tích & thiết kế  
**Cập nhật lần cuối:** 2025-06-15  

---

*Tài liệu này được cập nhật theo tiến độ dự án. Mọi thay đổi phải được ghi lại và thông báo cho team.*