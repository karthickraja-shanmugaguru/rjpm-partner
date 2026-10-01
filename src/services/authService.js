import api from './api'

export const authService = {
  login: (data) => api.post('/auth/provider/login', data),
  signup: (data) => api.post('/auth/provider/signup', data),
  resetPassword: (data) => api.post('/auth/provider/reset-password', data),
  sendOtp: (data) => api.post('/auth/send-otp', { ...data, role: 'PROVIDER' }),
  verifyOtp: (data) => api.post('/auth/verify-otp', { ...data, role: 'PROVIDER' }),
  getMe: () => api.get('/auth/me'),
}

export default authService
