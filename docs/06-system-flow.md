# 🔄 System Flow

## Pockly — Personal Finance Management

---

# 1. Tổng Quan Luồng Hệ Thống

Hệ thống hoạt động theo mô hình **offline-first**:

Client (ReactJS SPA)
↓ (LocalStorage - MVP)
Local Database (Browser)
↓ (optional v1.1+)
API Server (NodeJS + Express `/api/v1`)
↓
Database (MongoDB)

---

## Chuẩn dữ liệu (Local-first)

MVP **không gọi API**, toàn bộ flow:

```
User Action → Zustand Store → LocalStorage → UI Re-render
```

---

## Chuẩn API (v1.1+)

```
{
  code: Int,
  message: String,
  data: Object || Array || null
}
```

---

## Nguyên tắc cốt lõi

* ⚡ Ghi dữ liệu ngay lập tức (no loading blocking)
* 📱 Offline 100%
* 🔁 Reactive UI (state → UI)
* 🧠 Tính toán realtime (không cần backend)

---

# 2. Flow Chính: Nhập Liệu → Lưu → Thống Kê → Cảnh Báo

---

# 2.1. Nhập Liệu Giao Dịch (Input Flow)

UI: TransactionForm

Flow:

User
→ Nhập:

* amount
* type (income/expense)
* category
* note (optional)

→ Submit (Enter / Button)

---

Client xử lý:

```
onSubmit()
  → validate input
  → tạo transaction object
```

```javascript
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
```

---

👉 Yêu cầu quan trọng:

* ≤ 3 thao tác
* ≤ 3 giây
* Không reload page

---

# 2.2. Lưu Dữ Liệu (Persistence Flow)

Flow:

```
TransactionForm
→ Zustand Store (addTransaction)
→ LocalStorage (persist)
→ Update _metadata
```

---

Chi tiết:

```javascript
addTransaction(transaction) {
  set(state => {
    const updated = [transaction, ...state.transactions]

    localStorage.setItem("pockly", JSON.stringify({
      ...state,
      transactions: updated
    }))

    return { transactions: updated }
  })
}
```

---

Server (v1.1+):

```
Client
→ POST /api/v1/transactions
→ Server validate
→ Save MongoDB
→ Response success
```

---

Nguyên tắc:

* MVP: write-through LocalStorage
* v1.1: sync async (không block UI)

---

# 2.3. Cập Nhật UI (Reactive Flow)

Ngay sau khi lưu:

```
Zustand state change
→ React re-render
→ TransactionList update
→ Dashboard update
```

---

Không cần:

* Refetch
* API call
* Reload

---

# 2.4. Thống Kê (Calculation Flow)

UI: Dashboard

Flow:

```
transactions state
→ selector/filter
→ compute
→ render charts/cards
```

---

Ví dụ:

```javascript
const summary = useTransactionStore(state => {
  const thisMonth = filterByMonth(state.transactions)

  return {
    income: sum(thisMonth, t => t.type === 'income'),
    expense: sum(thisMonth, t => t.type === 'expense'),
    balance: income - expense
  }
})
```

---

### Biểu đồ:

1. **Bar chart (theo ngày)**

```
transactions
→ group by date
→ sum expense
→ render
```

2. **Donut chart (theo category)**

```
transactions
→ filter expense
→ group by category
→ sum
→ render
```

---

👉 Nguyên tắc:

* Không lưu aggregate
* Tính toán runtime (cheap với <10k records)

---

# 2.5. Flow Ngân Sách (Budget Flow)

UI: BudgetSetting + BudgetProgress

---

Flow:

User
→ Set budget tháng

```
→ save vào budgets["YYYY-MM"]
```

---

```javascript
budgets["2025-06"] = {
  totalBudget: 5000000,
  byCategory: {...}
}
```

---

---

# 2.6. Flow Cảnh Báo (Alert Flow)

Trigger: Sau khi thêm transaction

---

Flow:

```
addTransaction()
→ recalc monthly expense
→ compare với budget
→ trigger alert
```

---

Logic:

```javascript
const percent = (expense / totalBudget) * 100

if (percent >= 100)
  → show RED alert
else if (percent >= threshold)
  → show WARNING alert
```

---

UI:

* 80% → Banner warning
* 100% → Banner danger
* Progress bar update realtime

---

👉 Quan trọng:

* Trigger ngay lập tức
* Không delay
* Không cần API

---

# 3. Filter & Search Flow

UI: TransactionList

---

Flow:

```
User input filter
→ update state (filter params)
→ selector recompute
→ UI update
```

---

Ví dụ:

```javascript
filtered = transactions
  .filter(byDate)
  .filter(byCategory)
  .filter(byKeyword)
```

---

👉 Không gọi API (MVP)

---

# 4. Export CSV Flow

UI: Export Button

---

Flow:

```
User click Export
→ filter transactions
→ convert to CSV
→ download file
→ update settings.lastExportDate
```

---

---

# 5. Sync Flow (v1.1+)

---

## 5.1. Push (Client → Server)

```
Local new transactions
→ sync queue
→ POST /api/v1/transactions
→ mark synced
```

---

## 5.2. Pull (Server → Client)

```
GET /api/v1/transactions?since=lastSync
→ merge data
```

---

## 5.3. Conflict Resolution

* Last write wins
* hoặc user confirm

---

---

# 6. Error Handling Flow

### MVP:

* Không có network error
* Validate tại client

---

### v1.1+:

Server:

```
{
  code: 400/401/500,
  message,
  data: null
}
```

---

Client:

* 400 → form error
* 500 → toast error
* network fail → retry sync

---

# 7. Offline Flow (Core Advantage)

---

Scenario:

User offline

```
→ vẫn nhập transaction
→ vẫn xem dashboard
→ vẫn filter/search
→ vẫn export CSV
```

---

👉 Khi online lại:

```
→ auto sync (v1.1+)
```

---

# 8. Luồng Tổng Thể

---

## 8.1. User Flow (MVP)

1. Mở app
2. Nhập giao dịch
3. Xem danh sách
4. Xem thống kê
5. Nhận cảnh báo budget
6. Export CSV

---

## 8.2. Power User Flow

1. Set budget
2. Theo dõi progress
3. Điều chỉnh chi tiêu theo cảnh báo

---

## 8.3. v1.1 Flow

1. Login
2. Sync data multi-device
3. Backup cloud

---

# 9. Điểm Khác Biệt Quan Trọng

So với hệ thống CRUD truyền thống:

| Pockly          | Hệ thống thường |
| --------------- | --------------- |
| Local-first     | Server-first    |
| Không cần login | Bắt buộc login  |
| Instant write   | Wait API        |
| Realtime stats  | Precompute      |
| Offline 100%    | Phụ thuộc mạng  |

---

# 10. Tiêu Chí Hoàn Thành System Flow

* ✅ Nhập giao dịch ≤ 3s
* ✅ Không mất dữ liệu
* ✅ UI update realtime
* ✅ Thống kê chính xác
* ✅ Cảnh báo đúng ngưỡng
* ✅ Offline hoạt động đầy đủ
* ✅ Sync (v1.1) không conflict nghiêm trọng

---

Tác giả: Lê Quang Tuyến
Phiên bản: 1.0 (MVP Local-first) / 1.1 (Sync-ready)
Trạng thái: Hoàn chỉnh System Flow