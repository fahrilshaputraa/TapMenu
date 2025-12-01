# TapMenu PRD

Working draft for the UMKM-focused ordering platform. Frontend (React + Tailwind) screens already exist under `tapmenu/src`. This PRD defines the backend (Django + Django REST Framework) and API integration needed to power those screens for four roles: Restaurant, Cashier, Logged-in Buyer, and Guest Buyer.

## 1) Objective & Problem Statement
- Help Indonesian UMKM F&B owners digitize on-premise ordering: QR menu per table, cashier workflow, simple reporting, and multi-method payments (QRIS/virtual account/e-wallet).
- Deliver a guest-friendly buyer flow (scan → browse → order → pay → track) while giving restaurants control over menu, tables/QR, vouchers, appearance, employees, and reports.

## 2) Users & Roles
- Restaurant Owner/Admin: full control of store, menu, vouchers, employees, appearance, reports.
- Cashier: POS login via ID+PIN, create in-store/takeaway/online orders, process payments, print/issue receipts.
- Logged-in Buyer: can save favorites, view order history, claim/apply vouchers, pay digitally, and update profile.
- Guest Buyer: can browse via table QR, add to cart, place and pay orders without an account; can upgrade to login/register.

## 3) Primary User Journeys
- Landing → register restaurant (manual or Google) → onboard store profile → set menu/categories → create tables + QR → go live.
- Buyer scans table QR (`/order/:tableId`) or opens `/order` (takeaway), browses categories, applies voucher, pays, tracks status, and can save favorites (if logged in).
- Cashier logs in with ID+PIN, builds cart, adds add-ons/notes, selects order type, takes cash or QR/VA payment, closes order, prints/downloads receipt.
- Owner monitors dashboard overview, manages orders pipeline (new → process → ready → completed), edits menus/categories, manages employees/vouchers, customizes appearance, and reviews reports.

## 4) In Scope (MVP)
- Auth: Restaurant and buyer login/register, Google OAuth for both, password reset, role-based access. Cashier PIN auth scoped to a restaurant employee record.
- Landing page: content served statically; CTA drives to `/login` and `/register`.
- Dashboard pages (per routes in `src/pages/dashboard/*`):
  - Overview: summary stats, recent orders table, quick actions, lightweight sales chart placeholder.
  - Orders: list + search/filter by status (new/process/ready/completed), view order detail, update status.
  - Cashier POS: category filter, search, add-ons, item notes, order type (dine-in/take-away/online), cart math with 10% tax, payment modal (cash, QR/VA), success receipt.
  - Menu Management: CRUD menu items, variants/options, price/discount/tax, stock toggle/tracking, favorite/new badges, active/inactive, image upload.
  - Category Management: CRUD simple categories used by menu and customer menu filters.
  - Tables: CRUD tables, assign area (indoor/outdoor), generate/download printable QR that links to `/order/:tableId`; quick stats per area.
  - Table Form: add/edit table.
  - Employee: list/create employees with role (owner/manager/cashier/kitchen) and status; set PIN for cashier.
  - Voucher Management: CRUD vouchers (percentage, cash, bonus item), min order, validity, status.
  - Reports: daily/weekly sales summary, top items, payment breakdown, export CSV/PDF.
  - Settings: profile (`/dashboard/settings/profile`), store (`/dashboard/settings/store`), menu appearance (`/dashboard/settings/appearance`).
- Buyer pages (`src/pages/customer/*`):
  - Menu (`/order/:tableId` or `/order`): restaurant hero, category tabs, search, popular badges, add to cart, cart sidebar, fees/tax breakdown, voucher entry, guest checkout, save favorite, table-aware orders.
  - Order Status (`/order/status`): search by code, timeline of received/cooking/ready, totals.
  - Vouchers (`/order/vouchers`): list active/history, claim by code, apply to order.
  - Order History (`/order/history`): past orders, totals, statuses.
  - Favorites (`/order/favorites`): saved menu items.
  - About (`/order/about`): restaurant info.
  - Customer auth (`/customer/login`, `/customer/register`), forgot password shared flow.
