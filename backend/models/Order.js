const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  selectedVariants: {
    size: String,
    color: String,
    style: String
  },
  subtotal: {
    type: Number,
    required: true
  }
})

const shippingAddressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
})

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
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
  items: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  shipping: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  notes: {
    type: String,
    default: null
  },
  trackingNumber: {
    type: String,
    default: null
  },
  estimatedDelivery: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  // Delivery agent assignment
  deliveryAgent: {
    type: mongoose.Schema.ObjectId,
    ref: 'DeliveryAgent',
    default: null
  },
  deliveryStatus: {
    type: String,
    enum: ['assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: null
  },
  deliveryNotes: [{
    note: String,
    timestamp: { type: Date, default: Date.now },
    agent: { type: mongoose.Schema.ObjectId, ref: 'DeliveryAgent' }
  }],
  // References to delivery status updates
  deliveryStatuses: [{
    type: mongoose.Schema.ObjectId,
    ref: 'DeliveryStatus'
  }]
}, {
  timestamps: true
})

// Generate unique order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    let orderNumber
    let exists = true
    while (exists) {
      orderNumber = 'ORD-' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()
      exists = await mongoose.model('Order').findOne({ orderNumber })
    }
    this.orderNumber = orderNumber
  }
  next()
})

// Index for better performance
orderSchema.index({ customer: 1, createdAt: -1 })
orderSchema.index({ vendor: 1, createdAt: -1 })
orderSchema.index({ orderNumber: 1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ paymentStatus: 1 })

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)) // days
})

// Method to calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((total, item) => total + item.subtotal, 0)
  this.total = this.subtotal + this.tax + this.shipping - this.discount
}

// Method to update status
orderSchema.methods.updateStatus = async function(newStatus, notes = null) {
  this.orderStatus = newStatus

  if (newStatus === 'delivered') {
    this.deliveredAt = new Date()
  }

  if (notes) {
    this.notes = notes
  }

  await this.save()

  // Update product stock and sales count
  if (newStatus === 'delivered') {
    for (const item of this.items) {
      const Product = mongoose.model('Product')
      const product = await Product.findById(item.product)
      if (product) {
        product.stock -= item.quantity
        product.salesCount += item.quantity
        await product.save()
      }
    }
  }
}

// Method to assign delivery agent
orderSchema.methods.assignDeliveryAgent = async function(agentId) {
  this.deliveryAgent = agentId
  this.deliveryStatus = 'assigned'

  // Create initial delivery status
  const DeliveryStatus = mongoose.model('DeliveryStatus')
  const deliveryStatus = new DeliveryStatus({
    order: this._id,
    deliveryAgent: agentId,
    status: 'assigned'
  })
  await deliveryStatus.save()

  this.deliveryStatuses.push(deliveryStatus._id)
  await this.save()

  // Update agent's active deliveries
  const DeliveryAgent = mongoose.model('DeliveryAgent')
  const agent = await DeliveryAgent.findById(agentId)
  if (agent) {
    await agent.assignDelivery(this._id)
  }
}

// Method to update delivery status
orderSchema.methods.updateDeliveryStatus = async function(status, location = null, notes = null) {
  this.deliveryStatus = status

  if (status === 'delivered') {
    this.deliveredAt = new Date()
    this.orderStatus = 'delivered'
  }

  // Create delivery status update
  const DeliveryStatus = mongoose.model('DeliveryStatus')
  const deliveryStatus = new DeliveryStatus({
    order: this._id,
    deliveryAgent: this.deliveryAgent,
    status,
    location,
    notes
  })
  await deliveryStatus.save()

  this.deliveryStatuses.push(deliveryStatus._id)
  await this.save()
}

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ orderStatus: status }).populate('customer', 'name email').populate('vendor', 'name')
}

// Static method to get orders by customer
orderSchema.statics.getByCustomer = function(customerId) {
  return this.find({ customer: customerId }).sort({ createdAt: -1 })
}

// Static method to get orders by vendor
orderSchema.statics.getByVendor = function(vendorId) {
  return this.find({ vendor: vendorId }).sort({ createdAt: -1 })
}

module.exports = mongoose.model('Order', orderSchema)
