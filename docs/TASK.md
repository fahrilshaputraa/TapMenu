# End-to-End Task Guide

Use this as a step-by-step checklist for LLM-assisted delivery. Follow order; do not skip validation steps.

## 0) Preliminaries
- [x] Read `docs/PRD.md` and `docs/PLAN.md`; confirm roles and routes in `tapmenu/src/App.jsx`.
- [ ] Ensure Python, Postgres, Redis, Node are available; set timezone Asia/Jakarta.
- [x] Create `.env` templates for backend (DB, REDIS, JWT secrets, storage, payment keys, Google OAuth).

## 1) Backend Scaffold
- [x] Start Django project and core app; enable DRF, CORS, JWT auth.
- [x] Configure Postgres connection, Redis cache/session, static/media storage stub (S3-compatible).
- [x] Add health check endpoint and base logging/structured error format.

## 2) Auth & Users
- [x] Custom User model (email as username, phone optional), roles enum.
- [ ] JWT access/refresh endpoints; register/login/refresh/logout; password reset flow.
- [ ] Google OAuth setup (both restaurant and buyer paths); account linking.
- [ ] Role/permission middleware; seed superuser and sample owner/buyer.

## 3) Restaurant & Appearance
- [ ] Models: Restaurant (profile, slug, address, hours, logo/banner, theme/settings JSON).
- [ ] Endpoints: CRUD for restaurant (owner-scoped), appearance update, settings fetch.
- [ ] Link owner to restaurant; enforce multi-tenant scoping on all related queries.

## 4) Categories & Menu
- [ ] Models: Category, MenuItem (price/discount/tax, flags, stock, variants/options JSON, image URL).
- [ ] CRUD endpoints with list/filter; toggle active/stock; image upload handler (stub S3).
- [ ] Include serializer validations for pricing/tax/variants.

## 5) Tables & QR
- [ ] Model: Table (name, area, qr_token, active, restaurant FK).
- [ ] CRUD endpoints; QR generation helper producing deep link to `/order/:tableId` with restaurant context.
- [ ] Endpoint to fetch/download QR image; store qr_token for regeneration.

## 6) Orders Core
- [ ] Models: Order, OrderItem (snapshots of name/price/options), status enum (new/process/ready/completed/cancelled), order_type, code generator per restaurant.
- [ ] Pricing fields: subtotal, tax, discount, total_payable; notes and audit timestamps.
- [ ] Endpoints: create order (buyer/guest), list/filter for dashboard, detail fetch for tracking, status update with actor logging.

## 7) Payments
- [ ] Model: Payment (provider, method, amount, status, external_id, expires_at, paid_at).
- [ ] Endpoint to create payment intent (QRIS/VA/e-wallet) and return payload/QR URL.
- [ ] Webhook endpoints per provider with idempotency; update order.payment_status; handle expiry/cancel.
- [ ] Cashier “mark paid (cash)” endpoint updating order/payment and logging change.

## 8) Vouchers
- [ ] Model: Voucher (type percent/cash/bonus, value, min_order, validity window, usage limits total/per-user, status).
- [ ] Endpoints: restaurant CRUD; validate/redeem for cart/order; enforce limits and status updates.
- [ ] Store redemption logs tied to buyer/order.

## 9) Buyer Features
- [ ] Buyer profile endpoint (name/phone); link to User.
- [ ] Favorites CRUD (buyer-scoped); guest favorites remain client-side only.
- [ ] Order history endpoint (paginated) for buyer.

## 10) POS & Employees
- [ ] Model: Employee (restaurant, user, role, status, pin_hash, invited_at).
- [ ] Cashier PIN auth endpoint; session token for POS actions.
- [ ] POS order endpoint (supports add-ons/notes/order_type) reusing pricing engine.
- [ ] Employee CRUD and reset-PIN endpoint; audit role/status changes.

## 11) Reports
- [ ] Aggregation endpoints: sales by day/week, top items, payment mix, voucher impact.
- [ ] Export endpoints (CSV/PDF) gated to owner/manager.

## 12) Frontend Wiring (existing React screens)
- [ ] Map API endpoints to routes in `src/App.jsx` and page components under `src/pages`.
- [ ] Replace stub data with API calls (menu, tables, orders, vouchers, favorites, history, settings, appearance).
- [ ] Handle auth flows (restaurant vs buyer) and token refresh; protect dashboard routes.
- [ ] Integrate payment intent responses and webhook-driven status polling on buyer order tracking.
- [ ] Implement QR deep link handling for `/order/:tableId`.

## 13) Quality & Hardening
- [ ] Add serializer/input validation; consistent error schema.
- [ ] Rate limit auth/order/payment endpoints; enable CORS only for allowed origins.
- [ ] Tests: unit (models/serializers/services), API tests for auth/orders/payments/vouchers, webhook idempotency tests.
- [ ] Observability: structured logging, request IDs, basic metrics; webhook retry strategy.

## 14) Deployment Readiness
- [ ] Dockerfile/docker-compose for app + Postgres + Redis.
- [ ] Migrations, static/media storage config, env examples, admin superuser script.
- [ ] Backup/restore notes for Postgres; rotate secrets guidance.

## 15) Definition of Done
- [ ] All endpoints implemented, secured by role and restaurant scoping.
- [ ] Tests passing; sample data/fixtures for manual QA.
- [ ] Frontend integrated with live APIs; payment flow works (intent → pay → webhook → status update).
- [ ] Docs updated: PRD, PLAN, and this TAKS guide aligned with shipped APIs.