- Payments: QRIS/QR code, virtual account/e-wallet via Indonesian gateway (e.g., Midtrans/Xendit/DOKU), plus cash for cashier. Handle asynchronous notifications/webhooks to update payment status.

## 5) Out of Scope (MVP)
- Delivery logistics, multi-outlet hierarchy, complex inventory/warehouse, loyalty tiers, table reservation, kitchen display system hardware integration, offline-first sync.

## 6) Functional Requirements
- Multi-tenant isolation: data segmented per restaurant; buyer accounts can order from multiple restaurants.
- AuthN/AuthZ:
  - JWT-based API tokens; short-lived access + refresh.
  - Roles: owner, manager, cashier, kitchen, buyer. Permissions enforced server-side per endpoint.
  - Google OAuth via django-allauth or python-social-auth; link social accounts to existing emails.
- Menu & Category:
  - CRUD menus with variants/options and tax/discount; upload/store images; mark active/inactive, favorite/new.
  - Category CRUD with ordering; categories used for filtering in POS and buyer menu.
- Tables & QR:
  - CRUD tables with area and label; generate QR that encodes deep link to `/order/:tableId` with restaurant slug/id and optional tracking token; downloadable PNG/PDF.
- Orders:
  - Create order from buyer cart or cashier POS; include table/takeaway/online type, items, variants/add-ons, notes, pricing breakdown (subtotal, tax, discounts, service charge if added).
  - Order status machine: new → process (cooking) → ready → completed/cancelled. Status updates recorded with timestamps and actor.
  - Order codes human-friendly (e.g., `ORD-1024`); per-restaurant sequence.
  - Track payment status: pending → paid → failed/expired; support cash confirmation by cashier.
- Payments:
  - Payment intent API returns QRIS/VA deeplink and instructions; polling/webhook updates order payment status.
  - Cashier flow allows cash received input, change calculation, mark paid, and log payment method.
  - Store gateway transaction IDs for reconciliation; handle expiry/cancel.
- Vouchers:
  - Types: percentage, flat (cash), bonus item flag; min order; start/end dates; usage limit per user and global; status active/expired/used.
  - Validation API returns discount value and applicable items/categories; redemption logged.
- Favorites & History:
  - Favorites tied to buyer; guest favorites stored client-side only; server supports CRUD for logged-in buyers.
  - Order history endpoint paginated and scoped to buyer.
- Reports:
  - Aggregate sales by day/week, item performance, payment mix, voucher impact; export endpoints.
- Appearance & Store Settings:
  - Store profile (name, address, hours, logo/banner), theme colors, menu highlight badges; exposed to buyer pages.
- Employee Management:
  - Create/update employees with role, status, PIN (hashed), last login; owner can reset PIN; audit log for status changes.
- Notifications:
  - Email for password reset; optional WhatsApp/SMS not in MVP.
- Observability:
  - Request/response logging, structured errors; admin audit trails for status changes and payments.

## 7) Data Model (logical, key fields)
- User: id, name, email, phone, role, password hash, google_id (nullable), last_login.
- Restaurant: id, owner_id, name, slug, address, phone, hours, logo_url, banner_url, theme, settings json.
- Employee: id, restaurant_id, user_id, role, status, pin_hash, invited_at.
- Category: id, restaurant_id, name, sort_order, is_active.
- MenuItem: id, restaurant_id, category_id, name, description, price, discount, tax, image_url, is_active, is_favorite, is_new, track_stock, stock_qty, variants json.
- Table: id, restaurant_id, name, area, qr_token, is_active.
- Voucher: id, restaurant_id, code, type, value, min_order, start_at, end_at, usage_limit_total, usage_limit_per_user, status, metadata.
- Order: id, restaurant_id, buyer_id (nullable for guest), table_id (nullable), order_type, code, status, total_subtotal, total_tax, total_discount, total_payable, payment_status, payment_method, payment_ref, notes, created_by (buyer/cashier id).
- OrderItem: id, order_id, menu_item_id, name_snapshot, price_snapshot, quantity, variants json, add_ons json, notes.
- Payment: id, order_id, provider, method, amount, status, external_id, expires_at, paid_at.
- Favorite: id, buyer_id, restaurant_id, menu_item_id.
- BuyerProfile: id, user_id, default_name, phone.

