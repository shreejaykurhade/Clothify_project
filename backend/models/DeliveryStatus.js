const mongoose = require('mongoose')

const deliveryStatusSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryAgent: {
    type: mongoose.Schema.ObjectId,
    ref: 'DeliveryAgent',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  notes: {
    type: String,
    default: null
  },
  estimatedDeliveryTime: {
    type: Date,
    default: null
  },
  actualDeliveryTime: {
    type: Date,
    default: null
  },
  customerFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: Date
  },
  issues: [{
    type: {
      type: String,
      enum: ['wrong_address', 'customer_not_available', 'damaged_package', 'payment_issue', 'other']
    },
    description: String,
    timestamp: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false }
  }],
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['pickup', 'delivery', 'damage', 'signature']
    },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
})

// Create indexes
deliveryStatusSchema.index({ order: 1, timestamp: -1 })
deliveryStatusSchema.index({ deliveryAgent: 1, timestamp: -1 })
deliveryStatusSchema.index({ status: 1 })

// Virtual for delivery duration
deliveryStatusSchema.virtual('deliveryDuration').get(function() {
  if (this.actualDeliveryTime && this.timestamp) {
    return Math.floor((this.actualDeliveryTime - this.timestamp) / (1000 * 60)) // minutes
  }
  return null
})

// Method to update status
deliveryStatusSchema.methods.updateStatus = async function(newStatus, location = null, notes = null) {
  this.status = newStatus
  this.timestamp = new Date()

  if (location) {
    this.location = location
  }

  if (notes) {
    this.notes = notes
  }

  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date()
  }

  await this.save()

  // Update order status
  const Order = mongoose.model('Order')
  const order = await Order.findById(this.order)
  if (order) {
    order.deliveryStatus = newStatus
    if (newStatus === 'delivered') {
      order.deliveredAt = new Date()
      order.orderStatus = 'delivered'
    }
    await order.save()
  }

  return this
}

// Method to add issue
deliveryStatusSchema.methods.addIssue = async function(issueType, description) {
  this.issues.push({
    type: issueType,
    description,
    resolved: false
  })
  await this.save()
}

// Method to resolve issue
deliveryStatusSchema.methods.resolveIssue = async function(issueIndex) {
  if (this.issues[issueIndex]) {
    this.issues[issueIndex].resolved = true
    await this.save()
  }
}

// Method to add customer feedback
deliveryStatusSchema.methods.addCustomerFeedback = async function(rating, comment) {
  this.customerFeedback = {
    rating,
    comment,
    timestamp: new Date()
  }
  await this.save()
}

// Static method to get delivery history for order
deliveryStatusSchema.statics.getHistoryForOrder = function(orderId) {
  return this.find({ order: orderId }).sort({ timestamp: 1 }).populate('deliveryAgent', 'name phone')
}

// Static method to get active deliveries for agent
deliveryStatusSchema.statics.getActiveForAgent = function(agentId) {
  return this.find({
    deliveryAgent: agentId,
    status: { $in: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery'] }
  }).populate('order')
}

// Static method to get delivery stats for agent
deliveryStatusSchema.statics.getStatsForAgent = function(agentId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        deliveryAgent: mongoose.Types.ObjectId(agentId),
        timestamp: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ])
}

module.exports = mongoose.model('DeliveryStatus', deliveryStatusSchema)
