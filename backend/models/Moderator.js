const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const moderatorSchema = new mongoose.Schema({
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
  // Moderator-specific fields
  specialization: {
    type: String,
    enum: ['content', 'reviews', 'products', 'users', 'general'],
    default: 'general'
  },
  permissions: {
    reviews: {
      approve: { type: Boolean, default: true },
      reject: { type: Boolean, default: true },
      flag: { type: Boolean, default: true }
    },
    products: {
      moderate: { type: Boolean, default: true },
      flag: { type: Boolean, default: true }
    },
    users: {
      suspend: { type: Boolean, default: false },
      warn: { type: Boolean, default: true }
    },
    reports: {
      generate: { type: Boolean, default: true },
      view: { type: Boolean, default: true }
    }
  },
  // Performance metrics
  reviewsModerated: {
    type: Number,
    default: 0
  },
  productsModerated: {
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
  // Queue assignment
  assignedQueues: [{
    type: String,
    enum: ['reviews', 'products', 'reports']
  }]
}, {
  timestamps: true
})

// Encrypt password before saving
moderatorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
moderatorSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'moderator' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
moderatorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
moderatorSchema.methods.toJSON = function() {
  const moderatorObject = this.toObject()
  delete moderatorObject.password
  return moderatorObject
}

// Log moderator action
moderatorSchema.methods.logAction = async function(action, targetType, targetId, details = {}) {
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

// Update performance metrics
moderatorSchema.methods.updatePerformanceMetrics = async function() {
  // This would be called after each moderation action
  // For now, just update last activity
  this.lastActivity = new Date()
  await this.save()
}

// Check permission
moderatorSchema.methods.hasPermission = function(resource, action) {
  if (!this.permissions[resource]) return false
  return this.permissions[resource][action] === true
}

module.exports = mongoose.model('Moderator', moderatorSchema)