## 8) API Surface (v1 proposals)
- Auth: POST `/api/v1/auth/login` (role-aware), POST `/api/v1/auth/register` (restaurant/buyer), POST `/api/v1/auth/google`, POST `/api/v1/auth/refresh`, POST `/api/v1/auth/forgot-password`, POST `/api/v1/auth/reset`.
- Restaurant setup: GET/PUT `/api/v1/restaurants/{id}`, POST `/api/v1/restaurants/{id}/appearance`, GET `/api/v1/restaurants/{id}/settings`.
- Categories: CRUD at `/api/v1/restaurants/{id}/categories`.
- Menu: CRUD at `/api/v1/restaurants/{id}/menus`; image upload endpoint; toggle active/stock; variants persisted in JSON.
- Tables: CRUD at `/api/v1/restaurants/{id}/tables`; GET `/api/v1/tables/{table_id}/qr` to fetch QR image/URL.
- Orders (restaurant/admin): GET `/api/v1/restaurants/{id}/orders?status=...`, PATCH `/api/v1/orders/{code}` (status update), GET `/api/v1/orders/{code}`.
- Orders (buyer): POST `/api/v1/orders` (body: restaurant_id, table_id optional, items, voucher_code, channel), GET `/api/v1/orders/{code}` (requires code), GET `/api/v1/buyers/me/orders`.
- Payments: POST `/api/v1/payments/intents` (creates payment + returns QR/VA payload), GET `/api/v1/payments/{id}`, webhook `/api/v1/payments/webhook/{provider}`.
- Vouchers: GET `/api/v1/restaurants/{id}/vouchers`, POST `/api/v1/restaurants/{id}/vouchers`, POST `/api/v1/vouchers/validate` (body: code, restaurant_id, cart summary), POST `/api/v1/vouchers/redeem`.
- Favorites: GET/POST/DELETE `/api/v1/buyers/me/favorites`.
- Reports: GET `/api/v1/restaurants/{id}/reports/sales?range=...`, GET `/api/v1/reports/top-items`, GET `/api/v1/reports/payments`, GET `/api/v1/reports/export?format=csv|pdf`.
- Employees: CRUD `/api/v1/restaurants/{id}/employees`; POST `/api/v1/employees/{id}/reset-pin`.

## 9) Integrations
- Payments: use Indonesian gateway supporting QRIS, virtual accounts, and e-wallets. Store webhook secrets per restaurant; handle idempotency on callbacks.
- Google OAuth: supported for both restaurant and buyer auth flows; ensure redirect URIs configured per environment.

## 10) Non-Functional Requirements
- Performance: p95 API < 500ms for read operations; order submission < 800ms excluding payment gateway latency.
- Reliability: 99.5% uptime target; payment webhook retries with idempotency keys.
- Security: HTTPS everywhere, JWT tokens, hashed PINs (bcrypt/argon2), RBAC checks, rate limiting on auth/cart/order creation, input validation, audit logs for status/payment changes.
- Data: Postgres as primary DB; store images in S3-compatible bucket; Redis for sessions/rate limit/cache; timezone default Asia/Jakarta.
- Localization: ID language and currency (IDR) formatting.
- Observability: structured logs, error tracking, request tracing; admin dashboard for failed webhooks.

## 11) Success Metrics
- Time to place order (scan to pay) median < 3 minutes.
- Payment success rate > 95% after first attempt.
- Order status SLA: kitchen sees new order in < 5 seconds after submission.
- Restaurant activation: % stores that publish menu + tables within 1 day of signup.
- Cashier POS uptime during operating hours.

## 12) Milestones
1) Auth + restaurant onboarding + basic menu/category CRUD + table/QR generation.
2) Buyer ordering flow (guest + logged-in), voucher validation, payment intents + webhook updates, order tracking.
3) Dashboard operations: orders board, cashier POS, voucher management, appearance/store settings.
4) Reporting export + employee management + hardening (rate limits, audit logs).
5) Production readiness: monitoring, backup, webhook retries, and rollout playbook.
