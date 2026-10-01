import api from './api'

export const providerService = {
  // Dashboard
  getDashboard: () => api.get('/provider/dashboard'),

  // Profile
  getProfile: () => api.get('/provider/profile'),
  updateProfile: (data) => api.put('/provider/profile', data),

  // Services
  getServices: (params) => api.get('/provider/services', { params }),
  createService: (data) => api.post('/provider/services', data),
  updateService: (id, data) => api.put(`/provider/services/${id}`, data),
  deleteService: (id) => api.delete(`/provider/services/${id}`),

  // Packages
  getPackages: (params) => api.get('/provider/packages', { params }),
  createPackage: (data) => api.post('/provider/packages', data),
  updatePackage: (id, data) => api.put(`/provider/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/provider/packages/${id}`),

  // Labour / Event Staff
  getLabourListings: (params) => api.get('/provider/labour', { params }),
  createLabourListing: (data) => api.post('/provider/labour', data),
  updateLabourListing: (id, data) => api.put(`/provider/labour/${id}`, data),
  toggleLabourListingStatus: (id) => api.patch(`/provider/labour/${id}/status`),
  deleteLabourListing: (id) => api.delete(`/provider/labour/${id}`),

  // Enquiries
  getEnquiries: (status) => api.get('/provider/enquiries', { params: status ? { status } : {} }),
  acceptEnquiry: (id) => api.patch(`/provider/enquiries/${id}/accept`),
  declineEnquiry: (id) => api.patch(`/provider/enquiries/${id}/decline`),

  // Availability / Calendar
  getAvailability: (month, year) => api.get('/provider/availability', { params: { month, year } }),
  setAvailability: (data) => api.post('/provider/availability', data),

  // Reviews
  getReviews: () => api.get('/provider/reviews'),
  replyReview: (id, reply) => api.post(`/provider/reviews/${id}/reply`, { reply }),

  // Performance
  getPerformance: () => api.get('/provider/performance'),
}

export default providerService
