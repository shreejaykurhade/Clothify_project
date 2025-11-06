import api from './api'

export const inventoryService = {
  // Get inventory dashboard stats
  getDashboardStats: async () => {
    // This would be a custom endpoint for inventory management
    // For now, we'll use existing product endpoints
    const response = await api.get('/api/products')
    return response.data
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 5) => {
    const response = await api.get(`/api/products?stock_lte=${threshold}`)
    return response.data
  },

  // Update product stock
  updateProductStock: async (productId, stockData) => {
    const response = await api.put(`/api/products/${productId}`, stockData)
    return response.data
  },

  // Get products by category for inventory
  getProductsByCategory: async (category) => {
    const response = await api.get(`/api/products/category/${category}`)
    return response.data
  },

  // Mark product as featured
  markAsFeatured: async (productId, featured = true) => {
    const response = await api.put(`/api/products/${productId}`, { featured })
    return response.data
  },

  // Mark product as trending
  markAsTrending: async (productId, trending = true) => {
    const response = await api.put(`/api/products/${productId}`, { trending })
    return response.data
  },

  // Mark product as discounted
  markAsDiscounted: async (productId, discountData) => {
    const response = await api.put(`/api/products/${productId}`, discountData)
    return response.data
  },

  // Get inventory reports
  getInventoryReport: async () => {
    const response = await api.get('/api/products')
    const products = response.data.data || response.data

    // Calculate inventory metrics
    const totalProducts = products.length
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0)
    const lowStockProducts = products.filter(product => product.stock <= 5)
    const outOfStockProducts = products.filter(product => product.stock === 0)
    const featuredProducts = products.filter(product => product.featured)

    return {
      success: true,
      data: {
        totalProducts,
        totalStock,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
        featuredCount: featuredProducts.length,
        lowStockProducts,
        outOfStockProducts,
        featuredProducts
      }
    }
  },

  // Bulk update stock
  bulkUpdateStock: async (updates) => {
    const promises = updates.map(update =>
      api.put(`/api/products/${update.productId}`, { stock: update.stock })
    )
    const results = await Promise.all(promises)
    return results
  }
}

export default inventoryService
