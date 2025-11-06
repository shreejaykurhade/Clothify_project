import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [userId, setUserId] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    // Load cart and wishlist from localStorage
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    const savedUserId = localStorage.getItem('userId')

    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
    if (savedUserId) {
      setUserId(savedUserId)
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items))

    // Sync with backend if user is logged in
    if (userId) {
      syncCartWithBackend(items)
    }
  }, [items, userId])

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (product, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prevItems, { ...product, quantity }]
    })
  }

  const syncCartWithBackend = async (cartItems) => {
    if (!userId) return

    try {
      await axios.post(`${API_BASE_URL}/api/cart/${userId}`, {
        items: cartItems,
      })
    } catch (error) {
      console.error('Error syncing cart with backend:', error)
    }
  }

  const loadCartFromBackend = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`)
      const cartItems = response.data
      setItems(cartItems)
      localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error loading cart from backend:', error)
    }
  }

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = async () => {
    setItems([])
    if (userId) {
      try {
        await axios.delete(`${API_BASE_URL}/api/cart/${userId}`)
      } catch (error) {
        console.error('Error clearing cart on backend:', error)
      }
    }
  }

  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find((item) => item.id === product.id)) {
        return prevWishlist
      }
      return [...prevWishlist, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId))
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items,
    wishlist,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    getTotalPrice,
    getTotalItems,
    setUserId,
    loadCartFromBackend,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
