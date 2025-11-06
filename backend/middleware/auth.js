const jwt = require('jsonwebtoken')
const Customer = require('../models/Customer')
const Vendor = require('../models/Vendor')
const Admin = require('../models/Admin')
const Moderator = require('../models/Moderator')
const DeliveryAgent = require('../models/DeliveryAgent')
const InventoryManager = require('../models/InventoryManager')

// Protect routes - require authentication
const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token - check all models
      const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
      let user = null

      for (const Model of models) {
        user = await Model.findById(decoded.id).select('-password')
        if (user) break
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        })
      }

      // Set role based on model type if not already set
      if (!user.role) {
        const modelName = user.constructor.modelName
        switch (modelName) {
          case 'Customer':
            user.role = 'customer'
            break
          case 'Vendor':
            user.role = 'vendor'
            break
          case 'Admin':
            user.role = 'admin'
            break
          case 'Moderator':
            user.role = 'moderator'
            break
          case 'DeliveryAgent':
            user.role = 'delivery'
            break
          case 'InventoryManager':
            user.role = 'inventory'
            break
          default:
            user.role = 'customer'
        }
      }

      req.user = user
      next()
    } catch (error) {
      console.error(error)
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    })
  }
}

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      })
    }

    next()
  }
}

// Check if user owns resource or is admin
const ownerOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this resource'
    })
  }
}

module.exports = {
  protect,
  authorize,
  ownerOrAdmin
}
