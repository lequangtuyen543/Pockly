# 🎨 Cấu Trúc Giao Diện (UI Structure)

## Pockly — Personal Finance Management

---

# 1. Tổng Quan

Frontend là **SPA (ReactJS)**, thiết kế theo hướng **mobile-first + offline-first**.

UI bám sát API:

* Base URL:

```
/api/v1
```

* Response chuẩn:

```json
{
  "code": 200,
  "message": "Success",
  "data": Object || Array || null
}
```

* Auth (v1.1+):

```
Authorization: Bearer <token>
```

---

## Tech stack UI

* React 18
* React Router
* Axios
* Tailwind CSS + shadcn/ui
* Recharts
* Zustand

---

## Style guide (áp dụng toàn app)

* Font: system-ui / Inter
* Màu:

  * Primary: #c15f3c
  * Background: #f4f3ee
  * Surface: #ffffff
  * Neutral: #b1ada1
* Thu: green-500
* Chi: red-500
* Border radius:

  * Card: rounded-xl
  * Badge: rounded-full
* Shadow: shadow-sm
* Spacing:

  * Padding ngang: 16px
  * Gap: 12px

---

# 2. Phân Nhóm Trang (Pages)

## 2.1. Public (MVP)

* `/` → Dashboard (không cần login)
* `/transactions` → danh sách giao dịch
* `/stats` → thống kê

---

## 2.2. Settings / Utility

* `/settings`
* `/categories`
* `/budgets`

---

## 2.3. v1.1+ (Auth)

* `/login`
* `/register`

---

# 3. Layout Structure

## 3.1. `RootLayout`

Áp dụng toàn app

```
RootLayout
 ├── Header
 ├── MainContent (Outlet)
 └── BottomNav (mobile)
```

---

## 3.2. `DashboardLayout`

```
DashboardLayout
 ├── SummaryCards
 ├── QuickAddButton (FAB)
 ├── RecentTransactions
 └── SpendingChart
```

---

## 3.3. `Modal Layer`

```
App
 └── TransactionModal (global)
```

👉 mở nhanh khi add transaction (≤ 3s goal)

---

# 4. Cấu Trúc Thư Mục (Feature-based)

```
src/
  pages/
    dashboard/
      DashboardPage
    transactions/
      TransactionListPage
    stats/
      StatsPage
    settings/
      SettingsPage
    categories/
      CategoryPage
    budgets/
      BudgetPage

  components/
    layout/
      Header
      BottomNav

    transaction/
      TransactionForm
      TransactionList
      TransactionItem
      TransactionFilter

    dashboard/
      SummaryCards
      BalanceCard
      IncomeCard
      ExpenseCard
      SpendingChart
      CategoryBreakdown

    budget/
      BudgetProgress
      BudgetForm

    category/
      CategoryList
      CategoryItem
      CategoryForm

    ui/
      Button
      Card
      Input
      Modal
      Badge

  store/
    transactionStore.ts
    categoryStore.ts
    budgetStore.ts
    settingsStore.ts

  services/
    httpClient.ts
    transaction.service.ts
    category.service.ts
    budget.service.ts
    settings.service.ts

  lib/
    storage.ts
    calculations.ts
    format.ts
```

---

# 5. Component Tree (Quan trọng)

## 5.1. Dashboard

```
DashboardPage
 └── DashboardLayout
      ├── SummaryCards
      │    ├── BalanceCard
      │    ├── IncomeCard
      │    └── ExpenseCard
      │
      ├── SpendingChart
      │
      ├── CategoryBreakdown
      │
      └── TransactionList (latest 5)
           └── TransactionItem
```

---

## 5.2. Transaction Flow

```
TransactionListPage
 ├── TransactionFilter
 ├── TransactionList
 │    └── TransactionItem
 └── FloatingAddButton
      └── TransactionModal
           └── TransactionForm
```

---

## 5.3. Budget

```
BudgetPage
 ├── BudgetProgress
 ├── BudgetForm
 └── CategoryBudgetList
```

---

## 5.4. Categories

```
CategoryPage
 ├── CategoryList
 │    └── CategoryItem
 └── CategoryForm (modal)
```

---

## 5.5. Settings

```
SettingsPage
 ├── CurrencySetting
 ├── NotificationToggle
 ├── BudgetThresholdSetting
 └── ExportCSVButton
```

---

# 6. Routing Design (UI ↔ API Mapping)

## 6.1. Transactions

* `/transactions`

  * API: `GET /api/v1/transactions`
  * Query:

    * fromDate, toDate
    * categoryId
    * type
    * page, limit

---

## 6.2. Create Transaction

* UI: Modal (không route riêng)
* API: `POST /api/v1/transactions`

👉 UX quan trọng:

* Auto focus input
* Enter = submit
* ≤ 3 thao tác

---

## 6.3. Update / Delete

* Edit → `PATCH /api/v1/transactions/:id`
* Delete → `DELETE /api/v1/transactions/:id`

---

## 6.4. Categories

* `/categories`

  * GET `/api/v1/categories`
  * POST `/api/v1/categories`
  * PATCH `/api/v1/categories/:id`
  * PATCH `/api/v1/categories/:id/hide`

---

## 6.5. Budgets

* `/budgets`

  * GET `/api/v1/budgets/:yearMonth`
  * POST `/api/v1/budgets`

---

## 6.6. Settings

* `/settings`

  * GET `/api/v1/settings`
  * PATCH `/api/v1/settings`

---

# 7. State & Data Strategy

## 7.1. MVP (Local-first)

* Zustand store = source of truth
* Sync → LocalStorage

---

## 7.2. v1.1+

* Server sync qua API
* Strategy:

```
Local → UI (instant)
      → API (async sync)
```

---

## 7.3. Store Structure

```
transactionStore
  - transactions[]
  - addTransaction()
  - updateTransaction()
  - deleteTransaction()

categoryStore
budgetStore
settingsStore
```

---

## 7.4. HTTP Client

* Axios instance:

```
baseURL = /api/v1
```

* Interceptor:

  * attach token
  * handle 401 → redirect login

---

# 8. UX Flow (Core)

## 8.1. Ghi giao dịch (quan trọng nhất)

```
User mở app
 → Tap "+"
 → Nhập số tiền
 → Enter
 → DONE (< 3s)
```

---

## 8.2. Xem tiền đi đâu

```
Dashboard
 → SpendingChart
 → CategoryBreakdown
```

---

## 8.3. Cảnh báo ngân sách

```
Transaction added
 → check budget
 → nếu ≥ 80% → warning
 → nếu ≥ 100% → danger
```

---

# 9. Quy Tắc Thiết Kế UI

* Ưu tiên **speed hơn animation**
* Không quá nhiều màn hình → dùng modal
* Data phải **update real-time**
* Không reload page
* Offline vẫn dùng được 100%

---

# 10. Tiêu Chí Hoàn Thành

* ✅ Ghi transaction ≤ 3s
* ✅ UI mobile mượt (375px)
* ✅ Dashboard hiển thị đúng data
* ✅ Filter + search hoạt động
* ✅ Budget cảnh báo đúng
* ✅ Không mất data khi reload
* ✅ Sync được khi có backend