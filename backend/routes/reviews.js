const express = require('express')
const Review = require('../models/Review')
const Order = require('../models/Order')
const { protect, authorize } = require('../middleware/auth')

const router = express.Router()

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get reviews by customer
router.get('/customer/:customerId', protect, async (req, res) => {
  try {
    // Check if user is requesting their own reviews or is admin
    if (req.user.id !== req.params.customerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these reviews'
      })
    }

    const reviews = await Review.find({ customer: req.params.customerId })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create review
router.post('/', protect, async (req, res) => {
  try {
    const { product, order, rating, title, comment, images } = req.body

    // Check if order exists and belongs to user
    const orderDoc = await Order.findById(order)
    if (!orderDoc || orderDoc.customer.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order'
      })
    }

    // Check if product is in the order
    const orderItem = orderDoc.items.find(item => item.product.toString() === product)
    if (!orderItem) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in order'
      })
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ product, customer: req.user.id })
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already exists for this product'
      })
    }

    const review = await Review.create({
      product,
      customer: req.user.id,
      vendor: orderDoc.vendor,
      order,
      rating,
      title,
      comment,
      images: images || []
    })

    res.status(201).json({
      success: true,
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update review
router.put('/:id', protect, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    // Check if user owns the review
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      })
    }

    // Can only update if not approved yet
    if (review.isApproved) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update approved review'
      })
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Delete review
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    // Check if user owns the review or is admin
    if (review.customer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      })
    }

    await review.remove()

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Mark review as helpful
router.put('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await review.markHelpful(req.user.id)

    res.status(200).json({
      success: true,
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Report review
router.put('/:id/report', protect, async (req, res) => {
  try {
    const { reason } = req.body
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      })
    }

    await review.report(req.user.id, reason)

    res.status(200).json({
      success: true,
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get pending reviews (Moderator/Admin)
router.get('/moderator/pending', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const reviews = await Review.getPending()

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get flagged reviews (Moderator/Admin)
router.get('/moderator/flagged', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const reviews = await Review.getFlagged()

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Approve review (Moderator/Admin)
router.put('/:id/approve', protect, authorize('moderator', 'admin'), async (req, res) => {
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
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Flag review (Moderator/Admin)
router.put('/:id/flag', protect, authorize('moderator', 'admin'), async (req, res) => {
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
      data: review
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
