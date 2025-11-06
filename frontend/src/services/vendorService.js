import api from './api'

export const vendorService = {
  // Get vendor profile
  getVendorProfile: async (vendorId) => {
    const response = await api.get(`/api/vendors/profile/${vendorId}`)
    return response.data
  },

  // Update vendor profile
  updateVendorProfile: async (profileData) => {
    const response = await api.put('/api/vendors/profile', profileData)
    return response.data
  },

  // Apply to become vendor
  applyForVendor: async (applicationData) => {
    const response = await api.post('/api/vendors/apply', applicationData)
    return response.data
  },

  // Get vendor products
  getVendorProducts: async (vendorId) => {
    const response = await api.get(`/api/vendors/${vendorId}/products`)
    return response.data
  },

  // Get vendor orders
  getVendorOrders: async (vendorId) => {
    const response = await api.get(`/api/vendors/${vendorId}/orders`)
    return response.data
  },

  // Get vendor dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/vendors/dashboard/stats')
    return response.data
  },

  // Create product
  createProduct: async (productData) => {
    const response = await api.post('/api/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/api/products/${productId}`, productData)
    return response.data
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`)
    return response.data
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`)
    return response.data
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/api/orders/${orderId}/status`, statusData)
    return response.data
  }
}

export default vendorService
