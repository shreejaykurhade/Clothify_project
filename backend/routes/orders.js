const express = require('express')
const Order = require('../models/Order')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Get all orders (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name email')
      .populate('vendor', 'name')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get orders by customer
router.get('/customer/:customerId', protect, async (req, res) => {
  try {
    // Check if user is requesting their own orders or is admin
    if (req.user.id !== req.params.customerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders'
      })
    }

    const orders = await Order.find({ customer: req.params.customerId })
      .populate('vendor', 'name storeName')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get orders by vendor
router.get('/vendor/:vendorId', protect, authorize('vendor', 'admin'), async (req, res) => {
  try {
    // Check if vendor is requesting their own orders or is admin
    if (req.user.id !== req.params.vendorId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders'
      })
    }

    const orders = await Order.find({ vendor: req.params.vendorId })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('vendor', 'name storeName')
      .populate('items.product', 'name images')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check if user is authorized to view this order
    if (order.customer._id.toString() !== req.user.id &&
        order.vendor._id.toString() !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      })
    }

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    // Validate items and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const Product = require('../models/Product')
      const product = await Product.findById(item.product)

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        })
      }

      const itemSubtotal = product.price * item.quantity
      subtotal += itemSubtotal

      orderItems.push({
        product: item.product,
        name: product.name,
        image: product.primaryImage,
        price: product.price,
        quantity: item.quantity,
        selectedVariants: item.selectedVariants || {},
        subtotal: itemSubtotal
      })
    }

    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99 // Free shipping over $50
    const total = subtotal + tax + shipping

    const order = await Order.create({
      customer: req.user.id,
      vendor: orderItems[0].product.vendor, // Assuming all items from same vendor for simplicity
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total
    })

    res.status(201).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update order status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, notes } = req.body

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update order status'
      })
    }

    if (req.user.role === 'vendor' && order.vendor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      })
    }

    await order.updateStatus(status, notes)

    res.status(200).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
