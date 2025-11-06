import api from './api'

export const customerService = {
  // Get products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/products?${queryString}`)
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/api/products/${id}`)
    return response.data
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get(`/api/products/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async () => {
    const response = await api.get('/api/products/featured/all')
    return response.data
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await api.get(`/api/products/category/${category}`)
    return response.data
  },

  // Get cart
  getCart: async (userId) => {
    const response = await api.get(`/api/cart/${userId}`)
    return response.data
  },

  // Add to cart
  addToCart: async (userId, cartData) => {
    const response = await api.post(`/api/cart/${userId}`, cartData)
    return response.data
  },

  // Update cart item
  updateCartItem: async (userId, updateData) => {
    const response = await api.put(`/api/cart/${userId}/item`, updateData)
    return response.data
  },

  // Remove from cart
  removeFromCart: async (userId, productId) => {
    const response = await api.delete(`/api/cart/${userId}/item/${productId}`)
    return response.data
  },

  // Clear cart
  clearCart: async (userId) => {
    const response = await api.delete(`/api/cart/${userId}`)
    return response.data
  },

  // Sync cart
  syncCart: async (userId, cartItems) => {
    const response = await api.post(`/api/cart/${userId}/sync`, { items: cartItems })
    return response.data
  },

  // Get orders
  getOrders: async (customerId) => {
    const response = await api.get(`/api/orders/customer/${customerId}`)
    return response.data
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data
  },

  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/api/orders', orderData)
    return response.data
  },

  // Get reviews for product
  getProductReviews: async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`)
    return response.data
  },

  // Create review
  createReview: async (reviewData) => {
    const response = await api.post('/api/reviews', reviewData)
    return response.data
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData)
    return response.data
  },

  // Delete review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/api/reviews/${reviewId}`)
    return response.data
  },

  // Mark review helpful
  markReviewHelpful: async (reviewId) => {
    const response = await api.put(`/api/reviews/${reviewId}/helpful`)
    return response.data
  },

  // Report review
  reportReview: async (reviewId, reason) => {
    const response = await api.put(`/api/reviews/${reviewId}/report`, { reason })
    return response.data
  }
}

export default customerService
