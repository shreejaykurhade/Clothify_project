const Cart = require('../models/Cart')
const Product = require('../models/Product')

// @desc    Get user cart
// @route   GET /api/cart/:userId
// @access  Private
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product', 'name price images stock')

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          user: req.params.userId,
          items: [],
          totalItems: 0,
          totalPrice: 0
        }
      })
    }

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Add item to cart
// @route   POST /api/cart/:userId
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariants = {} } = req.body

    // Check if product exists and is in stock
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    if (!product.isActive || !product.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      })
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      })
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.params.userId })
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] })
    }

    // Add item to cart
    cart.addItem(productId, quantity, product.price, selectedVariants)
    await cart.save()

    // Populate product details
    await cart.populate('items.product', 'name price images stock')

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Update cart item
// @route   PUT /api/cart/:userId/item
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity, selectedVariants = {} } = req.body

    const cart = await Cart.findOne({ user: req.params.userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    // Check stock if increasing quantity
    if (quantity > 0) {
      const product = await Product.findById(productId)
      if (!product || product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock'
        })
      }
    }

    cart.updateQuantity(productId, quantity, selectedVariants)
    await cart.save()

    // Populate product details
    await cart.populate('items.product', 'name price images stock')

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Remove item from cart
// @route   DELETE /api/cart/:userId/item/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params
    const { selectedVariants = {} } = req.body

    const cart = await Cart.findOne({ user: req.params.userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    cart.removeItem(productId, selectedVariants)
    await cart.save()

    // Populate product details
    await cart.populate('items.product', 'name price images stock')

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Clear cart
// @route   DELETE /api/cart/:userId
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      })
    }

    cart.clear()
    await cart.save()

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Sync cart (for localStorage sync)
// @route   POST /api/cart/:userId/sync
// @access  Private
const syncCart = async (req, res) => {
  try {
    const { items } = req.body

    let cart = await Cart.findOne({ user: req.params.userId })
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] })
    }

    // Validate all items
    for (const item of items) {
      const product = await Product.findById(item.product || item.id)
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product || item.id} not found`
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        })
      }
    }

    cart.items = items.map(item => ({
      product: item.product || item.id,
      quantity: item.quantity,
      price: item.price,
      selectedVariants: item.selectedVariants || {}
    }))

    await cart.save()

    // Populate product details
    await cart.populate('items.product', 'name price images stock')

    res.status(200).json({
      success: true,
      data: cart
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart
}
