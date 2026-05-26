# TapMenu Code Cleanup Baseline

Last reviewed: 2026-05-25

## Goal

This document is the baseline for frontend code cleanup so files do not keep growing into single large page components. The objective is:

- separate UI from backend communication
- separate pure logic from stateful logic
- define shared data shapes in one place
- make future changes easier and safer

## Folder Rules

Use this structure consistently:

- `pages/`
  - page-level UI and local screen state
  - route wiring
  - modal open/close state
  - small event handlers that are only meaningful in that page

- `components/`
  - reusable visual pieces
  - extracted modals, cards, tables, filters, form sections

- `services/`
  - API calls
  - backend request/response orchestration
  - feature-level server communication

- `utils/`
  - pure helper functions
  - mappers
  - calculations
  - formatters
  - no React state, no side effects

- `helpers/`
  - feature-specific helper logic that is not generic enough for `utils`
  - use only when it improves clarity over `utils`

- `hooks/`
  - reusable stateful React logic
  - polling
  - session state
  - form state
  - feature workflows with `useState`, `useEffect`, `useRef`

- `types/`
  - shared data shape definitions
  - for this repo, use `.d.ts` files plus JSDoc imports from JS files

## Folder Creation Rule

Before splitting a page, create the folder first if it does not exist yet.

Examples:

- if a feature needs reusable React state/effect logic, create `src/hooks/`
- if a feature needs small feature-specific helpers, create `src/helpers/`
- if a feature needs external library setup or wrappers, create `src/lib/`
- if a feature needs API extraction, create or reuse `src/services/`
- if a feature needs shared data definitions, create or reuse `src/types/`

Do not create folders just for theory. Create them only when the page actually needs them.

## Naming Rule

After creating the folder, create the file using the same feature/page name whenever possible.

Recommended naming:

- page: `Category.jsx`
- service: `categories.js` or `category.js`
- util: `categories.js` or `category.js`
- helper: `categoryHelpers.js`
- hook: `useCategory.js`, `useCategoryForm.js`, `useCategoryPolling.js`
- type file: `categories.d.ts` or `category.d.ts`

Use one feature naming style consistently inside that feature.

Preferred convention for this repo:

- `services/` and `utils/`: plural when the page manages a resource collection
- `hooks/`: `use` + feature name
- `types/`: plural feature name + `.d.ts`

## Current Pattern

The cleanup pattern is now established in these features:

- category
  - `tapmenu/src/services/categories.js`
  - `tapmenu/src/utils/categories.js`
  - `tapmenu/src/types/categories.d.ts`

- vouchers
  - `tapmenu/src/services/vouchers.js`
  - `tapmenu/src/utils/vouchers.js`
  - `tapmenu/src/types/vouchers.d.ts`

- cashier
  - `tapmenu/src/services/cashier.js`
  - `tapmenu/src/utils/cashiers.js`
  - `tapmenu/src/types/cashiers.d.ts`
  - `tapmenu/src/hooks/useCashierSession.js`
  - `tapmenu/src/hooks/useCashierCart.js`

This is now the reference pattern for the next features.

## Coverage Goal

This cleanup baseline applies to all frontend pages under:

- `tapmenu/src/pages/`
- `tapmenu/src/pages/authentications/`
- `tapmenu/src/pages/customer/`
- `tapmenu/src/pages/dashboard/`

It is not limited to cashier. Cashier is only the first example that already started using the split pattern.

## Page Inventory

### General Pages

- `Home.jsx`
- `AboutMe.jsx`

### Authentication Pages

- `authentications/ForgotPassword.jsx`
- `authentications/customer/Login.jsx`
- `authentications/customer/Register.jsx`
- `authentications/dashboard/Login.jsx`
- `authentications/dashboard/Register.jsx`

### Customer Pages

- `customer/Menu.jsx`
- `customer/Order.jsx`
- `customer/Voucher.jsx`
- `customer/OrderHistory.jsx`
- `customer/Favorites.jsx`
- `customer/Profile.jsx`

### Dashboard Pages

- `dashboard/Cashier.jsx`
- `dashboard/Category.jsx`
- `dashboard/Employee.jsx`
- `dashboard/MenuAppearance.jsx`
- `dashboard/MenuManagement.jsx`
- `dashboard/Orders.jsx`
- `dashboard/Overview.jsx`
- `dashboard/ProfileSettings.jsx`
- `dashboard/Reports.jsx`
- `dashboard/Settings.jsx`
- `dashboard/StoreSettings.jsx`
- `dashboard/TableForm.jsx`
- `dashboard/Tables.jsx`
- `dashboard/VoucherManagement.jsx`

