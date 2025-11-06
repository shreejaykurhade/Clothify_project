const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
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
  // Admin-specific fields
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager'],
    default: 'admin'
  },
  permissions: {
    users: {
      create: { type: Boolean, default: true },
      read: { type: Boolean, default: true },
      update: { type: Boolean, default: true },
      delete: { type: Boolean, default: false }
    },
    vendors: {
      approve: { type: Boolean, default: true },
      suspend: { type: Boolean, default: true },
      view: { type: Boolean, default: true }
    },
    products: {
      approve: { type: Boolean, default: true },
      reject: { type: Boolean, default: true },
      view: { type: Boolean, default: true }
    },
    orders: {
      view: { type: Boolean, default: true },
      modify: { type: Boolean, default: false }
    },
    reports: {
      generate: { type: Boolean, default: true },
      view: { type: Boolean, default: true }
    },
    settings: {
      modify: { type: Boolean, default: false }
    }
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
  // System settings access
  canModifySettings: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Encrypt password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
adminSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
adminSchema.methods.toJSON = function() {
  const adminObject = this.toObject()
  delete adminObject.password
  return adminObject
}

// Log admin action
adminSchema.methods.logAction = async function(action, targetType, targetId, details = {}) {
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

// Check permission
adminSchema.methods.hasPermission = function(resource, action) {
  if (!this.permissions[resource]) return false
  return this.permissions[resource][action] === true
}

module.exports = mongoose.model('Admin', adminSchema)
