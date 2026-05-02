# 🗄 Thiết Kế Dữ Liệu

## Ứng Dụng Quản Lý Thu Chi Cá Nhân (Pockly)

---

## 1. Tổng Quan

Pockly sử dụng **2 lớp lưu trữ dữ liệu**:

### MVP (v1.0) — LocalStorage
- Lưu trữ **toàn bộ dữ liệu** phía client
- Format: **JSON** serialized trong browser's LocalStorage
- Tối đa ~5–10 MB (đủ cho 10.000+ giao dịch)
- **Không có backend** ở MVP

### v1.1+ — Backend + Database
- Frontend: vẫn dùng LocalStorage (offline-first)
- Backend: **Node.js + Express**
- Database: **MongoDB**
- Sync: 2-way sync khi có kết nối internet

Tài liệu này mô tả **cấu trúc dữ liệu cho MVP (LocalStorage)** và chuẩn bị sẵn **schema MongoDB cho v1.1+**.

---

## 2. LocalStorage Schema (MVP v1.0)

### 2.1 Cấu Trúc Tổng Quát

Tất cả dữ liệu được lưu dưới một root object `"pockly"` trong LocalStorage:

```javascript
localStorage.setItem('pockly', JSON.stringify({
  version: "1.0",
  transactions: [...],
  categories: [...],
  budgets: {...},
  settings: {...},
  _metadata: {...}
}))
```

---

### 2.2 Collection: `transactions`

**Mô tả:** Lưu trữ toàn bộ giao dịch thu/chi của người dùng.

**Schema:**

```javascript
{
  transactions: [
    {
      id: "uuid-v4",              // unique identifier
      type: "expense",             // "expense" | "income"
      amount: 50000,               // số tiền (VND), phải > 0
      category: "food",            // danh mục ID hoặc tên
      note: "Phở sáng",            // ghi chú optional
      date: "2025-06-15T08:30:00Z",// ISO 8601 timestamp
      createdAt: "2025-06-15T08:31:00Z",
      updatedAt: "2025-06-15T08:31:00Z"
    },
    {
      id: "uuid-v4",
      type: "income",
      amount: 10000000,
      category: "salary",
      note: "Lương tháng 6",
      date: "2025-06-01T00:00:00Z",
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2025-06-01T10:00:00Z"
    }
  ]
}
```

**Ràng Buộc:**

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| `id` | ✓ | String (UUID v4) | Unique trong toàn bộ transactions |
| `type` | ✓ | String | "expense" hoặc "income" |
| `amount` | ✓ | Number | > 0, không dấu âm |
| `category` | ✓ | String | ID danh mục hoặc tên danh mục |
| `note` | | String | ≤ 500 ký tự, optional |
| `date` | ✓ | String (ISO 8601) | Ngày ghi chép giao dịch |
| `createdAt` | ✓ | String (ISO 8601) | Thời gian tạo bản ghi |
| `updatedAt` | ✓ | String (ISO 8601) | Thời gian cập nhật cuối cùng |

---

### 2.3 Collection: `categories`

**Mô tả:** Danh mục ghi chép giao dịch (mặc định + tùy chỉnh).

**Schema:**

```javascript
{
  categories: [
    // CHI TIÊU
    {
      id: "cat-expense-food",
      name: "Ăn uống",
      emoji: "🍜",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-transport",
      name: "Đi lại",
      emoji: "🚗",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-housing",
      name: "Nhà ở",
      emoji: "🏠",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-entertainment",
      name: "Giải trí",
      emoji: "🎬",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-shopping",
      name: "Mua sắm",
      emoji: "🛍️",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-health",
      name: "Y tế",
      emoji: "⚕️",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-education",
      name: "Học tập",
      emoji: "📚",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-expense-other",
      name: "Khác",
      emoji: "📌",
      type: "expense",
      isDefault: true,
      hidden: false
    },
    
    // THU NHẬP
    {
      id: "cat-income-salary",
      name: "Lương",
      emoji: "💰",
      type: "income",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-income-bonus",
      name: "Thưởng",
      emoji: "🎁",
      type: "income",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-income-extra",
      name: "Ngoài kế hoạch",
      emoji: "📈",
      type: "income",
      isDefault: true,
      hidden: false
    },
    {
      id: "cat-income-other",
      name: "Khác",
      emoji: "📌",
      type: "income",
      isDefault: true,
      hidden: false
    },
    
    // DANH MỤC TÙY CHỈNH (ví dụ)
    {
      id: "uuid-v4",
      name: "Cafe",
      emoji: "☕",
      type: "expense",
      isDefault: false,
      hidden: false
    }
  ]
}
```

