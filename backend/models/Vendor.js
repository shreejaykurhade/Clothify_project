const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const vendorSchema = new mongoose.Schema({
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
  // Vendor-specific fields
  storeName: {
    type: String,
    required: [true, 'Please add a store name'],
    trim: true,
    maxlength: [100, 'Store name cannot be more than 100 characters']
  },
  storeDescription: {
    type: String,
    required: [true, 'Please add a store description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  businessLicense: {
    type: String,
    required: [true, 'Please add a business license']
  },
  taxId: {
    type: String,
    required: [true, 'Please add a tax ID']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvalDate: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin'
  },
  // Performance metrics
  totalProducts: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  // Bank details for payouts
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    routingNumber: String,
    swiftCode: String
  },
  // Commission rate (set by admin)
  commissionRate: {
    type: Number,
    default: 10, // 10%
    min: 0,
    max: 50
  }
}, {
  timestamps: true
})

// Encrypt password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
vendorSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'vendor' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
vendorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
vendorSchema.methods.toJSON = function() {
  const vendorObject = this.toObject()
  delete vendorObject.password
  return vendorObject
}

// Update performance metrics
vendorSchema.methods.updatePerformanceMetrics = async function() {
  const Product = mongoose.model('Product')
  const Order = mongoose.model('Order')

  // Update total products
  this.totalProducts = await Product.countDocuments({ vendor: this._id, isActive: true })

  // Update total orders and revenue
  const orders = await Order.find({ vendor: this._id, orderStatus: 'delivered' })
  this.totalOrders = orders.length
  this.totalRevenue = orders.reduce((total, order) => total + order.total, 0)

  // Update average rating
  const products = await Product.find({ vendor: this._id, isActive: true })
  if (products.length > 0) {
    const totalRating = products.reduce((sum, product) => sum + product.ratings.average, 0)
    this.averageRating = totalRating / products.length
  }

  await this.save()
}

module.exports = mongoose.model('Vendor', vendorSchema)
