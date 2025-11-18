# 🍽️ QR Restaurant Platform - Complete Documentation

## Table of Contents
1. [Product Overview](#product-overview)
2. [Product Requirements Document (PRD)](#product-requirements-document-prd)
3. [Functional Requirements Document (FRD)](#functional-requirements-document-frd)
4. [Technical Specifications](#technical-specifications)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [User Flows](#user-flows)
8. [Development Roadmap](#development-roadmap)

---

## Product Overview

### Vision
Platform gratis yang memungkinkan siapa saja untuk membuat sistem pemesanan makanan digital dengan QR code untuk restoran mereka sendiri.

### Mission
Demokratisasi teknologi digital ordering untuk UMKM dan restoran kecil tanpa biaya subscription.

### Key Value Propositions
- ✅ **100% Gratis** - Tidak ada biaya subscription atau komisi
- 🚀 **Setup Cepat** - Resto bisa go-live dalam 30 menit
- 📱 **QR-Based** - Customer scan QR di meja langsung pesan
- 🎨 **Customizable** - Custom theme, logo, branding per resto
- �� **Multi Payment** - Support QRIS, Virtual Account, Credit Card, Cash
- 👥 **Multi-Role** - Admin, kasir, kitchen dengan akses berbeda
- 📊 **Analytics** - Dashboard lengkap dengan laporan harian/mingguan/bulanan

### Target Users
1. Restoran kecil-menengah
2. Kafe dan coffee shop
3. Warteg dan warung makan
4. Food court
5. Kantin perusahaan/sekolah

---

## Product Requirements Document (PRD)

### 1. Core Features

#### 1.1 Two-Website Architecture
**Requirement:** Platform harus memiliki 2 website terpisah dengan fungsi berbeda

**Website 1: resto.qr.store (Admin/Staff Dashboard)**
- Admin resto bisa register gratis
- Dashboard untuk kelola resto
- Manage menu, harga, kategori
- Generate QR code per meja
- Invite staff (kasir & kitchen)
- View analytics & reports
- Custom theme & branding

**Website 2: qr.store/<resto_id>/ (Customer Ordering)**
- Customer scan QR → redirect ke sini
- Guest checkout (tanpa login)
- User login (dengan history & points)
- Browse menu & add to cart
- Checkout & payment
- Real-time order tracking
- Rating & review

**Acceptance Criteria:**
- [ ] 2 URL berbeda dengan routing yang jelas
- [ ] Authentication terpisah untuk staff vs customer
- [ ] Data terpisah per tenant (multi-tenancy)
- [ ] QR code generate URL dengan format: `qr.store/<resto_id>/?table=<number>`

---

#### 1.2 User Roles & Permissions

**Role: Admin Resto**
- Register gratis via resto.qr.store
- Full access ke dashboard
- CRUD menu, categories, products
- Setting PPN, diskon, service charge
- Generate & download QR codes
- Invite staff via email
- View all reports & analytics
- Custom theme & branding
- Setup payment gateway

**Role: Kasir**
- Login via resto.qr.store/kasir
- Invited by admin (email invitation)
- View incoming orders real-time
- Confirm cash payments
- Print receipts
- Handle refund/void
- View shift reports
- **Cannot:** Edit menu, prices, settings

**Role: Kitchen**
- Login via resto.qr.store/kitchen
- Invited by admin
- View order queue
- Update order status (Processing → Ready → Served)
- Print kitchen tickets
- Mark items unavailable
- **Cannot:** See prices, payments, reports

**Role: User (Customer - Login)**
- Register via qr.store/register
- Login with email/password or OAuth (Google, Facebook, Apple)
- Order history across all restaurants
- Loyalty points per restaurant
- Saved payment methods
- Favorite menus
- Profile management

**Role: Guest (Customer - No Login)**
- Direct access via QR scan
- Browse menu & order
- One-time checkout
- No history or loyalty points
- Can upgrade to User by registering

**Acceptance Criteria:**
- [ ] Role-based access control (RBAC) implemented
- [ ] Staff invitation system via email
- [ ] Permission matrix enforced di backend
- [ ] Guest dapat checkout tanpa register
- [ ] User dapat login dengan OAuth providers

---

#### 1.3 Restaurant Setup Flow

**Registration Process (Admin):**
1. Visit resto.qr.store
2. Click "Daftar Gratis"
3. Fill form:
   - Email
   - Password
   - Restaurant name
   - Restaurant category (cafe/restaurant/warteg/food court)
   - Phone number
4. Email verification
5. First-time setup wizard:
   - Upload logo
   - Choose color theme
   - Set address & operating hours
   - Add first menu items
   - Setup payment methods
   - Generate QR codes for tables

**Acceptance Criteria:**
- [ ] Email verification required
- [ ] Setup wizard bisa di-skip dan dilanjut nanti
- [ ] Restaurant slug auto-generate dari nama (editable)
- [ ] Default theme tersedia jika tidak custom
- [ ] Minimum 1 menu item untuk go-live

---

#### 1.4 Menu Management

**Features Required:**
- Create, Read, Update, Delete menu items
- Categories & subcategories
- Product details:
  - Name
  - Description
  - Price
  - Image (upload)
  - Availability status (available/unavailable)
  - Stock tracking (optional)
- Bulk actions (enable/disable multiple items)
- Duplicate menu items
- Import/export menu (CSV/Excel)

**PPN (Tax) Configuration:**
- Global PPN setting (apply to all products)
- Per-category PPN
- Per-product PPN override
- Include/exclude in display price
- Configurable tax rate (default 11%)

**Discount Configuration:**
- Percentage discount (e.g., 10% off)
- Fixed amount discount (e.g., Rp 5,000 off)
- Time-based discount (Happy Hour: 14:00-16:00)
- Minimum purchase requirement
- Promo codes
- Stacking rules (dapat digabung atau tidak)

**Acceptance Criteria:**
- [ ] CRUD menu dengan image upload
- [ ] Category hierarchy support
- [ ] Real-time availability toggle
- [ ] PPN flexible configuration
- [ ] Multiple discount types
- [ ] Batch operations support

---

#### 1.5 QR Code System

**Requirements:**
- Generate unique QR per table number
- QR content format: `https://qr.store/<resto_id>/?table=<number>`
- Batch generation (e.g., 20 QR sekaligus untuk 20 meja)
- Download options:
  - Individual QR (PNG)
  - Batch download (ZIP)
  - PDF with table numbers (print-ready)
- QR design customization:
  - Add restaurant logo in center
  - Custom colors
  - Include table number in design

**Acceptance Criteria:**
- [ ] QR generator dengan input jumlah meja
- [ ] Batch download dalam ZIP atau PDF
- [ ] QR customizable (logo, color)
- [ ] Print-friendly format (A4 dengan grid)
- [ ] QR dapat di-regenerate jika perlu

---

#### 1.6 Ordering Flow (Customer)

**Guest/User Journey:**
1. Scan QR code di meja
2. Redirect ke `qr.store/<resto_id>/?table=5`
3. See restaurant branding (logo, colors)
4. Browse menu by categories
5. Click product → see details & add to cart
6. Cart shows:
   - Subtotal
   - PPN (if applicable)
   - Service charge (if applicable)
   - Discount (if applicable)
   - **Grand Total**
7. Checkout:
   - Input name (atas nama)
   - Add notes (optional)
   - Choose payment method
8. Payment options:
   - QRIS (scan to pay)
   - Virtual Account (transfer bank)
   - Credit Card
   - Cash (bayar ke kasir)
9. Order confirmation
10. Real-time status tracking:
    - Pending Payment
    - Paid
    - Processing (Kitchen)
    - Ready
    - Served
    - Completed
11. Rating & review (optional)

**Acceptance Criteria:**
- [ ] QR scan langsung ke menu resto yang benar
- [ ] Table number detected & saved in order
- [ ] Cart calculation akurat (PPN + diskon + service)
- [ ] Multiple payment methods integrated
- [ ] Real-time order status updates (WebSocket)
- [ ] Guest checkout tanpa login
- [ ] User login untuk history & points

---

#### 1.7 Payment Integration

**Payment Methods:**
1. **QRIS**
   - Static QRIS (admin upload QR image manually)
   - Dynamic QRIS via payment gateway (auto-generated per transaction)
   
2. **Virtual Account**
   - BCA, Mandiri, BNI, BRI, Permata
   - Auto-generated unique VA per order
   - Expiry time (default 1 hour)

3. **Credit Card**
   - Visa, Mastercard, JCB
   - 3D Secure support

4. **Cash**
   - Customer pilih "Bayar ke Kasir"
   - Order masuk dengan status "Pending Payment"
   - Kasir konfirmasi manual setelah terima uang

**Payment Gateway Integration:**
- **Primary:** Midtrans
- **Alternative:** Xendit, Doku

**Callback & Webhook:**
- Handle payment notification
- Update order status otomatis
- Send confirmation ke customer & kitchen

**Acceptance Criteria:**
- [ ] Integration dengan Midtrans/Xendit
- [ ] Support QRIS, VA, Credit Card, Cash
- [ ] Webhook handler untuk payment notification
- [ ] Auto-update order status
- [ ] Payment expiry handling
- [ ] Refund mechanism

---

#### 1.8 Kitchen Management System

**Kitchen Display:**
- Real-time order queue
- Order details:
  - Table number
  - Order time
  - Items with quantity
  - Special notes
  - Priority/urgency indicator
- Status buttons:
  - "Start Cooking" → Processing
  - "Ready" → Ready for serving
  - "Served" → Served to customer
- Filter by status (New, Processing, Ready)
- Sound/visual notification for new orders
- Auto-print kitchen tickets

**Kitchen Ticket Format:**
```
================================
  WARUNG MAKAN BAHAGIA
================================
Order #: 12345
Table: 5
Time: 14:30
Atas Nama: Budi
================================
ITEMS:
--------------------------------
2x Nasi Goreng Spesial
   Note: Tidak pakai kecap

1x Es Teh Manis
   Note: Gula sedikit

1x Ayam Geprek Level 3
--------------------------------
TOTAL: 2 items
================================
```

**Acceptance Criteria:**
- [ ] Real-time order display dengan WebSocket
- [ ] Sound notification untuk order baru
- [ ] Kitchen ticket auto-print
- [ ] Status update buttons
- [ ] Filter & search orders
- [ ] Mobile-responsive (untuk tablet di kitchen)

---

#### 1.9 Cashier Dashboard

**Kasir Features:**
- View all orders (real-time)
- Filter by:
  - Table number
  - Payment status
  - Order status
  - Date range
- Confirm cash payments
- Print customer receipts
- Void/refund transactions (with notes)
- View shift report:
  - Total orders
  - Total revenue
  - Payment method breakdown
  - Cash in hand

**Customer Receipt Format:**
```
================================
  WARUNG MAKAN BAHAGIA
  Jl. Sudirman No. 123
  Telp: 0812-3456-7890
================================
No. Order: #12345
Tanggal: 17 Nov 2025, 14:30
Table: 5
Kasir: Siti

--------------------------------
ITEMS:
--------------------------------
2x Nasi Goreng Spesial
   @ Rp 25,000        Rp 50,000

1x Es Teh Manis
   @ Rp 5,000         Rp 5,000

1x Ayam Geprek
   @ Rp 20,000        Rp 20,000
--------------------------------
Subtotal             Rp 75,000
PPN 11%               Rp 8,250
Service 5%            Rp 3,750
Diskon               -Rp 5,000
--------------------------------
TOTAL                Rp 82,000
Bayar (Cash)         Rp 100,000
Kembali              Rp 18,000
================================
Terima kasih atas kunjungan Anda!
================================
```

**Acceptance Criteria:**
- [ ] Real-time order monitoring
- [ ] Cash payment confirmation
- [ ] Receipt printing (thermal printer support)
- [ ] Void/refund dengan approval
- [ ] Shift report generation
- [ ] Export reports to Excel

---

#### 1.10 Analytics & Reporting (Admin)

**Dashboard Metrics:**
- Today's revenue
- Today's order count
- Average order value
- Top-selling products
- Payment method breakdown
- Order status distribution
- Peak hours chart

**Reports:**
1. **Sales Report**
   - Daily, weekly, monthly views
   - Revenue trends (line chart)
   - Comparison with previous period
   - Export to Excel/PDF

2. **Product Report**
   - Best sellers (by quantity & revenue)
   - Slow-moving items
   - Stock alerts (if tracking enabled)

3. **Payment Report**
   - Breakdown by method (Cash, QRIS, VA, CC)
   - Settlement status
   - Pending payments

4. **Table Performance**
   - Orders per table
   - Revenue per table
   - Average turnover time

5. **Staff Performance** (if applicable)
   - Orders handled by kasir
   - Average processing time by kitchen

**Acceptance Criteria:**
- [ ] Dashboard dengan real-time metrics
- [ ] Date range filter untuk reports
- [ ] Visual charts (Chart.js atau Recharts)
- [ ] Export to Excel & PDF
- [ ] Responsive untuk mobile view

---

#### 1.11 Theme Customization

**Admin Can Customize:**
- **Logo**
  - Upload restaurant logo
  - Displayed on customer menu
  - Embedded in QR codes
  
- **Colors**
  - Primary color (CTA buttons, headers)
  - Secondary color (accents)
  - Background color
  - Text color
  - Preview before save

- **Banner Image**
  - Hero image on customer menu page
  - Optional carousel for multiple images

- **Typography**
  - Choose from preset font families
  - Font sizes for headings & body

- **Layout Template**
  - Grid view (default)
  - List view
  - Card view

**Preview Mode:**
- Live preview sebelum publish
- Preview di desktop & mobile

**Acceptance Criteria:**
- [ ] Theme editor dengan live preview
- [ ] Color picker untuk custom colors
- [ ] Image upload untuk logo & banner
- [ ] Font selection dengan preview
- [ ] Responsive preview
- [ ] Save & publish theme

---

#### 1.12 Staff Invitation System

**Invite Flow:**
1. Admin masuk ke "Staff Management"
2. Click "Invite Staff"
3. Fill form:
   - Email staff
   - Role (Kasir / Kitchen)
   - Name (optional)
4. System send invitation email
5. Staff click link → set password → access granted

**Invitation Email Template:**
```
Subject: Invitation to join [Restaurant Name] team

Hi,

You've been invited by [Admin Name] to join [Restaurant Name] 
as a [Role] on QR Restaurant Platform.

Click the link below to accept the invitation and set your password:
[Invitation Link]

This link will expire in 48 hours.

---
QR Restaurant Platform
```

**Staff Management (Admin View):**
- List of all staff members
- See role & status (Active, Invited, Inactive)
- Resend invitation
- Revoke access
- Change role

**Acceptance Criteria:**
- [ ] Email invitation system
- [ ] Invitation link dengan expiry (48 hours)
- [ ] Staff dapat set password
- [ ] Admin dapat revoke access
- [ ] Admin dapat change role
- [ ] Resend invitation jika expired

---

#### 1.13 User Features (Customer Login)

**Benefits untuk User yang Login:**
1. **Order History**
   - See all past orders across all restaurants
   - Reorder favorite items
   - Track order status

2. **Loyalty Points** (optional per resto)
   - Earn points per transaction
   - Redeem for discounts
   - View points balance per restaurant

3. **Saved Payment Methods**
   - Save credit card info (tokenized)
   - Quick checkout next time

4. **Favorite Menus**
   - Bookmark favorite items
   - Quick access to favorites

5. **Profile Management**
   - Edit name, phone, email
   - Change password
   - Notification preferences

**Registration Options:**
- Email & password
- Google Sign-In
- Facebook Login
- Apple Sign-In (for iOS)

**Acceptance Criteria:**
- [ ] User registration dengan email verification
- [ ] OAuth integration (Google, Facebook, Apple)
- [ ] Order history across restaurants
- [ ] Loyalty points system (optional)
- [ ] Saved payment methods (PCI compliant)
- [ ] Favorite menus dengan quick add

---

### 2. Non-Functional Requirements

#### 2.1 Performance
- Page load time < 3 seconds
- API response time < 500ms
- Support 100 concurrent orders per restaurant
- Real-time updates dengan latency < 1 second

#### 2.2 Security
- HTTPS untuk semua endpoints
- JWT authentication dengan refresh tokens
- Role-based access control (RBAC)
- SQL injection prevention (ORM)
- XSS protection
- CSRF tokens
- Rate limiting untuk API endpoints
- PCI DSS compliance untuk payment data

#### 2.3 Scalability
- Multi-tenant architecture (1 database, isolated data)
- Horizontal scaling support
- Database indexing untuk performance
- CDN untuk static assets
- Caching (Redis) untuk frequent queries

#### 2.4 Availability
- 99.5% uptime target
- Database backups (daily)
- Disaster recovery plan
- Monitoring & alerting (Sentry)

#### 2.5 Usability
- Mobile-first responsive design
- Accessible (WCAG AA compliance)
- Multi-language support (ID, EN) - future
- Intuitive UI/UX
- Onboarding wizard untuk new admins

---

## Functional Requirements Document (FRD)

### Module 1: Authentication & Authorization

#### FR-1.1: Admin Registration
**Function:** Allow restaurant owners to register for free

**Input:**
- Email (unique)
- Password (min 8 chars, 1 uppercase, 1 number)
- Restaurant name
- Restaurant category
- Phone number

**Process:**
1. Validate form inputs
2. Check email uniqueness
3. Hash password (bcrypt)
4. Create restaurant record
5. Create admin user linked to restaurant
6. Send verification email
7. Create default settings for restaurant

**Output:**
- Success message
- Verification email sent
- Redirect to email verification page

**Validation Rules:**
- Email format valid
- Password strength check
- Restaurant name min 3 chars
- Phone number format valid (Indonesia)

**Error Handling:**
- Email already exists → "Email sudah terdaftar"
- Weak password → "Password harus minimal 8 karakter dengan 1 huruf besar dan 1 angka"
- Network error → "Gagal mengirim email verifikasi, coba lagi"

---

#### FR-1.2: Email Verification
**Function:** Verify admin email before allowing full access

**Input:**
- Verification token from email link

**Process:**
1. Validate token
2. Check token expiry (24 hours)
3. Update user status to "verified"
4. Auto-login user

**Output:**
- Success message
- Redirect to setup wizard or dashboard

**Error Handling:**
- Invalid token → "Link verifikasi tidak valid"
- Expired token → "Link sudah expired, kirim ulang"
- Already verified → Redirect to login

---

#### FR-1.3: Staff Invitation
**Function:** Admin can invite kasir and kitchen staff

**Input:**
- Staff email
- Role (kasir/kitchen)
- Staff name (optional)

**Process:**
1. Generate invitation token
2. Create pending staff record
3. Send invitation email with link
4. Set expiry (48 hours)

**Output:**
- Success message
- Email sent to staff

**Error Handling:**
- Email already invited → "Email sudah diundang"
- Email already registered → "Email sudah terdaftar sebagai staff"

---

#### FR-1.4: Staff Acceptance
**Function:** Staff accept invitation and set password

**Input:**
- Invitation token
- Password
- Confirm password

**Process:**
1. Validate token & expiry
2. Check password match
3. Hash password
4. Activate staff account
5. Send welcome email

**Output:**
- Success message
- Redirect to staff login page

---

#### FR-1.5: User Registration (Customer)
**Function:** Customers can register for order history & loyalty

**Input:**
- Email or OAuth provider (Google/Facebook/Apple)
- Password (if email registration)
- Name
- Phone (optional)

**Process:**
1. Validate inputs
2. Create customer record
3. Send verification email (if email registration)
4. For OAuth: fetch profile from provider

**Output:**
- Success message
- Auto-login for OAuth
- Email verification required for email registration

---

#### FR-1.6: Login (All Users)
**Function:** Authenticate users and provide JWT tokens

**Input:**
- Email
- Password
- User type (staff/customer)

**Process:**
1. Validate credentials
2. Check account status (active/verified)
3. Generate JWT access token (15 min expiry)
4. Generate refresh token (7 days expiry)
5. Return tokens

**Output:**
- Access token
- Refresh token
- User profile data
- Redirect to appropriate dashboard

**Error Handling:**
- Invalid credentials → "Email atau password salah"
- Unverified email → "Silakan verifikasi email terlebih dahulu"
- Inactive account → "Akun tidak aktif, hubungi admin"

---

### Module 2: Restaurant Setup

#### FR-2.1: Restaurant Profile
**Function:** Admin can edit restaurant information

**Input:**
- Restaurant name
- Category
- Address
- Phone
- Email (contact)
- Operating hours
- Description

**Process:**
1. Validate inputs
2. Update restaurant record
3. Generate/update slug if name changed
4. Clear cache

**Output:**
- Success message
- Updated profile displayed

---

#### FR-2.2: Theme Customization
**Function:** Customize restaurant branding

**Input:**
- Logo image (upload)
- Primary color (hex)
- Secondary color (hex)
- Background color (hex)
- Font family
- Banner images (upload multiple)

**Process:**
1. Validate image formats (jpg, png, max 2MB)
2. Upload images to S3/Cloudinary
3. Save theme settings to database
4. Clear cache
5. Generate preview URL

**Output:**
- Live preview
- Success message

---

#### FR-2.3: Menu Categories
**Function:** Create and manage menu categories

**Input:**
- Category name
- Parent category (optional for subcategories)
- Display order
- Icon (optional)

**Process:**
1. Validate name uniqueness within restaurant
2. Create category record
3. Update display order of other categories

**Output:**
- Success message
- Updated category list

**Business Rules:**
- Max 2 levels (category → subcategory)
- Category name unique per restaurant
- Cannot delete category with products

---

#### FR-2.4: Menu Products
**Function:** Add and manage menu items

**Input:**
- Product name
- Category
- Description
- Price
- Image (upload)
- Availability status
- Stock quantity (optional)
- PPN override (optional)
- Discount (optional)

**Process:**
1. Validate inputs
2. Upload image to storage
3. Create product record
4. Apply default PPN if not overridden
5. Calculate display price

**Output:**
- Success message
- Product added to menu list

**Calculation Logic:**
```
Display Price = Base Price × (1 + PPN%) - Discount
```

**Business Rules:**
- Product name unique per category
- Price must be > 0
- Image max 2MB
- Description max 500 chars

---

#### FR-2.5: PPN Configuration
**Function:** Set tax rules for products

**Input:**
- Tax type: None / Global / Category / Product
- Tax rate (percentage, default 11%)
- Include in price or separate

**Process:**
1. Save tax settings
2. Recalculate all product display prices
3. Update menu

**Output:**
- Success message
- Updated menu with new prices

**Examples:**
- **Include in price:** Price Rp 25,000 → Customer pays Rp 25,000 (PPN included)
- **Separate:** Price Rp 25,000 → Customer pays Rp 27,750 (price + 11% PPN)

---

#### FR-2.6: Discount Configuration
**Function:** Set discount rules

**Input:**
- Discount type: Percentage / Fixed / Time-based / Promo code
- Value
- Min purchase (optional)
- Valid dates
- Applicable products/categories

**Process:**
1. Validate discount logic
2. Save discount rules
3. Apply to eligible products

**Output:**
- Active discount displayed on menu

**Business Rules:**
- Discount cannot exceed product price
- Time-based discount auto-enable/disable by schedule
- Promo code can be single-use or multi-use

---

#### FR-2.7: Table Management
**Function:** Define tables and generate QR codes

**Input:**
- Number of tables
- Table naming format (e.g., "Table 1", "T-1", "A1")

**Process:**
1. Create table records (1 to N)
2. Generate unique QR codes for each table
3. QR content: `https://qr.store/{resto_id}/?table={number}`
4. Store QR images

**Output:**
- List of tables with QR codes
- Batch download option (ZIP/PDF)

**QR Generation Options:**
- Individual PNG files
- Combined PDF (grid layout, print-ready)
- Custom QR design with logo

---

#### FR-2.8: Payment Gateway Setup
**Function:** Configure payment methods

**Input:**
- Payment provider (Midtrans/Xendit)
- API keys (Merchant ID, Client Key, Server Key)
- Enable/disable payment methods:
  - QRIS
  - Virtual Account (select banks)
  - Credit Card
  - Cash
- Static QRIS image (if not using dynamic)

**Process:**
1. Validate API keys by test transaction
2. Save encrypted keys
3. Enable selected payment methods

**Output:**
- Success message
- Payment methods active

**Security:**
- API keys encrypted in database
- Never expose in frontend

---

### Module 3: Ordering System (Customer)

#### FR-3.1: QR Code Scan & Landing
**Function:** Customer scans QR and lands on restaurant menu

**Input:**
- QR scan redirects to URL: `qr.store/{resto_id}/?table={number}`

**Process:**
1. Parse URL parameters (resto_id, table)
2. Fetch restaurant data (profile, theme, menu, settings)
3. Create anonymous session with table number
4. Apply theme styling
5. Display menu

**Output:**
- Branded restaurant menu page
- Table number badge visible

**Error Handling:**
- Invalid resto_id → "Restoran tidak ditemukan"
- Invalid table number → Prompt to select table manually

---

#### FR-3.2: Browse Menu
**Function:** Display categorized menu with search and filter

**Input:**
- Search query (optional)
- Category filter (optional)
- Sort by: Name, Price, Popular

**Process:**
1. Fetch available products (status = available)
2. Apply search filter (product name, description)
3. Group by categories
4. Apply sort

**Output:**
- Categorized product list
- Product cards with:
  - Image
  - Name
  - Description (truncated)
  - Price (after PPN & discount)
  - Availability indicator

**Business Rules:**
- Unavailable items greyed out
- Out of stock items hidden (if stock tracking enabled)

---

#### FR-3.3: Product Details
**Function:** Show full product information

**Input:**
- Product ID

**Process:**
1. Fetch product details
2. Display full description
3. Show price breakdown (base price, PPN, discount)
4. Show product image (full size)

**Output:**
- Product detail modal/page
- Add to cart button
- Quantity selector

---

#### FR-3.4: Add to Cart
**Function:** Add selected products to shopping cart

**Input:**
- Product ID
- Quantity
- Special notes (optional)

**Process:**
1. Validate product availability
2. Add to session cart
3. Calculate subtotal
4. Store in local storage (for persistence)

**Output:**
- Success message (toast)
- Updated cart badge count
- Cart total updated

**Business Rules:**
- Max quantity per item: 99
- Cannot add unavailable items

---

#### FR-3.5: Cart Management
**Function:** Review and modify cart before checkout

**Input:**
- Update quantity
- Remove item
- Add notes

**Process:**
1. Recalculate totals on every change
2. Validate product still available
3. Update session cart

**Output:**
- Updated cart summary:
  - Subtotal
  - PPN (if applicable)
  - Service charge (if applicable)
  - Discount (if applicable)
  - **Grand Total**

**Calculation Example:**
```
Item 1: Nasi Goreng × 2 = Rp 50,000
Item 2: Es Teh × 1 = Rp 5,000
------------------------------------
Subtotal                = Rp 55,000
PPN 11%                 = Rp 6,050
Service Charge 5%       = Rp 2,750
Discount (Promo)        = -Rp 5,000
------------------------------------
Grand Total             = Rp 58,800
```

---

#### FR-3.6: Checkout
**Function:** Finalize order and proceed to payment

**Input:**
- Customer name (atas nama)
- Phone number (optional)
- Payment method selection
- Order notes (optional)

**Process:**
1. Validate cart not empty
2. Final price calculation
3. Create order record (status: Pending Payment)
4. Generate order ID
5. Redirect to payment or show payment instructions

**Output:**
- Order confirmation page
- Payment instructions (QRIS/VA/CC form)
- Order ID for tracking

**Business Rules:**
- Minimum order value (if configured)
- Validate payment method enabled
- Lock cart items (prevent price changes)

---

#### FR-3.7: Payment Processing
**Function:** Handle different payment methods

**QRIS:**
1. Generate dynamic QRIS via payment gateway
2. Display QR code for scanning
3. Wait for payment notification webhook
4. Auto-update order status when paid

**Virtual Account:**
1. Generate unique VA number via payment gateway
2. Display VA number & payment instructions
3. Set expiry time (default 1 hour)
4. Listen for payment webhook
5. Auto-update when paid

**Credit Card:**
1. Redirect to payment gateway hosted page (3D Secure)
2. Process payment
3. Return to platform with payment result
4. Update order status

**Cash:**
1. Mark order as "Pending Payment - Cash"
2. Send order to kitchen immediately (some restos prefer this)
3. Kasir confirm payment manually later

**Output:**
- Payment confirmation
- Order sent to kitchen (if paid)
- Receipt/invoice

---

#### FR-3.8: Order Tracking
**Function:** Real-time order status updates

**Input:**
- Order ID from URL or session

**Process:**
1. Establish WebSocket connection
2. Subscribe to order updates
3. Receive real-time status changes
4. Display status visually

**Status Flow:**
```
Pending Payment → Paid → Processing → Ready → Served → Completed
```

**Visual Indicators:**
- Progress bar
- Status badges with colors
- Estimated completion time

**Notifications:**
- Browser notification when status changes (if permitted)
- Sound alert when order ready

---

#### FR-3.9: Rating & Review
**Function:** Customer can rate their experience

**Input:**
- Overall rating (1-5 stars)
- Review text (optional, max 500 chars)
- Upload photos (optional, max 3 images)

**Process:**
1. Validate order completed
2. Check not already reviewed
3. Save rating & review
4. Update restaurant average rating
5. Update product ratings (if specific products reviewed)

**Output:**
- Success message
- Thank you note

**Business Rules:**
- Can only review completed orders
- One review per order
- Cannot edit review after submission (admin can moderate)

---

### Module 4: Kitchen Management

#### FR-4.1: Order Queue Display
**Function:** Show all incoming orders in real-time

**Input:**
- WebSocket connection from kitchen dashboard

**Process:**
1. Connect to order stream
2. Filter orders by status (New, Processing)
3. Sort by order time (oldest first)
4. Display order cards with details

**Output:**
- List of active orders
- Each order shows:
  - Order ID
  - Table number
  - Order time
  - Items with quantity & notes
  - Status buttons
  - Priority indicator (long wait time)

**Visual Design:**
- Color-coded by urgency (green < 10min, yellow 10-20min, red > 20min)
- Large text for easy reading from distance
- Sound notification for new orders

---

#### FR-4.2: Update Order Status
**Function:** Kitchen staff update cooking progress

**Input:**
- Order ID
- New status (Processing / Ready / Served)

**Process:**
1. Validate status transition allowed
2. Update order status in database
3. Broadcast update via WebSocket (to customer & kasir)
4. Log timestamp for analytics

**Output:**
- Visual confirmation on kitchen display
- Order moved to next status section
- Notification sent to customer

**Status Transitions:**
- New → Processing (when kitchen starts cooking)
- Processing → Ready (when food ready for pickup)
- Ready → Served (when delivered to table)

---

#### FR-4.3: Kitchen Ticket Printing
**Function:** Auto-print order details when order comes in

**Input:**
- New order created (trigger)

**Process:**
1. Listen for new paid orders
2. Format order data for kitchen ticket
3. Send to thermal printer via API/driver
4. Log print status

**Output:**
- Printed kitchen ticket with:
  - Order ID
  - Table number
  - Time
  - Items with notes
  - Special instructions

**Printer Integration:**
- Support ESC/POS protocol (standard thermal printers)
- Network printer or USB printer
- Fallback: PDF generation for manual print

---

#### FR-4.4: Mark Item Unavailable
**Function:** Kitchen can quickly disable sold-out items

**Input:**
- Product ID
- Reason (optional)

**Process:**
1. Update product availability status to false
2. Broadcast change to all active menu sessions
3. Hide product from customer menu

**Output:**
- Product greyed out on menu
- Notification to admin (optional)

**Business Rules:**
- Can re-enable anytime
- Does not affect active carts (they can still checkout)

---

### Module 5: Cashier Management

#### FR-5.1: Order Monitoring
**Function:** Kasir sees all orders in real-time

**Input:**
- WebSocket connection

**Process:**
1. Display all orders with status
2. Highlight orders needing attention (pending payment, ready for serve)
3. Filter by status/payment method/table

**Output:**
- Order list with:
  - Order ID
  - Table number
  - Status
  - Payment method
  - Total amount
  - Quick actions (confirm payment, print receipt)

---

#### FR-5.2: Confirm Cash Payment
**Function:** Kasir manually confirm cash payments

**Input:**
- Order ID
- Amount received
- Amount returned (change)

**Process:**
1. Mark order as Paid
2. Send order to kitchen
3. Log payment transaction
4. Update shift report

**Output:**
- Order status updated to Paid
- Receipt printed (optional)
- Notification to kitchen

---

#### FR-5.3: Print Customer Receipt
**Function:** Generate and print customer receipt

**Input:**
- Order ID

**Process:**
1. Fetch order details
2. Format receipt with:
   - Restaurant info
   - Order items & prices
   - PPN, service, discount breakdown
   - Total & payment method
   - Thank you message
3. Send to printer

**Output:**
- Printed thermal receipt

---

#### FR-5.4: Void/Refund Transaction
**Function:** Cancel or refund orders with proper authorization

**Input:**
- Order ID
- Reason for void/refund
- Admin approval (if amount > threshold)

**Process:**
1. Validate order can be voided (not yet served)
2. Request admin approval if needed
3. Reverse payment (if paid via gateway)
4. Update order status to Voided
5. Log transaction

**Output:**
- Success message
- Refund confirmation
- Updated reports

**Business Rules:**
- Cannot void completed orders
- Refund to original payment method
- Admin approval required for refunds > Rp 50,000

---

#### FR-5.5: Shift Report
**Function:** Generate end-of-shift summary for kasir

**Input:**
- Date range (shift start/end time)
- Kasir ID

**Process:**
1. Query all orders handled by kasir in timeframe
2. Calculate:
   - Total orders
   - Total revenue
   - Payment method breakdown (cash, QRIS, VA, CC)
   - Cash in hand (cash payments - refunds)
   - Average order value
3. Generate PDF report

**Output:**
- Shift summary dashboard
- Downloadable PDF report

---

### Module 6: Analytics & Reporting (Admin)

#### FR-6.1: Dashboard Overview
**Function:** Show key metrics at a glance

**Metrics:**
- Today's Revenue (vs yesterday)
- Today's Order Count (vs yesterday)
- Average Order Value
- Active orders right now
- Most popular product today

**Visual Elements:**
- Line chart: Revenue trend (last 7 days)
- Bar chart: Orders by hour
- Pie chart: Payment method distribution
- Table: Top 5 selling products

**Real-time Updates:**
- Revenue counter updates on new orders
- Order count increments live

---

#### FR-6.2: Sales Report
**Function:** Detailed revenue analysis

**Input:**
- Date range (today, yesterday, this week, this month, custom)
- Group by: Day, Week, Month

**Process:**
1. Query orders in date range
2. Group by selected time unit
3. Calculate revenue, order count, average value
4. Generate comparison with previous period

**Output:**
- Summary metrics:
  - Total revenue
  - Total orders
  - Average order value
  - Growth percentage
- Charts:
  - Revenue trend line
  - Order count bars
- Data table with daily/weekly/monthly breakdown
- Export to Excel/PDF button

---

#### FR-6.3: Product Performance Report
**Function:** Identify best sellers and slow-moving items

**Input:**
- Date range
- Sort by: Quantity sold, Revenue generated

**Process:**
1. Query order items in date range
2. Group by product
3. Sum quantities & revenue
4. Calculate percentage of total

**Output:**
- Table:
  - Product name
  - Quantity sold
  - Revenue
  - % of total revenue
- Highlight top 10 best sellers
- Flag products with 0 sales (consider removing)

---

#### FR-6.4: Payment Method Report
**Function:** Analyze payment preferences

**Input:**
- Date range

**Process:**
1. Group orders by payment method
2. Calculate totals & percentages

**Output:**
- Pie chart: Payment method distribution
- Table:
  - Payment method
  - Order count
  - Total revenue
  - % of total

**Insights:**
- Most preferred payment method
- Cash handling amount (for reconciliation)

---

#### FR-6.5: Export Reports
**Function:** Download reports for offline analysis

**Input:**
- Report type
- Date range
- Export format (Excel / PDF)

**Process:**
1. Generate report data
2. Format as Excel (XLSX) or PDF
3. Trigger download

**Output:**
- Downloadable file

**Excel Format:**
- Multiple sheets (summary, detailed data, charts)
- Formatted tables with headers

**PDF Format:**
- Professional layout with restaurant logo
- Charts and tables
- Page numbers & generation date

---

## Technical Specifications

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
├─────────────────────┬───────────────────────────────────┤
│  Customer Frontend  │   Admin/Staff Dashboard           │
│  (Next.js)          │   (React + shadcn/ui)             │
│  qr.store/<id>/     │   resto.qr.store                  │
└──────────┬──────────┴──────────┬────────────────────────┘
           │                     │
           └─────────┬───────────┘
                     │
           ┌─────────▼──────────┐
           │    API Gateway      │
           │  (Nginx/Traefik)    │
           └─────────┬──────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐  ┌───▼─────┐  ┌──▼──────┐
│  Django    │  │ Django  │  │ Django  │
│  REST API  │  │ Channels│  │ Celery  │
│            │  │(WebSocket)  │ (Tasks) │
└──────┬─────┘  └────┬────┘  └────┬────┘
       │             │            │
       └──────┬──────┴────────────┘
              │
    ┌─────────▼──────────┐
    │    PostgreSQL      │
    │    (Main DB)       │
    └────────────────────┘
              │
    ┌─────────▼──────────┐
    │       Redis        │
    │  (Cache + Celery)  │
    └────────────────────┘
```

### Tech Stack Details

**Backend:**
```
- Python 3.11+
- Django 5.0+
- Django REST Framework 3.14+
- Django Channels 4.0+ (WebSocket)
- Celery 5.3+ (Background tasks)
- PostgreSQL 15+
- Redis 7+
```

**Frontend Customer:**
```
- Next.js 14+ (React 18+)
- TypeScript
- TailwindCSS 3+
- shadcn/ui components
- Zustand (state management)
- React Query (data fetching)
- Socket.io-client (WebSocket)
```

**Frontend Admin:**
```
- React 18+
- TypeScript
- Vite (build tool)
- TailwindCSS
- shadcn/ui or Ant Design
- React Router
- React Query
- Recharts (for charts)
```

**Infrastructure:**
```
- Deployment: Railway / Fly.io / DigitalOcean
- Frontend CDN: Vercel / Netlify
- Database: Supabase / Neon / Railway
- File Storage: AWS S3 / Cloudinary
- Payment: Midtrans / Xendit
- Email: SendGrid / Mailgun
- Monitoring: Sentry
- Analytics: Mixpanel / PostHog (optional)
```

---

## Database Schema

### Core Tables

#### 1. restaurants
```sql
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    description TEXT,
    
    -- Operating hours (JSON)
    operating_hours JSONB,
    -- Example: {"monday": {"open": "08:00", "close": "22:00", "closed": false}}
    
    -- Settings
    settings JSONB DEFAULT '{}',
    -- Example: {"allow_guest_order": true, "auto_print_kitchen": true}
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    is_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_status ON restaurants(status);
```

#### 2. restaurant_themes
```sql
CREATE TABLE restaurant_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    -- Branding
    logo_url TEXT,
    banner_urls JSONB, -- Array of banner image URLs
    favicon_url TEXT,
    
    -- Colors
    primary_color VARCHAR(7) DEFAULT '#667eea',
    secondary_color VARCHAR(7) DEFAULT '#764ba2',
    background_color VARCHAR(7) DEFAULT '#ffffff',
    text_color VARCHAR(7) DEFAULT '#2d3748',
    
    -- Typography
    font_family VARCHAR(50) DEFAULT 'Inter',
    
    -- Layout
    layout_template VARCHAR(20) DEFAULT 'grid', -- grid, list, card
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id)
);
```

#### 3. users (Staff: Admin, Kasir, Kitchen)
```sql
CREATE TABLE staff_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    name VARCHAR(100),
    phone VARCHAR(20),
    
    role VARCHAR(20) NOT NULL, -- admin, kasir, kitchen
    
    status VARCHAR(20) DEFAULT 'invited', -- invited, active, inactive
    
    -- Invitation
    invitation_token VARCHAR(255),
    invitation_expires_at TIMESTAMP,
    
    -- Auth
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_staff_users_restaurant ON staff_users(restaurant_id);
CREATE INDEX idx_staff_users_email ON staff_users(email);
CREATE INDEX idx_staff_users_role ON staff_users(role);
```

#### 4. customers (User yang login)
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- NULL if OAuth only
    
    name VARCHAR(100),
    phone VARCHAR(20),
    
    -- OAuth
    oauth_provider VARCHAR(20), -- google, facebook, apple
    oauth_id VARCHAR(255),
    
    -- Profile
    avatar_url TEXT,
    
    -- Auth
    email_verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_oauth ON customers(oauth_provider, oauth_id);
```

#### 5. categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    display_order INTEGER DEFAULT 0,
    icon_url TEXT,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id, slug)
);

CREATE INDEX idx_categories_restaurant ON categories(restaurant_id);
CREATE INDEX idx_categories_parent ON categories(parent_id);
```

#### 6. products
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    display_price DECIMAL(10, 2), -- Calculated after PPN & discount
    
    -- Tax
    ppn_override DECIMAL(5, 2), -- NULL = use restaurant default
    ppn_included BOOLEAN DEFAULT false,
    
    -- Stock
    track_stock BOOLEAN DEFAULT false,
    stock_quantity INTEGER,
    
    -- Media
    image_url TEXT,
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    
    -- Analytics
    view_count INTEGER DEFAULT 0,
    order_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id, slug)
);

CREATE INDEX idx_products_restaurant ON products(restaurant_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
```

#### 7. tables
```sql
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    table_number VARCHAR(20) NOT NULL,
    table_name VARCHAR(50), -- Optional display name
    
    capacity INTEGER,
    
    -- QR Code
    qr_code_url TEXT,
    qr_content TEXT, -- The URL encoded in QR
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id, table_number)
);

CREATE INDEX idx_tables_restaurant ON tables(restaurant_id);
```

#### 8. orders
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable: ORD-20251117-001
    
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    
    -- Customer
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- NULL for guest
    customer_name VARCHAR(100) NOT NULL, -- "Atas nama"
    customer_phone VARCHAR(20),
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    ppn_amount DECIMAL(10, 2) DEFAULT 0,
    ppn_rate DECIMAL(5, 2),
    service_charge_amount DECIMAL(10, 2) DEFAULT 0,
    service_charge_rate DECIMAL(5, 2),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Payment
    payment_method VARCHAR(20), -- qris, va, credit_card, cash
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    paid_at TIMESTAMP,
    
    -- Payment Gateway
    payment_gateway_order_id VARCHAR(255),
    payment_gateway_transaction_id VARCHAR(255),
    
    -- Order Status
    status VARCHAR(20) DEFAULT 'pending_payment', 
    -- pending_payment, paid, processing, ready, served, completed, cancelled
    
    -- Notes
    customer_notes TEXT,
    kitchen_notes TEXT,
    
    -- Staff
    kasir_id UUID REFERENCES staff_users(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### 9. order_items
```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    
    -- Snapshot at order time (in case product deleted/changed)
    product_name VARCHAR(200) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    
    notes TEXT, -- Special request for this item
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

#### 10. discounts
```sql
CREATE TABLE discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    type VARCHAR(20) NOT NULL, -- percentage, fixed, promo_code
    value DECIMAL(10, 2) NOT NULL,
    
    -- Promo code
    code VARCHAR(50) UNIQUE,
    
    -- Time-based
    start_time TIME,
    end_time TIME,
    days_of_week INTEGER[], -- [1,2,3] for Mon-Wed
    
    -- Validity
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    
    -- Rules
    min_purchase DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    
    -- Usage
    usage_limit INTEGER, -- NULL = unlimited
    usage_count INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_discounts_restaurant ON discounts(restaurant_id);
CREATE INDEX idx_discounts_code ON discounts(code);
```

#### 11. reviews
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    
    images JSONB, -- Array of image URLs
    
    is_visible BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);
CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_customer ON reviews(customer_id);
```

#### 12. payment_transactions
```sql
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    -- Payment Gateway
    gateway VARCHAR(20), -- midtrans, xendit
    gateway_order_id VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    
    payment_method VARCHAR(20),
    
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20), -- pending, success, failed, expired
    
    -- Details
    payment_details JSONB, -- VA number, QRIS URL, etc.
    
    paid_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_gateway_order ON payment_transactions(gateway_order_id);
```

#### 13. loyalty_points
```sql
CREATE TABLE loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    points INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(restaurant_id, customer_id)
);

CREATE INDEX idx_loyalty_points_customer ON loyalty_points(customer_id);
```

#### 14. loyalty_transactions
```sql
CREATE TABLE loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loyalty_points_id UUID NOT NULL REFERENCES loyalty_points(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    type VARCHAR(20), -- earn, redeem, expire
    points INTEGER NOT NULL,
    description TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loyalty_transactions_loyalty ON loyalty_transactions(loyalty_points_id);
```

---

## API Endpoints

### Authentication & Authorization

#### Staff (Admin/Kasir/Kitchen)

```
POST   /api/auth/staff/register
POST   /api/auth/staff/login
POST   /api/auth/staff/refresh
POST   /api/auth/staff/logout
POST   /api/auth/staff/verify-email
POST   /api/auth/staff/forgot-password
POST   /api/auth/staff/reset-password
```

#### Customer

```
POST   /api/auth/customer/register
POST   /api/auth/customer/login
POST   /api/auth/customer/oauth/google
POST   /api/auth/customer/oauth/facebook
POST   /api/auth/customer/refresh
POST   /api/auth/customer/logout
```

---

### Restaurant Management (Admin)

```
GET    /api/restaurants/me
PUT    /api/restaurants/me
POST   /api/restaurants/setup-wizard

GET    /api/restaurants/me/theme
PUT    /api/restaurants/me/theme

GET    /api/restaurants/me/settings
PUT    /api/restaurants/me/settings
```

---

### Staff Management (Admin)

```
GET    /api/staff
POST   /api/staff/invite
DELETE /api/staff/:id
PUT    /api/staff/:id/role
POST   /api/staff/:id/resend-invitation
```

---

### Menu Management (Admin)

```
# Categories
GET    /api/categories
POST   /api/categories
GET    /api/categories/:id
PUT    /api/categories/:id
DELETE /api/categories/:id

# Products
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
PATCH  /api/products/:id/availability
POST   /api/products/bulk-update

# Discounts
GET    /api/discounts
POST   /api/discounts
GET    /api/discounts/:id
PUT    /api/discounts/:id
DELETE /api/discounts/:id
```

---

### Table Management (Admin)

```
GET    /api/tables
POST   /api/tables
POST   /api/tables/batch-create
GET    /api/tables/:id
PUT    /api/tables/:id
DELETE /api/tables/:id
GET    /api/tables/:id/qr-code
POST   /api/tables/download-qr-batch
```

---

### Customer Ordering (Guest/User)

```
# Public Menu
GET    /api/public/restaurants/:slug
GET    /api/public/restaurants/:slug/menu
GET    /api/public/products/:id

# Cart (Session-based for guest, DB for user)
GET    /api/cart
POST   /api/cart/add
PUT    /api/cart/update
DELETE /api/cart/remove
POST   /api/cart/clear

# Checkout
POST   /api/orders/create
GET    /api/orders/:id
POST   /api/orders/:id/payment

# Order Tracking
GET    /api/orders/:id/status
```

---

### Order Management (Kasir/Kitchen)

```
# Kasir
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders/:id/confirm-payment
POST   /api/orders/:id/void
POST   /api/orders/:id/print-receipt

# Kitchen
GET    /api/kitchen/orders
PUT    /api/kitchen/orders/:id/status
POST   /api/kitchen/orders/:id/print-ticket
```

---

### Analytics & Reports (Admin)

```
GET    /api/analytics/dashboard
GET    /api/analytics/sales?from=&to=&group_by=
GET    /api/analytics/products?from=&to=
GET    /api/analytics/payments?from=&to=
GET    /api/reports/export?type=&format=&from=&to=
```

---

### Reviews

```
# Customer
POST   /api/orders/:id/review

# Admin
GET    /api/reviews
PUT    /api/reviews/:id/visibility
DELETE /api/reviews/:id
```

---

### WebSocket Events

```
# Client → Server
join_restaurant:{restaurant_id}
join_order:{order_id}

# Server → Client
order:created
order:status_changed
order:payment_confirmed
product:availability_changed
```

---

## User Flows

### Flow 1: Admin Setup New Restaurant

```
1. Visit resto.qr.store
2. Click "Daftar Gratis"
3. Fill registration form (email, password, resto name)
4. Verify email
5. Setup Wizard:
   a. Upload logo & choose theme
   b. Add categories (e.g., Makanan, Minuman)
   c. Add first products (name, price, image)
   d. Set PPN & service charge settings
   e. Create tables & generate QR codes
   f. Setup payment gateway (Midtrans API keys)
6. Download QR codes (PDF)
7. Print & place on tables
8. Go live!
```

---

### Flow 2: Customer Order (Guest)

```
1. Customer duduk di meja 5
2. Scan QR code di meja
3. Redirect ke: qr.store/warung-bahagia/?table=5
4. Browse menu (see logo, branding, prices)
5. Add 2x Nasi Goreng, 1x Es Teh to cart
6. Click "Checkout"
7. Fill name: "Budi"
8. Review total: Rp 58,800 (includes PPN & service)
9. Choose payment: QRIS
10. Scan QRIS with e-wallet
11. Payment confirmed → Order sent to kitchen
12. Track status: Pending → Paid → Processing → Ready → Served
13. Receive order
14. (Optional) Rate & review
```

---

### Flow 3: Kitchen Process Order

```
1. Kitchen staff login to resto.qr.store/kitchen
2. New order notification (sound alert)
3. Kitchen ticket auto-prints
4. See order details:
   - Table 5
   - 2x Nasi Goreng, 1x Es Teh
   - Notes: "Nasi goreng tidak pakai kecap"
5. Click "Start Cooking" → Status: Processing
6. Cook the food
7. Click "Ready" → Status: Ready
8. Waiter delivers to table 5
9. Click "Served" → Status: Served
10. Order completed
```

---

### Flow 4: Kasir Confirm Cash Payment

```
1. Customer order with "Cash" payment method
2. Order goes to kitchen (status: Pending Payment)
3. Food is ready & served
4. Customer pays cash to kasir
5. Kasir login to resto.qr.store/kasir
6. Find order #12345 (Table 5)
7. Click "Confirm Payment"
8. Enter: Received Rp 100,000, Return Rp 18,000
9. Print receipt for customer
10. Order status: Completed
```

---

## Development Roadmap

### Phase 1: MVP (Weeks 1-4)

**Week 1: Backend Foundation**
- [ ] Django project setup
- [ ] Database schema creation
- [ ] User models (staff, customer)
- [ ] Restaurant model
- [ ] JWT authentication

**Week 2: Restaurant Setup**
- [ ] Registration & email verification
- [ ] Restaurant CRUD APIs
- [ ] Category & product CRUD
- [ ] Basic PPN calculation
- [ ] Table & QR code generation

**Week 3: Ordering System**
- [ ] Public menu API
- [ ] Cart management (session)
- [ ] Order creation
- [ ] Basic payment integration (Midtrans QRIS)
- [ ] Order status management

**Week 4: Frontend MVP**
- [ ] Customer menu page (Next.js)
- [ ] Add to cart & checkout UI
- [ ] Admin dashboard (React) - basic
- [ ] Menu management UI
- [ ] QR code generator UI

---

### Phase 2: Core Features (Weeks 5-8)

**Week 5: Multi-Payment & Kitchen**
- [ ] Virtual Account integration
- [ ] Credit Card integration
- [ ] Cash payment flow
- [ ] Kitchen dashboard UI
- [ ] Kitchen ticket printing

**Week 6: Kasir & Real-time**
- [ ] Kasir dashboard
- [ ] Cash payment confirmation
- [ ] Receipt printing
- [ ] WebSocket setup (Django Channels)
- [ ] Real-time order updates

**Week 7: Staff Management**
- [ ] Staff invitation system
- [ ] Role-based permissions
- [ ] Kasir features
- [ ] Kitchen features

**Week 8: Theme & Branding**
- [ ] Theme customization UI
- [ ] Logo & banner upload
- [ ] Color picker
- [ ] Theme preview
- [ ] Apply theme to customer site

---

### Phase 3: Advanced Features (Weeks 9-12)

**Week 9: Discount & Promotions**
- [ ] Discount CRUD
- [ ] Promo code system
- [ ] Time-based discounts
- [ ] Apply discounts to cart

**Week 10: Analytics**
- [ ] Dashboard metrics
- [ ] Sales report
- [ ] Product report
- [ ] Payment report
- [ ] Export to Excel/PDF

**Week 11: User Features**
- [ ] Customer registration
- [ ] OAuth integration (Google)
- [ ] Order history
- [ ] Loyalty points (basic)
- [ ] Favorites

**Week 12: Polish & Testing**
- [ ] Mobile responsive optimization
- [ ] Performance optimization
- [ ] Security audit
- [ ] Bug fixes
- [ ] User testing

---

### Phase 4: Launch Prep (Weeks 13-14)

**Week 13: Deployment**
- [ ] Production setup (Railway/Fly.io)
- [ ] Domain setup
- [ ] SSL certificates
- [ ] Database backups
- [ ] Monitoring (Sentry)

**Week 14: Soft Launch**
- [ ] Beta testing with 5 restaurants
- [ ] Collect feedback
- [ ] Fix critical bugs
- [ ] Documentation
- [ ] Marketing materials

---

### Post-Launch: Enhancements

**Future Features:**
- [ ] Multiple languages (EN, ID)
- [ ] Multi-location support (chains)
- [ ] Delivery integration (optional)
- [ ] Customer app (mobile native)
- [ ] Advanced loyalty programs
- [ ] Inventory management
- [ ] Supplier management
- [ ] Employee scheduling
- [ ] Advanced analytics (AI insights)
- [ ] WhatsApp integration for notifications
- [ ] Custom domain support (e.g., order.restorantku.com)

---

## Conclusion

This documentation provides a comprehensive blueprint for building the QR Restaurant Platform. The system is designed to be:

1. **Free & Accessible** - No barriers to entry for small restaurants
2. **Easy to Use** - Simple setup wizard, intuitive interfaces
3. **Scalable** - Multi-tenant architecture supporting thousands of restaurants
4. **Feature-Rich** - Everything needed for modern digital ordering
5. **Flexible** - Customizable branding, pricing, discounts
6. **Reliable** - Real-time updates, secure payments, proper error handling

Next steps:
1. Review and refine requirements with stakeholders
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular sprint reviews and iterations

Good luck with the build! 🚀