**Ràng Buộc:**

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| `id` | ✓ | String | Unique, format: "cat-[type]-[name]" hoặc UUID |
| `name` | ✓ | String | ≤ 50 ký tự |
| `emoji` | | String | 1 emoji, mặc định "📌" |
| `type` | ✓ | String | "expense" hoặc "income" |
| `isDefault` | ✓ | Boolean | true nếu mặc định, false nếu tùy chỉnh |
| `hidden` | ✓ | Boolean | false = hiển thị, true = ẩn |

---

### 2.4 Collection: `budgets`

**Mô tả:** Ngân sách theo tháng và danh mục.

**Schema:**

```javascript
{
  budgets: {
    "2025-06": {
      // Ngân sách tháng 6 năm 2025
      totalBudget: 5000000,     // hạn mức tổng chi tháng này
      byCategory: {
        "cat-expense-food": 1500000,
        "cat-expense-transport": 1000000,
        "cat-expense-shopping": 800000
        // các danh mục khác có thể không được set
      },
      createdAt: "2025-06-01T00:00:00Z",
      updatedAt: "2025-06-15T14:30:00Z"
    },
    "2025-07": {
      totalBudget: 5500000,
      byCategory: {
        "cat-expense-food": 1600000
      },
      createdAt: "2025-07-01T00:00:00Z",
      updatedAt: "2025-07-01T00:00:00Z"
    }
  }
}
```

**Ràng Buộc:**

| Trường | Bắt buộc | Kiểu | Mô tả |
|--------|----------|------|-------|
| Key (month) | ✓ | String | Format: "YYYY-MM" (ISO 8601) |
| `totalBudget` | ✓ | Number | Hạn mức tổng chi, > 0 |
| `byCategory` | | Object | Key = category ID, value = số tiền |

---

### 2.5 Collection: `settings`

**Mô tả:** Cài đặt chung của ứng dụng.

**Schema:**

```javascript
{
  settings: {
    currency: "VND",              // tiền tệ, mặc định VND
    currencyFormat: "50.000 ₫",   // định dạng hiển thị
    budgetAlertThreshold: 80,      // ngưỡng cảnh báo (%), mặc định 80
    language: "vi",                // ngôn ngữ, mặc định "vi" (Tiếng Việt)
    notificationEnabled: true,     // bật/tắt thông báo
    darkMode: false,               // dark mode (v1.1+)
    minTransactionAmount: 1000,    // số tiền tối thiểu (VND)
    lastExportDate: "2025-06-15",  // ngày export CSV cuối cùng
    backupReminder: true,          // nhắc backup
    backupReminderDays: 30         // nhắc sau mỗi N ngày
  }
}
```

**Ràng Buộc:**

| Trường | Bắt buộc | Mặc định | Kiểu | Mô tả |
|--------|----------|----------|------|-------|
| `currency` | ✓ | "VND" | String | Mã ISO 4217 |
| `currencyFormat` | ✓ | "50.000 ₫" | String | Pattern hiển thị tiền |
| `budgetAlertThreshold` | ✓ | 80 | Number | 0–100 (%) |
| `language` | ✓ | "vi" | String | "vi" hoặc "en" |
| `notificationEnabled` | ✓ | true | Boolean | Cho phép push notification |
| `darkMode` | ✓ | false | Boolean | Chế độ tối |
| `minTransactionAmount` | ✓ | 1000 | Number | Số tiền tối thiểu |
| `lastExportDate` | | null | String | Ngày export cuối |

---

### 2.6 Collection: `_metadata`

**Mô tả:** Thông tin meta của LocalStorage.

**Schema:**

```javascript
{
  _metadata: {
    version: "1.0",              // phiên bản schema
    lastSync: "2025-06-15T14:30:00Z", // thời gian sync cuối cùng (v1.1+)
    totalTransactions: 156,       // số lượng transaction
    dataSize: "~2.5 MB",          // dung lượng ước tính
    lastBackup: "2025-06-15",     // ngày backup CSV cuối cùng
    userId: null                  // user ID (khi sync v1.1+)
  }
}
```

