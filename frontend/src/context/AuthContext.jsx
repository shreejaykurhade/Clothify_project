import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('user')
    const savedRole = localStorage.getItem('role')
    const savedToken = localStorage.getItem('token')
    const savedUserId = localStorage.getItem('userId')

    if (savedUser && savedRole && savedToken) {
      setUser(JSON.parse(savedUser))
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password })
      console.log('API URL:', `${API_BASE_URL}/api/auth/login`)

      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      })

      console.log('Login response:', response)
      const data = response.data
      setUser(data.user)
      setRole(data.user.role)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
    } catch (error) {
      console.error('Login error details:', error)
      console.error('Error response:', error.response)
      console.error('Error message:', error.message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData)

      const data = response.data
      setUser(data.user)
      setRole(data.user.role)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.user.id)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  const value = {
    user,
    role,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
