const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const inventoryManagerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  // Inventory manager-specific fields
  warehouse: {
    name: String,
    location: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    capacity: Number,
    currentOccupancy: { type: Number, default: 0 }
  },
  permissions: {
    products: {
      add: { type: Boolean, default: true },
      update: { type: Boolean, default: true },
      delete: { type: Boolean, default: false },
      view: { type: Boolean, default: true }
    },
    inventory: {
      adjust: { type: Boolean, default: true },
      transfer: { type: Boolean, default: true },
      audit: { type: Boolean, default: true }
    },
    reports: {
      generate: { type: Boolean, default: true },
      view: { type: Boolean, default: true }
    }
  },
  // Performance metrics
  productsManaged: {
    type: Number,
    default: 0
  },
  inventoryAdjustments: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  // Activity tracking
  lastActivity: {
    type: Date,
    default: Date.now
  },
  actionsPerformed: [{
    action: String,
    targetType: String,
    targetId: mongoose.Schema.ObjectId,
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }],
  // Assigned categories/vendors
  assignedCategories: [{
    type: String
  }],
  assignedVendors: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Vendor'
  }]
}, {
  timestamps: true
})

// Encrypt password before saving
inventoryManagerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
inventoryManagerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'inventory' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
inventoryManagerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
inventoryManagerSchema.methods.toJSON = function() {
  const managerObject = this.toObject()
  delete managerObject.password
  return managerObject
}

// Log inventory action
inventoryManagerSchema.methods.logAction = async function(action, targetType, targetId, details = {}) {
  this.actionsPerformed.push({
    action,
    targetType,
    targetId,
    details
  })

  // Keep only last 100 actions
  if (this.actionsPerformed.length > 100) {
    this.actionsPerformed = this.actionsPerformed.slice(-100)
  }

  this.lastActivity = new Date()
  await this.save()
}

// Update warehouse occupancy
inventoryManagerSchema.methods.updateWarehouseOccupancy = async function() {
  const Product = mongoose.model('Product')
  const products = await Product.find({
    category: { $in: this.assignedCategories },
    isActive: true
  })

  this.warehouse.currentOccupancy = products.reduce((total, product) => total + product.stock, 0)
  await this.save()
}

// Check permission
inventoryManagerSchema.methods.hasPermission = function(resource, action) {
  if (!this.permissions[resource]) return false
  return this.permissions[resource][action] === true
}

// Can manage product
inventoryManagerSchema.methods.canManageProduct = function(product) {
  return this.assignedCategories.includes(product.category) ||
         this.assignedVendors.some(vendorId => vendorId.toString() === product.vendor.toString())
}

module.exports = mongoose.model('InventoryManager', inventoryManagerSchema)