---

## 3. MongoDB Schema (v1.1+)

### 3.1 Collection: `users`

**Mô tả:** Tài khoản người dùng.

**Schema:**

```javascript
db.users.insertOne({
  _id: ObjectId("..."),
  username: "john_doe",           // unique
  email: "john@example.com",      // unique
  passwordHash: "$2b$10$...",     // bcrypt hash
  displayName: "John Doe",        // optional
  avatar: "https://...",          // URL, optional
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,                // soft delete
  isActive: true
})
```

---

### 3.2 Collection: `transactions`

**Mô tả:** Giao dịch đồng bộ từ client.

**Schema:**

```javascript
db.transactions.insertOne({
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // reference users
  clientId: "uuid-v4",            // ID từ client, để sync
  type: "expense",                // "expense" | "income"
  amount: 50000,
  categoryId: ObjectId("..."),    // reference categories
  categoryName: "food",           // backup tên (offline support)
  note: "Phở sáng",
  transactionDate: new Date("2025-06-15"),  // ngày ghi chép
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,                // soft delete
  syncedAt: new Date(),           // khi đồng bộ từ client
  isLocal: false                  // true nếu chưa sync, false nếu đã
})
```

---

### 3.3 Collection: `categories`

**Mô tả:** Danh mục giao dịch.

**Schema:**

```javascript
db.categories.insertOne({
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // reference users, null = default category
  name: "Ăn uống",
  emoji: "🍜",
  type: "expense",                // "expense" | "income"
  isDefault: true,
  isHidden: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
})
```

---

### 3.4 Collection: `budgets`

**Mô tả:** Ngân sách theo tháng/người dùng.

**Schema:**

