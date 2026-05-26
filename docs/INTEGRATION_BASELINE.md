# TapMenu Integration Baseline

Last reviewed: 2026-05-25

## Goal

This document is the current baseline for frontend-backend integration in TapMenu. It answers:

- Which frontend pages already call the backend
- Which frontend pages are still static, mock-based, or only partially integrated
- Which backend endpoints already exist and are consumed
- Which backend endpoints exist but still have no frontend consumer
- Which product areas are still missing on one side or both sides

## How to Analyze This Going Forward

Use the same 4-step method for each future audit:

1. Map frontend routes from `tapmenu/src/App.jsx`.
2. Inventory frontend API usage from `tapmenu/src/services/` and `tapmenu/src/pages/`.
3. Inventory backend routes from `backend/core/urls.py` plus each app `urls.py`.
4. Compare page intent vs endpoint support:
   - If a page renders live data and saves through API, mark `Integrated`.
   - If a page reads live data but still uses local state, mock data, or simulated submit, mark `Partial`.
   - If a page has no backend calls for its main purpose, mark `Not integrated`.

## Summary

Current status is uneven:

- Core owner dashboard CRUD is mostly integrated.
- Customer menu browsing and public order creation are integrated.
- Customer self-service areas like vouchers, favorites, and order history are still frontend-only.
- Payment APIs already exist in backend, but frontend checkout/payment flow does not use them yet.
- System settings and advanced table form fields are not backed by backend models/endpoints yet.

## Frontend Status

### Integrated

These pages already use backend endpoints for their main flow:

| Area | Frontend page | Backend endpoints used | Status |
| --- | --- | --- | --- |
| Auth | `tapmenu/src/pages/authentications/dashboard/Login.jsx` | `POST /api/v1/auth/login/` | Integrated |
| Auth | `tapmenu/src/pages/authentications/dashboard/Register.jsx` | `POST /api/v1/auth/register/` | Integrated |
| Auth | `tapmenu/src/pages/authentications/customer/Login.jsx` | `POST /api/v1/auth/login/` | Integrated |
| Auth | `tapmenu/src/pages/authentications/customer/Register.jsx` | `POST /api/v1/auth/register/` | Integrated |
| Auth | `tapmenu/src/pages/authentications/ForgotPassword.jsx` | `POST /api/v1/auth/forgot-password/`, `POST /api/v1/auth/reset-password/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Overview.jsx` | `GET /api/v1/restaurants/overview/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Category.jsx` | `GET/POST/PUT/PATCH/DELETE /api/v1/catalogs/categories/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/MenuManagement.jsx` | `GET /api/v1/catalogs/categories/`, `GET/POST/PUT/PATCH/DELETE /api/v1/catalogs/items/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Tables.jsx` | `GET/POST/DELETE /api/v1/settings/tables/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/TableForm.jsx` | `GET/POST/PUT /api/v1/settings/tables/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/VoucherManagement.jsx` | `GET/POST/PUT/PATCH/DELETE /api/v1/settings/vouchers/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Employee.jsx` | `GET/POST/PATCH/DELETE /api/v1/auth/employees/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/StoreSettings.jsx` | `GET/PUT /api/v1/restaurants/me/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/MenuAppearance.jsx` | `GET/PUT /api/v1/restaurants/appearance/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Orders.jsx` | `GET/PATCH /api/v1/orders/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Reports.jsx` | `GET /api/v1/reports/summary/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/ProfileSettings.jsx` | `GET/PUT /api/v1/auth/me/`, `POST /api/v1/auth/logout/` | Integrated |
| Dashboard | `tapmenu/src/pages/dashboard/Cashier.jsx` | `POST /api/v1/auth/cashier-login/`, `GET /api/v1/catalogs/categories/`, `GET /api/v1/catalogs/items/`, `GET /api/v1/restaurants/me/`, `POST /api/v1/orders/`, `POST /api/v1/payments/<order_id>/checkout/`, `POST /api/v1/payments/<order_id>/confirm/` | Integrated |
| Customer | `tapmenu/src/pages/customer/Menu.jsx` | `GET /api/v1/catalogs/public/menu/`, `POST /api/v1/orders/public/` | Integrated |
| Customer | `tapmenu/src/pages/customer/Order.jsx` | `GET /api/v1/orders/track/<order_code>/` | Integrated |

