const express = require('express')
const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Get vendor profile
router.get('/profile/:vendorId', async (req, res) => {
  try {
    const vendor = await User.findById(req.params.vendorId)
      .select('name email avatar phone vendorInfo storeName storeDescription')

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      })
    }

    res.status(200).json({
      success: true,
      data: vendor
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get vendor products
router.get('/:vendorId/products', async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.params.vendorId,
      isActive: true,
      isApproved: true
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get vendor orders (Vendor only)
router.get('/:vendorId/orders', protect, authorize('vendor', 'admin'), async (req, res) => {
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

// Update vendor profile (Vendor only)
router.put('/profile', protect, authorize('vendor'), async (req, res) => {
  try {
    const allowedFields = {
      'vendorInfo.storeName': req.body.storeName,
      'vendorInfo.storeDescription': req.body.storeDescription,
      phone: req.body.phone,
      address: req.body.address
    }

    const vendor = await User.findByIdAndUpdate(req.user.id, allowedFields, {
      new: true,
      runValidators: true
    }).select('-password')

    res.status(200).json({
      success: true,
      data: vendor
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get vendor dashboard stats (Vendor only)
router.get('/dashboard/stats', protect, authorize('vendor'), async (req, res) => {
  try {
    const vendorId = req.user.id

    // Get product stats
    const totalProducts = await Product.countDocuments({ vendor: vendorId })
    const activeProducts = await Product.countDocuments({
      vendor: vendorId,
      isActive: true,
      isApproved: true
    })
    const pendingProducts = await Product.countDocuments({
      vendor: vendorId,
      approvalStatus: 'pending'
    })

    // Get order stats
    const totalOrders = await Order.countDocuments({ vendor: vendorId })
    const recentOrders = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name')

    // Calculate revenue
    const orders = await Order.find({
      vendor: vendorId,
      orderStatus: 'delivered'
    })

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get low stock products
    const lowStockProducts = await Product.find({
      vendor: vendorId,
      stock: { $lte: 5, $gt: 0 },
      isActive: true
    }).limit(5)

    res.status(200).json({
      success: true,
      data: {
        products: {
          total: totalProducts,
          active: activeProducts,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          recent: recentOrders
        },
        revenue: totalRevenue,
        lowStockProducts
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Apply to become vendor
router.post('/apply', protect, async (req, res) => {
  try {
    const { storeName, storeDescription, businessLicense } = req.body

    const user = await User.findById(req.user.id)

    if (user.role === 'vendor') {
      return res.status(400).json({
        success: false,
        message: 'User is already a vendor'
      })
    }

    user.role = 'vendor'
    user.vendorInfo = {
      storeName,
      storeDescription,
      businessLicense,
      isApproved: false
    }

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Vendor application submitted successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
