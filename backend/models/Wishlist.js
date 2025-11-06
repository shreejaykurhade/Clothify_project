const mongoose = require('mongoose')

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  priceWhenAdded: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: null
  }
})

const wishlistSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Categories for organization
  categories: [{
    name: String,
    items: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Product'
    }]
  }],
  // Sharing settings
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
})

// Update totals before saving
wishlistSchema.pre('save', function(next) {
  this.totalItems = this.items.length
  this.lastUpdated = new Date()
  next()
})

// Method to add item to wishlist
wishlistSchema.methods.addItem = async function(productId, price, notes = null) {
  const existingItemIndex = this.items.findIndex(item =>
    item.product.toString() === productId.toString()
  )

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].priceWhenAdded = price
    if (notes) this.items[existingItemIndex].notes = notes
    this.items[existingItemIndex].addedAt = new Date()
  } else {
    // Add new item
    this.items.push({
      product: productId,
      priceWhenAdded: price,
      notes
    })
  }

  await this.save()
}

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(item =>
    item.product.toString() !== productId.toString()
  )
  await this.save()
}

// Method to check if product is in wishlist
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(item => item.product.toString() === productId.toString())
}

// Method to move item to cart
wishlistSchema.methods.moveToCart = async function(productId) {
  const item = this.items.find(item => item.product.toString() === productId.toString())
  if (item) {
    await this.removeItem(productId)
    return item
  }
  return null
}

// Method to add to category
wishlistSchema.methods.addToCategory = async function(productId, categoryName) {
  let category = this.categories.find(cat => cat.name === categoryName)
  if (!category) {
    category = { name: categoryName, items: [] }
    this.categories.push(category)
  }

  if (!category.items.includes(productId)) {
    category.items.push(productId)
    await this.save()
  }
}

// Method to remove from category
wishlistSchema.methods.removeFromCategory = async function(productId, categoryName) {
  const category = this.categories.find(cat => cat.name === categoryName)
  if (category) {
    category.items = category.items.filter(id => id.toString() !== productId.toString())
    await this.save()
  }
}

// Method to generate share token
wishlistSchema.methods.generateShareToken = async function() {
  this.shareToken = require('crypto').randomBytes(32).toString('hex')
  this.isPublic = true
  await this.save()
  return this.shareToken
}

// Static method to get or create wishlist for customer
wishlistSchema.statics.getOrCreate = async function(customerId) {
  let wishlist = await this.findOne({ customer: customerId })
  if (!wishlist) {
    wishlist = new this({ customer: customerId, items: [] })
    await wishlist.save()
  }
  return wishlist
}

// Static method to get public wishlist by token
wishlistSchema.statics.getByShareToken = function(token) {
  return this.findOne({ shareToken: token, isPublic: true })
    .populate({
      path: 'items.product',
      select: 'name images price category brand'
    })
    .populate('customer', 'name')
}

// Virtual for wishlist value
wishlistSchema.virtual('totalValue').get(function() {
  return this.items.reduce((total, item) => total + item.priceWhenAdded, 0)
})

// Virtual for recently added items
wishlistSchema.virtual('recentItems').get(function() {
  return this.items
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, 5)
})

module.exports = mongoose.model('Wishlist', wishlistSchema)
