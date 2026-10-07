export const getCustomerBaseUrl = () => {
  if (import.meta.env.VITE_CUSTOMER_URL) {
    return import.meta.env.VITE_CUSTOMER_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const isLocal = host === 'localhost' || host === '127.0.0.1'
    return isLocal ? 'http://localhost:3000' : 'https://rjpm-customer.netlify.app'
  }
  return 'https://rjpm-customer.netlify.app'
}