```javascript
db.budgets.insertOne({
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // reference users
  yearMonth: "2025-06",           // format: YYYY-MM
  totalBudget: 5000000,
  budgetByCategory: [
    {
      categoryId: ObjectId("..."),
      categoryName: "food",
      limit: 1500000
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

### 3.5 Collection: `settings`

**Mô tả:** Cài đặt người dùng.

**Schema:**

```javascript
db.settings.insertOne({
  _id: ObjectId("..."),
  userId: ObjectId("..."),        // reference users, null = app-level settings
  currency: "VND",
  language: "vi",
  budgetAlertThreshold: 80,
  notificationEnabled: true,
  darkMode: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 4. Quan Hệ Dữ Liệu

### LocalStorage (MVP)

```
categories (N) ──┐
                 ├─ transactions (N)
budgets ─────────┘

transactions
    └─ date → extract month-year → budgets
```

### MongoDB (v1.1+)

```
users (1) ──── (N) transactions
               ──── (N) categories
               ──── (N) budgets
               ──── (1) settings
```

| Quan hệ | Trường liên kết | Loại |
|--------|-----------------|------|
| users → transactions | `transactions.userId` | 1:N |
| users → categories | `categories.userId` | 1:N |
| users → budgets | `budgets.userId` | 1:N |
| users → settings | `settings.userId` | 1:1 |
| categories → transactions | `transactions.categoryId` | 1:N |
| budgets → categories | Lưu danh sách trong `budgetByCategory` | N:N (denormalized) |

---

## 5. Quy Tắc Thiết Kế

| Quy tắc | Áp dụng | Lý do |
|--------|--------|-------|
| **Tên trường camelCase** | userId, categoryId, transactionDate | Nhất quán với JavaScript/API |
| **Timestamp ISO 8601** | "2025-06-15T08:30:00Z" | Chuẩn quốc tế, dễ parse |
| **ID dạng UUID (client)** | "550e8400-e29b-41d4-a716-446655440000" | Tránh conflict khi sync |
| **Soft delete** | deletedAt (null = not deleted) | Giữ dữ liệu lịch sử |
| **Lưu backup tên** | `categoryName` trong transaction | Offline support, tránh NULL reference |
| **Normalization** | Không nhúng full category vào transaction | Giảm redundancy, dễ update |
| **Pagination metadata** | `_metadata.totalTransactions` | Cache để tính toán thống kê |

---

## 6. Ví Dụ: Luồng Lưu Dữ Liệu

### Scenario: Người dùng ghi giao dịch "Phở sáng 50.000 ₫"

**Bước 1: Client ghi giao dịch → LocalStorage**

```javascript
// Zustand action gọi LocalStorage helper
const newTransaction = {
  id: uuidv4(),
  type: "expense",
  amount: 50000,
  category: "cat-expense-food",
  note: "Phở sáng",
  date: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

storage.addTransaction(newTransaction)
// LocalStorage được cập nhật ngay
```

**Bước 2: Dashboard tính toán real-time**

```javascript
// Zustand selector tính summary
const summary = useTransactionStore(state => {
  const thisMonth = state.transactions.filter(t => 
    t.date >= startOfMonth && t.date <= endOfMonth
  )
  return {
    totalExpense: thisMonth
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    // ...
  }
})
```

**Bước 3: v1.1+ Sync lên Backend (khi online)**

```javascript
// Gọi API
await api.post('/api/transactions', {
  clientId: newTransaction.id,
  ...newTransaction
})
// Backend validate, hash, lưu vào MongoDB
// Response: { serverId: "507f1f77bcf86cd799439011", ... }
// Client cập nhật: transaction.clientId → transaction.serverId
```

---

## 7. Migration Strategy (v1.0 → v1.1)

Khi nâng cấp lên v1.1 với backend:

1. **Client vẫn dùng LocalStorage** — offline-first
2. **Thêm API layer** — kết nối backend
3. **Sync một chiều** → hai chiều:
   - Client → Server: POST new transactions
   - Server → Client: Fetch remote changes
4. **Conflict resolution**: Last-write-wins hoặc user confirm
5. **Backup remote**: Dữ liệu duplicate trên server (safety)

**Schema transition:**

```javascript
// LocalStorage → MongoDB
transaction {
  id: "uuid-v4"           // → clientId
  // + new fields
  serverId: "507f...",    // ObjectId from MongoDB
  syncStatus: "synced",   // "pending" | "synced" | "conflict"
  isLocal: false
}
```

---

## 8. Tiêu Chí Hoàn Thành

Thiết kế dữ liệu được xem là hoàn chỉnh khi:

- ✅ LocalStorage schema **đủ** để implement toàn bộ FR (ghi, sửa, xoá, lọc, thống kê)
- ✅ MongoDB schema **chuẩn bị sẵn** cho v1.1 (không cần thay đổi lớn)
- ✅ Quan hệ dữ liệu rõ ràng, không ambiguous
- ✅ **Offline-first** → **Sync-ready** migration path sạch
- ✅ Tên trường **nhất quán** xuyên suốt client + server
- ✅ Timestamp + ID generation **deterministic** để sync
- ✅ Không có redundancy không cần thiết

---

## 9. Hướng Mở Rộng (v1.2+)

Nếu thêm tính năng mới có thể cần schema mở rộng:

```javascript
// Recurring transactions (giao dịch định kỳ)
recurringTransactions: {
  id: "uuid-v4",
  type: "expense",
  frequency: "monthly",  // "daily" | "weekly" | "monthly" | "yearly"
  amount: 1000000,
  category: "housing",
  startDate: "2025-06-01",
  endDate: null,         // null = vô tận
  nextDate: "2025-07-01"
}

// Tags / Keywords
transactionTags: {
  id: "uuid-v4",
  name: "Office",
  color: "#FF6B6B",
  transactionCount: 5
}

// Notes / Journal (ghi chú chi tiết)
transactionNotes: {
  id: "uuid-v4",
  transactionId: "uuid-v4",
  content: "Mua đồ công văn cho dự án X",
  attachments: [...]
}
```

---

## Tham Chiếu

- [02-requirements.md](./02-requirements.md) — Yêu cầu chức năng
- [prd.md](../prd.md) — Product Requirements Document
- [01-project-overview.md](./01-project-overview.md) — Tổng quan

---

**Tác giả:** [Your Name]  
**Phiên bản:** 1.0 (LocalStorage) / 1.1 (MongoDB ready)  
**Trạng thái:** Phân tích & thiết kế  
**Cập nhật lần cuối:** 2025-06-15  

---

*Thiết kế dữ liệu này được tối ưu cho offline-first, real-time sync, và scalability. Mọi thay đổi phải review kỹ để tránh migration issues.*