# Pockly

Pockly là một monorepo dự án quản lý tiền cá nhân với frontend React và backend Node.js/Express. Mục tiêu hiện tại là chuẩn bị khung làm việc cho MVP mobile-first, lưu trữ LocalStorage và triển khai backend theo roadmap v1.1.

## Cấu trúc dự án

```text
Pockly/
├── backend/      # Backend Express + TypeScript
├── frontend/     # Frontend React + Vite + Tailwind
├── docs/         # Tài liệu yêu cầu, thiết kế, luồng hệ thống
├── prompts/      # Tài liệu / prompts cho AI agent
├── README.md     # Tổng quan dự án
├── TODO.md       # Kế hoạch phát triển
├── package.json  # Root pnpm workspace
├── pnpm-workspace.yaml
└── .gitignore
```

## Thiết lập monorepo

Đã tạo cấu trúc workspace pnpm cho `frontend` và `backend`.

### Chạy lần đầu

```bash
cd c:/vscode-workspace/javascript/Pockly
pnpm install
```

### Chạy frontend

```bash
pnpm --filter pockly-client dev
```

### Chạy backend

```bash
pnpm --filter pockly-server start
```

### Xây dựng toàn bộ

```bash
pnpm build
```

## Ghi chú hiện tại

- `frontend/` đã được chuyển hướng sang môi trường Vite và giữ lại mã nguồn React hiện tại.
- `backend/` vẫn giữ cấu hình Express + TypeScript cũ.
- `README.md` gốc đã được thay thế bằng nội dung Pockly.

## Tiếp theo

- Hoàn thiện cấu hình frontend với Tailwind CSS và shadcn/ui.
- Làm sạch khoản cài đặt hiện có và chuyển dự án frontend sang `react-ts` nếu cần.
- Thiết lập ESLint/Prettier cho toàn bộ monorepo.
- Cấu hình pipeline deploy cho frontend/backend.