### Partial

These pages touch the backend but still have important gaps:

| Area | Frontend page | What already works | What is still missing |
| --- | --- | --- | --- |
| Customer menu flow | `tapmenu/src/pages/customer/Menu.jsx` | Creates public order and stores local history | Favorites toggle, voucher page link, and history depend on local state/localStorage, not backend data |

### Not Integrated

These pages are still static, mock-driven, or simulated:

| Area | Frontend page | Current condition |
| --- | --- | --- |
| Marketing | `tapmenu/src/pages/Home.jsx` | Landing page only, no backend dependency |
| Informational | `tapmenu/src/pages/AboutMe.jsx` | Static restaurant/about content |
| System settings | `tapmenu/src/pages/dashboard/Settings.jsx` | Entire save flow is simulated; no backend calls |
| Customer vouchers | `tapmenu/src/pages/customer/Voucher.jsx` | Uses hardcoded voucher list and local claim logic |
| Customer order history | `tapmenu/src/pages/customer/OrderHistory.jsx` | Reads only from `localStorage`, not backend |
| Customer favorites | `tapmenu/src/pages/customer/Favorites.jsx` | Uses local seeded data only |
| Customer profile | `tapmenu/src/pages/customer/Profile.jsx` | File exists but is not wired into router |

## Backend Status

### Implemented and Already Used by Frontend

These backend areas already have active frontend consumers:

- `users`: register, login, me, logout, employee CRUD
- `restaurants`: restaurant profile, appearance, dashboard overview
- `catalogs`: category CRUD, menu item CRUD, public menu
- `settings`: table CRUD, voucher CRUD
- `orders`: dashboard orders, public create order, order tracking
- `reports`: summary report

### Implemented but Not Yet Used by Frontend

These backend endpoints exist, but there is no real frontend integration yet:

| Backend endpoint | Current gap |
| --- | --- |
| `POST /api/v1/auth/refresh/` | No explicit frontend refresh flow |
| `POST /api/v1/auth/verify/` | No frontend usage |
| `POST /api/v1/payments/webhook/` | Backend-only integration point |

## Gaps by Domain

### Frontend Missing, Backend Already Exists

- Explicit token refresh/verify handling in frontend auth lifecycle

These are the remaining low-effort wins because backend support already exists.

### Backend Missing, Frontend Already Designed

- Customer voucher account features
  - claim voucher
  - my vouchers
  - voucher usage history
- Customer favorites
  - save favorite item
  - remove favorite item
  - list favorite items
- Customer order history per logged-in buyer
- Customer profile/account page API if that page is intended to be used separately
- System settings persistence for:
  - notification preferences
  - printer preferences
  - manual bank accounts
  - payment gateway configuration

### Both Sides Need Alignment

- Cashier payment flow UI suggests `cash` and `QRIS`, but order creation is separated from payment transaction handling in backend.
- Customer order history currently depends on localStorage even though order tracking exists.
  - If history should be cross-device, a buyer-scoped order list endpoint is still needed.

## Recommended Baseline Backlog

### Priority 1

- Decide whether customer self-payment should also use `/api/v1/payments/` after public order creation
- Add explicit auth refresh/verify handling if long-lived dashboard sessions matter

### Priority 2

- Decide the product direction for customer account features:
  - vouchers
  - favorites
  - order history
  - profile
- Build backend APIs first for these areas, then wire the existing pages

### Priority 3

- Decide whether `dashboard/Settings` is a real persisted feature or only a UI prototype
- If real, define backend model and endpoints for system/payment settings

## Baseline Decision

As of 2026-05-25:

- Owner/admin operational dashboard is mostly connected.
- Customer ordering core path is connected.
- Customer account ecosystem is not yet truly integrated.
- Cashier payment flow is connected, but customer-side payment is still not implemented.
- Some frontend pages are still prototypes and should not be treated as complete features.
