Bạn là UI/UX designer chuyên về Claude Design System (shadcn/ui + Tailwind CSS).

Hãy thiết kế UI Prototype dạng HTML/React cho dự án **Pockly** — ứng dụng quản lý thu chi cá nhân, mobile-first (375px), đơn giản và nhanh.

---

## Thông tin dự án
- Tên: Pockly
- Stack: React + Vite + Tailwind CSS + shadcn/ui
- Target: Sinh viên, người đi làm trẻ
- Tone: Đơn giản, sạch, hiện đại — không rườm rà

---

## Yêu cầu thiết kế

Thiết kế lần lượt các màn hình sau (mobile 375px):

### 1. Home / Dashboard
- Summary cards: Tổng thu / Tổng chi / Số dư tháng này
- Biểu đồ cột chi tiêu 7 ngày gần nhất (mini bar chart)
- Danh sách 5 giao dịch gần nhất
- Bottom navigation: Home | Thêm | Thống kê | Cài đặt

### 2. Màn hình nhập giao dịch (Transaction Form)
- Toggle lớn: THU (xanh) / CHI (đỏ)
- Input số tiền — font lớn, center, bàn phím số
- Dropdown chọn danh mục (icon + tên)
- Input ghi chú (optional)
- Date picker (mặc định hôm nay)
- Nút LƯU full-width ở dưới

### 3. Danh sách giao dịch (Transaction List)
- Filter tabs: Hôm nay | Tuần này | Tháng này
- Group theo ngày
- Mỗi item: icon danh mục + tên + ghi chú + số tiền (màu xanh/đỏ)
- Swipe left để xoá

### 4. Thống kê (Stats)
- Summary: Thu / Chi / Số dư
- Donut chart breakdown theo danh mục
- Danh sách danh mục + % + số tiền

### 5. Cài đặt ngân sách (Budget)
- Input hạn mức tháng
- Progress bar tổng (màu động theo %)
- List từng danh mục + progress bar riêng

---

## Style guide
- Font: system-ui hoặc Inter
- Màu chính: dùng CSS variables của shadcn/ui (--primary, --destructive, --muted...)
- Border radius: rounded-xl cho cards, rounded-full cho badges
- Shadow: shadow-sm, không dùng shadow nặng
- Spacing: padding 16px ngang, gap 12px giữa các elements
- Thu = màu xanh lá (green-500), Chi = màu đỏ (red-500)

---

## Output
- Render từng màn hình dưới dạng React component hoặc HTML tĩnh
- Dùng dữ liệu mock (số tiền, danh mục, ngày tháng thực tế)
- Có thể dùng Tailwind classes trực tiếp
- Ưu tiên pixel-perfect trên mobile 375px
- Không cần logic — chỉ cần UI đẹp, đúng layout