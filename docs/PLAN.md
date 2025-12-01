# Implementation Plan

**Plan style choice (reasoning)**  
Considered (1) pure chronological waterfall, (2) risk-first spikes, and (3) dependency-ordered vertical slices. We will use **dependency-ordered vertical slices** because it keeps momentum by shipping end-to-end increments (auth → restaurant setup → ordering → payments → dashboards) while still honoring backend prerequisites and aligning with the existing React routes. This style is concise, actionable for LLM-assisted work, and easy to checkpoint.

## Assumptions
- Django + DRF backend; Postgres primary; Redis for sessions/cache; S3-compatible object storage for images; timezone Asia/Jakarta.
- Payment gateway supports QRIS/VA/e-wallet with webhooks (e.g., Midtrans/Xendit/DOKU).
- JWT auth (access + refresh); Google OAuth available for both restaurant and buyer.

## Execution Steps (vertical slices)
1) **Scaffold & Foundations**  
   - Create Django project/app structure; settings for Postgres/Redis/CORS; configure DRF, JWT, logging, and timezone.  
   - Add base User model (email/phone login), roles enum, and superuser bootstrap.  
   - Wire health check endpoint; basic CI lint/test.

2) **Auth & Identity**  
   - Implement register/login/refresh/logout, password reset; buyer vs restaurant registration paths.  
   - Integrate Google OAuth (django-allauth/python-social-auth); link to existing accounts.  
   - Role-based permissions middleware; seed initial owner account.

3) **Restaurant Onboarding & Settings**  
   - CRUD Restaurant (profile, address, hours, logo/banner URLs, theme/settings JSON); owner linkage.  
   - Appearance update endpoint for buyer menu; store settings fetch endpoint for client bootstraps.

4) **Categories & Menu Management**  
   - Models: Category, MenuItem (price/discount/tax, variants/options JSON, flags, stock tracking, image URL).  
   - CRUD endpoints with list/filter by category/status; image upload stub (S3-compatible).  
   - Permissions scoped per restaurant; slugs/ids stable.

5) **Tables & QR**  
   - Model: Table (name, area, qr_token, active).  
   - CRUD endpoints; generate QR URL that deep-links to `/order/:tableId` with restaurant context.  
   - Endpoint to fetch/download QR image (proxying QR service or generating locally).

6) **Orders Core**  
   - Models: Order, OrderItem (+ snapshots), pricing fields (subtotal/tax/discount/total), statuses (new/process/ready/completed/cancelled), order_type, code generator.  
   - Create order endpoint (buyer/guest with optional table_id); status update endpoint (kitchen/owner).  
   - List/filter by status/date/search for dashboard; single-order fetch for tracking page.

7) **Payments Integration**  
   - Payment intent endpoint returning QRIS/VA/e-wallet payload; store external ids and expiry.  
   - Webhook endpoints per provider with idempotency; update payment_status and order status.  
   - Cashier “mark paid (cash)” path; record payment method and change.

8) **Vouchers**  
   - Model: Voucher (type percent/cash/bonus, value, min_order, validity, usage limits).  
   - Validate/redeem endpoint for carts/orders; enforce per-user/global usage.  
   - Restaurant-side CRUD + list for buyer page.

9) **Buyer Features (Favorites, History, Profile)**  
   - Favorites CRUD for logged-in buyers; guest handled client-side only.  
   - Buyer order history endpoint (paginated); basic buyer profile endpoint (name/phone).

10) **POS & Dashboard Operations**  
    - POS-specific endpoints: fetch menu with add-ons/variants; create POS order with notes/add-ons; cashier PIN auth tied to Employee.  
    - Orders board filters; bulk status transitions; audit trail for status changes.  
    - Employee CRUD (role, status, hashed PIN); reset PIN endpoint.

11) **Reports & Exports**  
    - Aggregates: sales by day/week, top items, payment mix, voucher impact.  
    - Export endpoints (CSV/PDF) for reports; gate by owner/manager.

12) **Quality, Observability, Hardening**  
    - Validation + error schema; rate limiting on auth/order/payment routes.  
    - Structured logging; request/response IDs; basic metrics; webhook retry handling.  
    - Unit/integration tests for core slices (auth, orders, payments, vouchers); seed fixtures for manual QA.

## LLM Handoff Notes
- Keep API shapes aligned with existing React routes (`src/App.jsx`), especially buyer/dash pages.  
- Favor clear request/response examples in docstrings/README as you implement each slice.  
- When unsure about gateway specifics, stub with a mock provider but keep interfaces matching QRIS/VA needs for swap-in.
