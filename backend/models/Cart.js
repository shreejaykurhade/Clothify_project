const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  selectedVariants: {
    size: String,
    color: String,
    style: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Update totals before saving
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0)
  this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  this.lastUpdated = new Date()
  next()
})

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price, variants = {}) {
  const existingItemIndex = this.items.findIndex(item =>
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
  )

  if (existingItemIndex > -1) {
    this.items[existingItemIndex].quantity += quantity
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      selectedVariants: variants
    })
  }
}

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId, variants = {}) {
  this.items = this.items.filter(item =>
    !(item.product.toString() === productId.toString() &&
      JSON.stringify(item.selectedVariants) === JSON.stringify(variants))
  )
}

// Method to update item quantity
cartSchema.methods.updateQuantity = function(productId, quantity, variants = {}) {
  const item = this.items.find(item =>
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
  )

  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId, variants)
    } else {
      item.quantity = quantity
    }
  }
}

// Method to clear cart
cartSchema.methods.clear = function() {
  this.items = []
}

// Method to check if cart is empty
cartSchema.methods.isEmpty = function() {
  return this.items.length === 0
}

// Static method to get or create cart for user
cartSchema.statics.getOrCreate = async function(userId) {
  let cart = await this.findOne({ user: userId })
  if (!cart) {
    cart = new this({ user: userId, items: [] })
    await cart.save()
  }
  return cart
}

module.exports = mongoose.model('Cart', cartSchema)
