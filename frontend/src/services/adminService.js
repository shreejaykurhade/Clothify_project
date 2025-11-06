import api from './api'

export const adminService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats')
    return response.data
  },

  // Get all users
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/users?${queryString}`)
    return response.data
  },

  // Get single user
  getUser: async (userId) => {
    const response = await api.get(`/api/users/${userId}`)
    return response.data
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/users/${userId}`, userData)
    return response.data
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`)
    return response.data
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    const response = await api.put(`/api/admin/users/${userId}/role`, { role })
    return response.data
  },

  // Get pending vendors
  getPendingVendors: async () => {
    const response = await api.get('/api/admin/vendors')
    return response.data
  },

  // Approve vendor
  approveVendor: async (vendorId) => {
    const response = await api.put(`/api/admin/vendors/${vendorId}/approve`)
    return response.data
  },

  // Reject vendor
  rejectVendor: async (vendorId, reason) => {
    const response = await api.put(`/api/admin/vendors/${vendorId}/reject`, { reason })
    return response.data
  },

  // Get all products
  getAllProducts: async () => {
    const response = await api.get('/api/admin/products')
    return response.data
  },

  // Get pending products
  getPendingProducts: async () => {
    const response = await api.get('/api/admin/products/pending')
    return response.data
  },

  // Approve product
  approveProduct: async (productId) => {
    const response = await api.put(`/api/admin/products/${productId}/approve`)
    return response.data
  },

  // Reject product
  rejectProduct: async (productId, reason) => {
    const response = await api.put(`/api/admin/products/${productId}/reject`, { reason })
    return response.data
  },

  // Get all orders
  getOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/orders?${queryString}`)
    return response.data
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/api/orders/${orderId}/status`, statusData)
    return response.data
  }
}

export default adminService
