const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const customerSchema = new mongoose.Schema({
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
  // Customer-specific fields
  preferences: {
    categories: [String],
    brands: [String],
    priceRange: {
      min: Number,
      max: Number
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  membershipLevel: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Encrypt password before saving
customerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
customerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
customerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
customerSchema.methods.toJSON = function() {
  const customerObject = this.toObject()
  delete customerObject.password
  return customerObject
}

// Update membership level based on total spent
customerSchema.methods.updateMembershipLevel = function() {
  if (this.totalSpent >= 10000) {
    this.membershipLevel = 'platinum'
  } else if (this.totalSpent >= 5000) {
    this.membershipLevel = 'gold'
  } else if (this.totalSpent >= 1000) {
    this.membershipLevel = 'silver'
  } else {
    this.membershipLevel = 'bronze'
  }
}

module.exports = mongoose.model('Customer', customerSchema)