## What Should Move Out of a Page

Move logic out of a page when:

- it has no JSX
- it calls backend APIs
- it transforms backend payloads
- it calculates totals, filters, or derived values
- it can be reused by another page
- it makes the page hard to scan

Keep logic in the page when:

- it is tightly tied to visible UI behavior
- it only controls modal state, local toggles, or local interactions
- extracting it would make the code harder to follow

## Completed So Far

These baseline items are already done:

- `dashboard/Category.jsx`
  - extracted to:
    - `src/services/categories.js`
    - `src/utils/categories.js`
    - `src/types/categories.d.ts`

- `dashboard/VoucherManagement.jsx`
  - extracted to:
    - `src/services/vouchers.js`
    - `src/utils/vouchers.js`
    - `src/types/vouchers.d.ts`

- `dashboard/Cashier.jsx`
  - split further with:
    - `src/hooks/useCashierSession.js`
    - `src/hooks/useCashierCart.js`
  - existing cashier service/type/util pattern is in use

- `dashboard/Tables.jsx`
- `dashboard/TableForm.jsx`
  - extracted to:
    - `src/services/tables.js`
    - `src/utils/tables.js`
    - `src/types/tables.d.ts`

- `dashboard/Orders.jsx`
  - extracted to:
    - `src/services/orders.js`
    - `src/utils/orders.js`
    - `src/hooks/useOrdersPolling.js`
    - `src/types/orders.d.ts`

- `dashboard/Employee.jsx`
  - extracted to:
    - `src/services/employees.js`
    - `src/utils/employees.js`
    - `src/types/employees.d.ts`

- `dashboard/Overview.jsx`
  - extracted to:
    - `src/services/overview.js`
    - `src/utils/overview.js`
    - `src/types/overview.d.ts`

- `dashboard/Reports.jsx`
  - extracted to:
    - `src/services/reports.js`
    - `src/utils/reports.js`
    - `src/types/reports.d.ts`

- `dashboard/StoreSettings.jsx`
  - extracted to:
    - `src/services/storeSettings.js`
    - `src/utils/storeSettings.js`
    - `src/types/storeSettings.d.ts`

- `dashboard/MenuAppearance.jsx`
  - extracted to:
    - `src/services/menuAppearance.js`
    - `src/utils/menuAppearance.js`
    - `src/types/menuAppearance.d.ts`

- `dashboard/MenuManagement.jsx`
  - extracted to:
    - `src/services/menu.js`
    - `src/utils/menu.js`
    - `src/types/menu.d.ts`

- `dashboard/ProfileSettings.jsx`
  - extracted to:
    - `src/services/profile.js`
    - `src/utils/profile.js`
    - `src/types/profile.d.ts`

- `dashboard/Settings.jsx`
  - extracted to:
    - `src/services/settings.js`
    - `src/utils/settings.js`
    - `src/types/settings.d.ts`

- `customer/Menu.jsx`
  - extracted to:
    - `src/services/customerMenu.js`
    - `src/utils/customerMenu.js`
    - `src/types/customerMenu.d.ts`

- `customer/Order.jsx`
  - extracted to:
    - `src/services/customerOrders.js`
    - `src/utils/customerOrders.js`
    - `src/types/customerOrders.d.ts`

- `customer/OrderHistory.jsx`
  - extracted to:
    - `src/utils/customerOrderHistory.js`
    - reused:
      - `src/types/customerOrders.d.ts`

- `customer/Voucher.jsx`
  - extracted to:
    - `src/utils/customerVouchers.js`
    - `src/types/customerVouchers.d.ts`

- `customer/Favorites.jsx`
  - extracted to:
    - `src/utils/customerFavorites.js`
    - `src/types/customerFavorites.d.ts`

- `authentications/customer/Login.jsx`
  - extracted to:
    - `src/utils/auth.js`
    - `src/types/auth.d.ts`

## Recommended Refactor Order

### Phase 1: Dashboard CRUD Pages

These pages give the best return first because they mix UI, fetch logic, form logic, filtering, and CRUD operations.

- `dashboard/Tables.jsx`
- `dashboard/TableForm.jsx`
  - create:
    - `src/services/tables.js`
    - `src/utils/tables.js`
    - `src/types/tables.d.ts`

- `dashboard/Employee.jsx`
  - create:
    - `src/services/employees.js`
    - `src/utils/employees.js`
    - `src/types/employees.d.ts`

### Phase 2: Dashboard Operational Pages

