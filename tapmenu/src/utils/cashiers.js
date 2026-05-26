/** @typedef {import('../types/cashiers').CashierMenuItemRaw} CashierMenuItemRaw */
/** @typedef {import('../types/cashiers').CashierMenuItem} CashierMenuItem */
/** @typedef {import('../types/cashiers').CashierCartItem} CashierCartItem */
/** @typedef {import('../types/cashiers').CashierSelectedAddOn} CashierSelectedAddOn */

/**
 * Normalize cashier menu payload from the backend into a UI-safe shape.
 * @param {CashierMenuItemRaw} item
 * @returns {CashierMenuItem}
 */
export function mapCashierMenuItem(item) {
  return {
    ...item,
    price: Number(item.price || 0),
    effective_price: Number(item.effective_price ?? item.price ?? 0),
    image_url: item.image_url || '',
    category_name: item.category_name || '',
    in_stock: Boolean(item.in_stock),
    variants: Array.isArray(item.variants) ? item.variants : [],
  }
}

/**
 * Convert cashier cart items into backend order item payload.
 * @param {CashierCartItem[]} cart
 */
export function buildCashierOrderItems(cart) {
  return cart.map((item) => {
    let assembledVariants = ''
    if (item.selectedAddOns && item.selectedAddOns.length > 0) {
      assembledVariants = item.selectedAddOns.map((option) => `${option.groupName}: ${option.optionName}`).join(', ')
    }

    return {
      menu_item_id: item.id,
      quantity: item.quantity,
      notes: item.note ? `${item.note}${assembledVariants ? ` | ${assembledVariants}` : ''}` : assembledVariants,
    }
  })
}

/**
 * @param {CashierSelectedAddOn[] | undefined | null} selectedOptionsArr
 * @returns {CashierSelectedAddOn[]}
 */
export function getCashierAddOnDetails(selectedOptionsArr) {
  return selectedOptionsArr || []
}

/**
 * @param {CashierSelectedAddOn[] | undefined | null} selectedOptionsArr
 * @returns {number}
 */
export function calculateCashierAddOnsPrice(selectedOptionsArr) {
  return (selectedOptionsArr || []).reduce((sum, option) => sum + (Number(option.price) || 0), 0)
}

/**
 * @param {string | undefined | null} payload
 * @returns {string}
 */
export function buildCashierQrUrl(payload) {
  if (!payload) return ''
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(payload)}`
}
