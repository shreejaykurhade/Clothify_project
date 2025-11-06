import api from './api'

export const moderatorService = {
  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/moderator/dashboard/stats')
    return response.data
  },

  // Get pending reviews
  getPendingReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/moderator/reviews/pending?${queryString}`)
    return response.data
  },

  // Get flagged reviews
  getFlaggedReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/moderator/reviews/flagged?${queryString}`)
    return response.data
  },

  // Approve review
  approveReview: async (reviewId) => {
    const response = await api.put(`/api/moderator/reviews/${reviewId}/approve`)
    return response.data
  },

  // Reject review
  rejectReview: async (reviewId) => {
    const response = await api.delete(`/api/moderator/reviews/${reviewId}/reject`)
    return response.data
  },

  // Flag review
  flagReview: async (reviewId, reason) => {
    const response = await api.put(`/api/moderator/reviews/${reviewId}/flag`, { reason })
    return response.data
  },

  // Unflag review
  unflagReview: async (reviewId) => {
    const response = await api.put(`/api/moderator/reviews/${reviewId}/unflag`)
    return response.data
  },

  // Get reported content
  getReportedContent: async () => {
    const response = await api.get('/api/moderator/content/reported')
    return response.data
  },

  // Suspend user
  suspendUser: async (userId, reason) => {
    const response = await api.put(`/api/moderator/users/${userId}/suspend`, { reason })
    return response.data
  },

  // Reactivate user
  reactivateUser: async (userId) => {
    const response = await api.put(`/api/moderator/users/${userId}/reactivate`)
    return response.data
  },

  // Get all reviews (for moderation)
  getAllReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/api/reviews?${queryString}`)
    return response.data
  },

  // Get review details
  getReview: async (reviewId) => {
    const response = await api.get(`/api/reviews/${reviewId}`)
    return response.data
  }
}

export default moderatorService
