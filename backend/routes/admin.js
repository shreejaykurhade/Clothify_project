const express = require('express')
const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Get admin dashboard stats
router.get('/dashboard/stats', protect, authorize('admin'), async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments()
    const totalCustomers = await User.countDocuments({ role: 'customer' })
    const totalVendors = await User.countDocuments({ role: 'vendor' })
    const pendingVendors = await User.countDocuments({
      role: 'vendor',
      'vendorInfo.isApproved': false
    })

    // Product stats
    const totalProducts = await Product.countDocuments()
    const approvedProducts = await Product.countDocuments({ isApproved: true })
    const pendingProducts = await Product.countDocuments({ approvalStatus: 'pending' })

    // Order stats
    const totalOrders = await Order.countDocuments()
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' })
    const completedOrders = await Order.countDocuments({ orderStatus: 'delivered' })

    // Revenue stats
    const orders = await Order.find({ orderStatus: 'delivered' })
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Recent activity
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'name')
      .populate('vendor', 'name')

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt')

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          customers: totalCustomers,
          vendors: totalVendors,
          pendingVendors
        },
        products: {
          total: totalProducts,
          approved: approvedProducts,
          pending: pendingProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        revenue: totalRevenue,
        recentActivity: {
          orders: recentOrders,
          users: recentUsers
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get all vendors (for approval)
router.get('/vendors', protect, authorize('admin'), async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' })
      .select('name email phone vendorInfo createdAt')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Approve vendor
router.put('/vendors/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id)

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      })
    }

    vendor.vendorInfo.isApproved = true
    vendor.vendorInfo.approvalDate = new Date()
    await vendor.save()

    res.status(200).json({
      success: true,
      message: 'Vendor approved successfully',
      data: vendor
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Reject vendor
router.put('/vendors/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const { reason } = req.body
    const vendor = await User.findById(req.params.id)

    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      })
    }

    vendor.vendorInfo.isApproved = false
    vendor.vendorInfo.rejectionReason = reason
    await vendor.save()

    res.status(200).json({
      success: true,
      message: 'Vendor rejected',
      data: vendor
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get all products
router.get('/products', protect, authorize('admin'), async (req, res) => {
  try {
    const products = await Product.find()
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 })

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

// Get pending products
router.get('/products/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const products = await Product.find({ approvalStatus: 'pending' })
      .populate('vendor', 'name email')
      .sort({ createdAt: -1 })

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

// Approve product
router.put('/products/:id/approve', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    product.isApproved = true
    product.approvalStatus = 'approved'
    product.approvedBy = req.user.id
    product.approvedAt = new Date()
    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product approved successfully',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Reject product
router.put('/products/:id/reject', protect, authorize('admin'), async (req, res) => {
  try {
    const { reason } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    product.isApproved = false
    product.approvalStatus = 'rejected'
    product.rejectionReason = reason
    await product.save()

    res.status(200).json({
      success: true,
      message: 'Product rejected',
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update user role
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body
    const allowedRoles = ['customer', 'vendor', 'admin', 'moderator', 'inventory', 'delivery']

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
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
