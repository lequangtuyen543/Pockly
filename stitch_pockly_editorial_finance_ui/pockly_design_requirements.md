# 📄 DESIGN.md — Pockly (Claude-style UI System for Stitch)

## 🧠 Overview
Design a **mobile-first personal finance app (Pockly)** using a **Claude-inspired design system**.

The UI should feel:
* Warm
* Editorial
* Minimal
* Calm, not “techy”

---

## 🎨 Core Design Language

### 1. Color System (STRICT)
* Brand Accent: `#c96442` (Terracotta)
* Main Background: `#f5f4ed` (Parchment)
* Card Surface: `#faf9f5` (Ivory)
* Primary Text: `#141413` (Near Black)
* Secondary Text: `#5e5d59`

### ✍️ Typography Rules
* Headings: Serif (Georgia fallback)
* Body: system-ui / Inter
* Principles: Serif = meaning/emotion, Sans = UI/clarity.

### 📦 Layout Principles
* Radius: Card (12px), Button (8-12px)
* Shadows: Ring shadows (`0 0 0 1px #e8e6dc`) or very soft (`rgba(0,0,0,0.05) 0px 4px 24px`).

---

## 📱 Screens to Generate
1. Dashboard (Summary, mini chart, recent transactions)
2. Transaction Form (Amount, Category, Notes)
3. Transaction List (Today/Week/Month tabs)
4. Stats Screen (Donut chart, breakdown)
5. Budget Screen (Progress bars, category budgets)