import api from './api'

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    return response.data
  },

  // Register user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData)
    return response.data
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/api/auth/me')
    return response.data
  },

  // Update user details
  updateDetails: async (userData) => {
    const response = await api.put('/api/auth/updatedetails', userData)
    return response.data
  },

  // Update password
  updatePassword: async (passwordData) => {
    const response = await api.put('/api/auth/updatepassword', passwordData)
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.get('/api/auth/logout')
    return response.data
  }
}

export default authService
