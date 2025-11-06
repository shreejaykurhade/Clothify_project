const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const deliveryAgentSchema = new mongoose.Schema({
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
    required: [true, 'Please add a phone number']
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
  // Delivery agent-specific fields
  vehicleType: {
    type: String,
    required: [true, 'Please add a vehicle type'],
    enum: ['bicycle', 'motorcycle', 'car', 'van', 'truck']
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentLocation: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  serviceArea: {
    city: String,
    state: String,
    zipCodes: [String]
  },
  // Performance metrics
  totalDeliveries: {
    type: Number,
    default: 0
  },
  completedDeliveries: {
    type: Number,
    default: 0
  },
  onTimeDeliveries: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  // Current assignments
  activeDeliveries: [{
    orderId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Order'
    },
    status: {
      type: String,
      enum: ['assigned', 'picked_up', 'in_transit', 'delivered'],
      default: 'assigned'
    },
    assignedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Schedule
  workingHours: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '18:00'
    },
    daysOff: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }]
  },
  // Emergency contact
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  }
}, {
  timestamps: true
})

// Encrypt password before saving
deliveryAgentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
deliveryAgentSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'delivery' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
deliveryAgentSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Remove password from JSON output
deliveryAgentSchema.methods.toJSON = function() {
  const agentObject = this.toObject()
  delete agentObject.password
  return agentObject
}

// Update location
deliveryAgentSchema.methods.updateLocation = async function(latitude, longitude) {
  this.currentLocation = { latitude, longitude }
  await this.save()
}

// Assign delivery
deliveryAgentSchema.methods.assignDelivery = async function(orderId) {
  this.activeDeliveries.push({
    orderId,
    status: 'assigned'
  })
  await this.save()
}

// Update delivery status
deliveryAgentSchema.methods.updateDeliveryStatus = async function(orderId, status) {
  const delivery = this.activeDeliveries.find(d => d.orderId.toString() === orderId.toString())
  if (delivery) {
    delivery.status = status
    if (status === 'delivered') {
      this.completedDeliveries += 1
      this.totalDeliveries += 1
      // Remove from active deliveries
      this.activeDeliveries = this.activeDeliveries.filter(d => d.orderId.toString() !== orderId.toString())
    }
    await this.save()
  }
}

// Calculate performance metrics
deliveryAgentSchema.methods.calculatePerformance = function() {
  if (this.totalDeliveries > 0) {
    return {
      completionRate: (this.completedDeliveries / this.totalDeliveries) * 100,
      onTimeRate: this.totalDeliveries > 0 ? (this.onTimeDeliveries / this.totalDeliveries) * 100 : 0,
      averageRating: this.averageRating
    }
  }
  return { completionRate: 0, onTimeRate: 0, averageRating: 0 }
}

module.exports = mongoose.model('DeliveryAgent', deliveryAgentSchema)
