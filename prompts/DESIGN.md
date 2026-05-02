# 📄 DESIGN.md — Pockly (Claude-style UI System for Stitch)

## 🧠 Overview

Design a **mobile-first personal finance app (Pockly)** using a **Claude-inspired design system**.

The UI should feel:

* Warm
* Editorial
* Minimal
* Calm, not “techy”

Inspired by:

* Anthropic Claude landing style
* Serif-driven hierarchy
* Warm parchment + terracotta palette

---

## 🎯 Product Context

* App: **Pockly**
* Type: Personal finance tracker
* Target: Students, young professionals
* Platform: Mobile-first (375px)
* Stack: React + Tailwind + shadcn/ui

---

## 🎨 Core Design Language

### 1. Color System (STRICT)

Use **warm tones only** — NO cool gray.

#### Primary Colors

* Brand Accent: `#c96442` (Terracotta)
* Accent Hover: `#a94f32`

#### Backgrounds

* Main Background: `#f5f4ed` (Parchment)
* Card Surface: `#faf9f5` (Ivory)
* White: `#ffffff` (limited use only)

#### Text Colors

* Primary: `#141413` (Near Black)
* Secondary: `#5e5d59`
* Tertiary: `#87867f`

#### Borders

* Light: `#f0eee6`
* Medium: `#e8e6dc`

#### Special

* Income: `green-500`
* Expense: `red-500`
* Focus: `#3898ec` (ONLY for accessibility)

---

## ✍️ Typography Rules

### Font Stack

* Headings: Serif (Georgia fallback)
* Body: system-ui / Inter
* Code: monospace

### Hierarchy

* H1: 40–64px, serif, weight 500
* H2: 24–32px, serif
* Body: 16px, line-height 1.55–1.6
* Labels: 12px uppercase + letter-spacing

### Principles

* Serif = meaning, emotion
* Sans = UI, clarity
* Never use bold serif (max 500 weight)

---

## 📦 Layout Principles

### Spacing

* Base: 8px system
* Padding: 16px horizontal
* Gap: 12–16px

### Radius

* Card: 12px
* Button: 8–12px
* Large container: 16–24px

### Shadows

Use **ring shadows instead of drop shadows**:

* `0 0 0 1px #e8e6dc`
* Soft shadow: `rgba(0,0,0,0.05) 0px 4px 24px`

---

## 🧩 Components (Design Rules)

### Cards

* Background: Ivory (`#faf9f5`)
* Border: `1px solid #f0eee6`
* Radius: 12px
* Shadow: very soft or ring

---

### Buttons

#### Primary (CTA)

* Background: `#c96442`
* Text: white
* Radius: 10px
* No heavy shadow

#### Secondary

* Background: `#e8e6dc`
* Text: `#4d4c48`
* Border: subtle ring

#### Link

* Color: `#c96442`
* No background

---

### Inputs

* Background: white or ivory
* Border: warm border
* Radius: 12px
* Focus: blue ring (`#3898ec`)

---

## 📱 Screens to Generate

### 1. Dashboard

* Summary cards:

  * Total income
  * Total expense
  * Balance (highlight with terracotta)
* Mini bar chart (7 days)
* Recent transactions (5 items)
* Bottom nav (floating center button)

---

### 2. Transaction Form

* Toggle:

  * Income (green)
  * Expense (red)
* Amount input:

  * large (text-3xl)
  * centered
* Category select (icon + label)
* Note input
* Date picker
* Save button (primary color)

---

### 3. Transaction List

* Tabs: Today / Week / Month
* Group by date
* Item:

  * icon
  * title
  * note
  * amount (green/red)
* Swipe to delete (visual hint only)

---

### 4. Stats Screen

* Summary cards
* Donut chart (terracotta-based palette)
* Category breakdown list

---

### 5. Budget Screen

* Monthly budget input
* Total progress bar:

  * <50% green
  * 50–80% yellow
  * > 80% red
* Category budgets with progress bars

---

## 🎯 Interaction Guidelines

* Use subtle hover/press states
* No flashy animation
* Calm transitions only
* Touch targets ≥ 44px

---

## ⚠️ Do & Don’t

### ✅ Do

* Use warm palette everywhere
* Keep UI minimal and breathable
* Use serif for headings only
* Use terracotta sparingly (only CTA / highlight)

### ❌ Don’t

* Don’t use cool gray or blue UI
* Don’t use heavy shadows
* Don’t use sharp corners
* Don’t overuse color accents
* Don’t make it look “startup SaaS”

---

## 🤖 Stitch Instructions

When generating UI:

* Prioritize **mobile layout (375px)**
* Use Tailwind classes
* Use realistic mock data
* No logic required
* Focus on **visual hierarchy + spacing**

---

## 💡 Prompt Strategy (for best Stitch output)

Use prompts like:

* “Create a mobile dashboard using warm parchment background (#f5f4ed) and terracotta CTA (#c96442)”
* “Design a card using ivory surface (#faf9f5) with soft border (#f0eee6)”
* “Use serif typography for headings and clean sans-serif for UI”

---

## 🧩 Design Personality

> “Feels like a notebook for money, not a finance app.”

* Calm
* Warm
* Human
* Thoughtful
* Not overwhelming