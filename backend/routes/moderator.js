const express = require('express')
const Review = require('../models/Review')
const User = require('../models/User')
const Product = require('../models/Product')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Get moderator dashboard stats
router.get('/dashboard/stats', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    // Review stats
    const totalReviews = await Review.countDocuments()
    const approvedReviews = await Review.countDocuments({ isApproved: true })
    const pendingReviews = await Review.countDocuments({ isApproved: false, isFlagged: false })
    const flaggedReviews = await Review.countDocuments({ isFlagged: true })

    // Get recent pending reviews
    const recentPendingReviews = await Review.find({ isApproved: false, isFlagged: false })
      .populate('product', 'name')
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get recent flagged reviews
    const recentFlaggedReviews = await Review.find({ isFlagged: true })
      .populate('product', 'name')
      .populate('customer', 'name')
      .sort({ flaggedAt: -1 })
      .limit(5)

    // Content moderation stats
    const reportedUsers = await User.countDocuments({ isActive: false }) // Assuming inactive users are reported
    const reportedProducts = await Product.countDocuments({ isActive: false })

    res.status(200).json({
      success: true,
      data: {
        reviews: {
          total: totalReviews,
          approved: approvedReviews,
          pending: pendingReviews,
          flagged: flaggedReviews
        },
        content: {
          reportedUsers,
          reportedProducts
        },
        recentActivity: {
          pendingReviews: recentPendingReviews,
          flaggedReviews: recentFlaggedReviews
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

// Get pending reviews
router.get('/reviews/pending', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ isApproved: false, isFlagged: false })
      .populate('product', 'name images')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments({ isApproved: false, isFlagged: false })

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get flagged reviews
router.get('/reviews/flagged', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const reviews = await Review.find({ isFlagged: true })
      .populate('product', 'name images')
      .populate('customer', 'name email')
      .sort({ flaggedAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Review.countDocuments({ isFlagged: true })

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Approve review
router.put('/reviews/:id/approve', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await review.approve(req.user.id)

    res.status(200).json({
      success: true,
      message: 'Review approved successfully',
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Reject review
router.put('/reviews/:id/reject', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await review.remove()

    res.status(200).json({
      success: true,
      message: 'Review rejected and removed'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Flag review
router.put('/reviews/:id/flag', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const { reason } = req.body
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await review.flag(req.user.id, reason)

    res.status(200).json({
      success: true,
      message: 'Review flagged successfully',
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Unflag review
router.put('/reviews/:id/unflag', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    review.isFlagged = false
    review.flagReason = null
    review.flaggedBy = null
    review.flaggedAt = null
    await review.save()

    res.status(200).json({
      success: true,
      message: 'Review unflagged successfully',
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get reported content
router.get('/content/reported', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    // Get reported products (inactive products could be reported)
    const reportedProducts = await Product.find({ isActive: false })
      .populate('vendor', 'name email')
      .sort({ updatedAt: -1 })

    // Get reported users (inactive users could be reported)
    const reportedUsers = await User.find({ isActive: false })
      .select('name email role createdAt')
      .sort({ updatedAt: -1 })

    res.status(200).json({
      success: true,
      data: {
        products: reportedProducts,
        users: reportedUsers
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Suspend user
router.put('/users/:id/suspend', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const { reason } = req.body
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.isActive = false
    // You could add suspension reason and date fields to User model
    await user.save()

    res.status(200).json({
      success: true,
      message: 'User suspended successfully',
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Reactivate user
router.put('/users/:id/reactivate', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    user.isActive = true
    await user.save()

    res.status(200).json({
      success: true,
      message: 'User reactivated successfully',
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
