import api from './api'

export const deliveryService = {
  // Get delivery dashboard stats
  getDashboardStats: async () => {
    // This would be a custom endpoint for delivery management
    // For now, we'll use existing order endpoints
    const response = await api.get('/api/orders')
    return response.data
  },

  // Get assigned orders
  getAssignedOrders: async (deliveryAgentId) => {
    // Filter orders by delivery agent
    const response = await api.get('/api/orders')
    const orders = response.data.data || response.data
    const assignedOrders = orders.filter(order =>
      order.deliveryAgent && order.deliveryAgent.toString() === deliveryAgentId
    )
    return {
      success: true,
      data: assignedOrders
    }
  },

  // Get pending deliveries
  getPendingDeliveries: async () => {
    const response = await api.get('/api/orders?status=shipped')
    return response.data
  },

  // Update delivery status
  updateDeliveryStatus: async (orderId, status, notes = '') => {
    const response = await api.put(`/api/orders/${orderId}/status`, {
      status,
      notes
    })
    return response.data
  },

  // Get order details for delivery
  getOrderForDelivery: async (orderId) => {
    const response = await api.get(`/api/orders/${orderId}`)
    return response.data
  },

  // Get delivery route (mock implementation)
  getDeliveryRoute: async (orderId) => {
    // This would integrate with a mapping service
    // For now, return mock route data
    const order = await api.get(`/api/orders/${orderId}`)
    const orderData = order.data.data || order.data

    return {
      success: true,
      data: {
        orderId,
        customerAddress: orderData.shippingAddress,
        route: [
          { lat: 40.7128, lng: -74.0060, label: 'Warehouse' },
          { lat: 40.7589, lng: -73.9851, label: 'Customer Location' }
        ],
        estimatedTime: '45 minutes',
        distance: '8.5 km'
      }
    }
  },

  // Mark order as delivered
  markAsDelivered: async (orderId, deliveryNotes = '') => {
    const response = await api.put(`/api/orders/${orderId}/status`, {
      status: 'delivered',
      notes: deliveryNotes
    })
    return response.data
  },

  // Report delivery issue
  reportDeliveryIssue: async (orderId, issueType, description) => {
    const response = await api.put(`/api/orders/${orderId}/status`, {
      status: 'delivery_issue',
      notes: `Issue: ${issueType} - ${description}`
    })
    return response.data
  },

  // Get delivery history
  getDeliveryHistory: async (deliveryAgentId) => {
    const response = await api.get('/api/orders?status=delivered')
    const orders = response.data.data || response.data
    const deliveredOrders = orders.filter(order =>
      order.deliveryAgent && order.deliveryAgent.toString() === deliveryAgentId
    )
    return {
      success: true,
      data: deliveredOrders
    }
  },

  // Update delivery location (for tracking)
  updateDeliveryLocation: async (orderId, location) => {
    // This would update real-time location
    // For now, just log the update
    console.log(`Updating location for order ${orderId}:`, location)
    return {
      success: true,
      message: 'Location updated successfully'
    }
  }
}

export default deliveryService
