const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment'],
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  images: [{
    url: String,
    alt: String
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    enum: ['spam', 'inappropriate', 'fake', 'offensive', 'irrelevant'],
    default: null
  },
  flaggedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Moderator'
  },
  flaggedAt: {
    type: Date,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Moderator'
  },
  approvedAt: {
    type: Date,
    default: null
  },
  helpful: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Customer'
  }],
  reported: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Customer'
  }],
  response: {
    comment: String,
    respondedBy: { type: mongoose.Schema.ObjectId, ref: 'Vendor' },
    respondedAt: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
})

// Create indexes
reviewSchema.index({ product: 1, isApproved: 1 })
reviewSchema.index({ customer: 1 })
reviewSchema.index({ vendor: 1 })
reviewSchema.index({ rating: -1 })
reviewSchema.index({ createdAt: -1 })

// Prevent duplicate reviews for same product by same customer
reviewSchema.index({ product: 1, customer: 1 }, { unique: true })

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.length
})

// Virtual for reported count
reviewSchema.virtual('reportedCount').get(function() {
  return this.reported.length
})

// Method to mark as helpful
reviewSchema.methods.markHelpful = async function(userId) {
  if (!this.helpful.includes(userId)) {
    this.helpful.push(userId)
    await this.save()
  }
}

// Method to report review
reviewSchema.methods.report = async function(userId, reason) {
  if (!this.reported.includes(userId)) {
    this.reported.push(userId)
    this.isFlagged = true
    this.flagReason = reason
    this.flaggedBy = userId
    this.flaggedAt = new Date()
    await this.save()
  }
}

// Method to approve review
reviewSchema.methods.approve = async function(moderatorId) {
  this.isApproved = true
  this.approvedBy = moderatorId
  this.approvedAt = new Date()
  await this.save()

  // Update product rating
  const Product = mongoose.model('Product')
  const product = await Product.findById(this.product)
  if (product) {
    await product.updateRating()
  }
}

// Method to flag review
reviewSchema.methods.flag = async function(moderatorId, reason) {
  this.isFlagged = true
  this.flagReason = reason
  this.flaggedBy = moderatorId
  this.flaggedAt = new Date()
  await this.save()
}

// Static method to get approved reviews for product
reviewSchema.statics.getApprovedForProduct = function(productId) {
  return this.find({ product: productId, isApproved: true })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 })
}

// Static method to get pending reviews
reviewSchema.statics.getPending = function() {
  return this.find({ isApproved: false, isFlagged: false })
    .populate('product', 'name images')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
}

// Static method to get flagged reviews
reviewSchema.statics.getFlagged = function() {
  return this.find({ isFlagged: true })
    .populate('product', 'name images')
    .populate('customer', 'name email')
    .sort({ flaggedAt: -1 })
}

module.exports = mongoose.model('Review', reviewSchema)
