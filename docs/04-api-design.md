# 🔌 Thiết Kế API

## Pockly — Personal Finance Management

---

# 1. Tổng Quan

Hệ thống sử dụng **RESTful API + JSON**.

Base URL:

```
/api/v1
```

Response format:

```json
{
  "code": 200,
  "message": "Success",
  "data": Object || Array || null
}
```

---

## Auth (v1.1+)

Sử dụng JWT:

```
Authorization: Bearer <token>
```

---

## MVP v1.0

⚠️ **Không dùng API**
→ Toàn bộ logic chạy trên **LocalStorage**

API này dùng cho **v1.1+ (có backend + sync)**

---

# 2. Transactions APIs

## 2.1. Tạo giao dịch

POST /api/v1/transactions

Auth: Required

Request Body:

```json
{
  "clientId": "uuid-v4",
  "type": "expense",
  "amount": 50000,
  "categoryId": "string",
  "categoryName": "Ăn uống",
  "note": "Phở sáng",
  "transactionDate": "2025-06-15T08:30:00Z"
}
```

👉 Backend xử lý:

```
userId = req.user.id
createdAt = now
updatedAt = now
deletedAt = null
```

Response:

```json
{
  "code": 201,
  "message": "Tạo giao dịch thành công",
  "data": {
    "id": "serverId",
    "clientId": "uuid-v4"
  }
}
```

---

## 2.2. Lấy danh sách giao dịch

GET /api/v1/transactions

Auth: Required

Query Params:

| Param      | Kiểu   | Mô tả             |
| ---------- | ------ | ----------------- |
| fromDate   | String | ISO date          |
| toDate     | String | ISO date          |
| type       | String | expense / income  |
| categoryId | String | lọc theo danh mục |
| keyword    | String | search note       |
| page       | Number | default = 1       |
| limit      | Number | default = 20      |

Filter:

```javascript
{
  userId: req.user.id,
  deletedAt: null
}
```

Response:

```json
{
  "code": 200,
  "message": "Success",
  "data": [Transaction],
  "pagination": {
    "currentPage": 1,
    "limitItems": 20,
    "totalItems": 120,
    "totalPages": 6
  }
}
```

---

## 2.3. Lấy chi tiết giao dịch

GET /api/v1/transactions/:id

Auth: Required

Response:

```json
{
  "code": 200,
  "data": {
    "id": "...",
    "type": "expense",
    "amount": 50000,
    "category": {
      "id": "...",
      "name": "Ăn uống"
    },
    "note": "Phở sáng",
    "transactionDate": "..."
  }
}
```

---

## 2.4. Cập nhật giao dịch

PATCH /api/v1/transactions/:id

Auth: Required

Request Body:

```json
{
  "amount": 60000,
  "categoryId": "string",
  "note": "Phở + cafe"
}
```

👉 Logic:

* Chỉ update nếu `userId` match
* Update `updatedAt`

Response:

```json
{
  "code": 200,
  "message": "Cập nhật thành công",
  "data": Transaction
}
```

---

## 2.5. Xóa giao dịch (Soft delete)

DELETE /api/v1/transactions/:id

Auth: Required

👉 Backend:

```
deletedAt = new Date()
```

Response:

```json
{
  "code": 200,
  "message": "Xóa thành công",
  "data": null
}
```

---

# 3. Categories APIs

## 3.1. Lấy danh mục

GET /api/v1/categories

Auth: Required

Query Params:

| Param   | Kiểu   | Mô tả            |
| ------- | ------ | ---------------- |
| type    | String | expense / income |
| keyword | String | search name      |

Filter:

```javascript
{
  userId: { $in: [req.user.id, null] },
  deletedAt: null
}
```

Response:

```json
{
  "code": 200,
  "data": [Category]
}
```

---

## 3.2. Tạo danh mục

POST /api/v1/categories

Auth: Required

Request Body:

```json
{
  "name": "Cafe",
  "emoji": "☕",
  "type": "expense"
}
```

Response:

```json
{
  "code": 201,
  "message": "Tạo danh mục thành công",
  "data": Category
}
```

---

## 3.3. Cập nhật danh mục

PATCH /api/v1/categories/:id

Auth: Required

Request Body:

```json
{
  "name": "Coffee",
  "emoji": "☕"
}
```

---

## 3.4. Ẩn danh mục

PATCH /api/v1/categories/:id/hide

Auth: Required

👉 Backend:

```
isHidden = true
```

---

# 4. Budgets APIs

## 4.1. Lấy ngân sách theo tháng

GET /api/v1/budgets/:yearMonth

Auth: Required

Response:

```json
{
  "code": 200,
  "data": {
    "yearMonth": "2025-06",
    "totalBudget": 5000000,
    "budgetByCategory": [...]
  }
}
```

---

## 4.2. Tạo / cập nhật ngân sách

POST /api/v1/budgets

Auth: Required

Request Body:

```json
{
  "yearMonth": "2025-06",
  "totalBudget": 5000000,
  "budgetByCategory": [
    {
      "categoryId": "string",
      "limit": 1500000
    }
  ]
}
```

👉 Logic:

* Nếu tồn tại → update
* Nếu chưa → create

---

# 5. Settings APIs

## 5.1. Lấy settings

GET /api/v1/settings

Auth: Required

Response:

```json
{
  "code": 200,
  "data": {
    "currency": "VND",
    "budgetAlertThreshold": 80,
    "language": "vi"
  }
}
```

---

## 5.2. Cập nhật settings

PATCH /api/v1/settings

Auth: Required

Request Body:

```json
{
  "budgetAlertThreshold": 90,
  "notificationEnabled": false
}
```

---

# 6. Sync APIs (Quan trọng cho v1.1)

## 6.1. Sync từ client → server

POST /api/v1/sync/push

Auth: Required

Request:

```json
{
  "transactions": [...],
  "categories": [...],
  "budgets": {...},
  "lastSync": "ISO date"
}
```

---

## 6.2. Sync từ server → client

GET /api/v1/sync/pull

Auth: Required

Query:

```
?lastSync=ISO_DATE
```

Response:

```json
{
  "code": 200,
  "data": {
    "transactions": [...],
    "categories": [...],
    "budgets": {...],
    "deleted": [...]
  }
}
```

---

# 7. HTTP Status Codes

* 200: Thành công
* 201: Tạo mới thành công
* 400: Sai dữ liệu
* 401: Chưa login
* 403: Không có quyền
* 404: Không tồn tại
* 500: Lỗi server

---

# 8. Quy Tắc Thiết Kế

* Dùng **RESTful chuẩn**
* Route dùng **noun** (transactions, categories)
* Soft delete (`deletedAt`)
* Timestamp: ISO 8601
* Client dùng UUID, server dùng ObjectId
* Luôn hỗ trợ **offline-first → sync sau**

---

# 9. Tiêu Chí Hoàn Thành

* ✅ CRUD transactions đầy đủ
* ✅ Category hoạt động (default + custom)
* ✅ Budget logic đúng
* ✅ Sync 2 chiều hoạt động
* ✅ Không conflict dữ liệu khi offline
* ✅ API consistent với LocalStorage schema