- `dashboard/Orders.jsx`
  - create:
    - `src/services/orders.js`
    - `src/utils/orders.js`
    - `src/hooks/useOrdersPolling.js`
    - `src/types/orders.d.ts`

- `dashboard/Overview.jsx`
  - create:
    - `src/services/overview.js`
    - `src/utils/overview.js`
    - `src/types/overview.d.ts`
    - optional:
      - `components/dashboard/QuickActions.jsx`
      - `components/dashboard/OverviewStats.jsx`

- `dashboard/Reports.jsx`
  - create:
    - `src/services/reports.js`
    - `src/utils/reports.js`
    - `src/types/reports.d.ts`

### Phase 3: Dashboard Large Configuration Pages

- `dashboard/MenuManagement.jsx`
  - likely the biggest split
  - create:
    - `src/services/menu.js`
    - `src/utils/menu.js`
    - `src/types/menu.d.ts`
    - `src/components/menu/`
    - optional hooks for form and variant logic

- `dashboard/StoreSettings.jsx`
  - create:
    - `src/services/storeSettings.js`
    - `src/utils/storeSettings.js`
    - `src/types/storeSettings.d.ts`

- `dashboard/MenuAppearance.jsx`
  - create:
    - `src/services/menuAppearance.js`
    - `src/utils/menuAppearance.js`
    - `src/types/menuAppearance.d.ts`

- `dashboard/ProfileSettings.jsx`
  - create:
    - `src/services/profile.js`
    - `src/utils/profile.js`
    - `src/types/profile.d.ts`

- `dashboard/Settings.jsx`
  - only split deeply if this page becomes a real persisted feature

### Phase 4: Customer Pages

- `customer/Menu.jsx`
  - create:
    - `src/services/customerMenu.js`
    - `src/utils/customerMenu.js`
    - `src/types/customerMenu.d.ts`

- `customer/Order.jsx`
  - create:
    - `src/services/customerOrders.js`
    - `src/utils/customerOrders.js`
    - `src/types/customerOrders.d.ts`

- `customer/Voucher.jsx`
- `customer/OrderHistory.jsx`
- `customer/Favorites.jsx`
- `customer/Profile.jsx`
  - split only after the backend/product direction is finalized

### Phase 5: Authentication Pages

- `authentications/ForgotPassword.jsx`
- `authentications/customer/Login.jsx`
- `authentications/customer/Register.jsx`
- `authentications/dashboard/Login.jsx`
- `authentications/dashboard/Register.jsx`
  - extract shared auth form helpers only where duplication is real
  - likely targets:
    - `src/services/auth.js` reuse
    - `src/utils/auth.js`
    - `src/types/auth.d.ts`
    - `src/components/auth/`

### Phase 6: General Marketing Pages

- `Home.jsx`
- `AboutMe.jsx`
  - lowest priority
  - only split if they become much larger or gain dynamic behavior

## Standard Feature Layout

Use this as the default shape for medium-to-large features:

```text
src/
  pages/dashboard/Feature.jsx
  components/feature/FeatureModal.jsx
  components/feature/FeatureTable.jsx
  services/feature.js
  utils/feature.js
  hooks/useFeatureFlow.js
  types/feature.d.ts
```

If the repo does not have one of those folders yet, create it first before adding the file.

## Full Cleanup Target

When this cleanup baseline is fully applied, every non-trivial page should move toward this rule:

- page file = UI assembly
- service file = backend communication
- util/helper file = pure logic
- type file = data shape definition
- hook file = reusable state/effect workflow
- extracted component files = reusable or large visual sections

## Refactor Checklist

For each page refactor:

1. identify pure functions and move them to `utils`
2. identify API calls and move them to `services`
3. define shared data shapes in `types`
4. extract repeated UI blocks into `components`
5. extract reusable state/effect logic into `hooks`
6. keep the page as the assembly layer only

## Success Criteria

A page cleanup is considered complete when:

- the page mainly reads like UI
- backend calls are not embedded directly in the JSX file unless trivial
- reusable transforms are not duplicated
- major data shapes are documented in `types`
- the file is significantly easier to scan and modify

## Immediate Next Step

Start with `authentications/customer/Register.jsx`.

Reason:

- the dashboard cleanup pass is covered for the current baseline
- `customer/profile` is intentionally skipped for now because it does not have meaningful logic to extract yet
- `authentications/customer/Login.jsx` now reuses shared auth helpers
- `authentications/customer/Register.jsx` is the next auth page because it still mixes:
  - static onboarding/security content
  - form defaults and submit mapping
  - page-level presentation
  - page-level presentation

Expected next files:

- reuse `src/utils/auth.js`
- reuse `src/types/auth.d.ts`
