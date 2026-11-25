const priceFormatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })

export function formatPrice(priceCents: number): string {
  return priceFormatter.format(priceCents / 100)
}
