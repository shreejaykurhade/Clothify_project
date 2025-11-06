const Customer = require('../models/Customer')
const Vendor = require('../models/Vendor')
const Admin = require('../models/Admin')
const Moderator = require('../models/Moderator')
const DeliveryAgent = require('../models/DeliveryAgent')
const InventoryManager = require('../models/InventoryManager')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Get model based on role
const getModelByRole = (role) => {
  switch (role) {
    case 'customer':
      return Customer
    case 'vendor':
      return Vendor
    case 'admin':
      return Admin
    case 'moderator':
      return Moderator
    case 'delivery':
      return DeliveryAgent
    case 'inventory':
      return InventoryManager
    default:
      return Customer
  }
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, storeName, storeDescription, businessLicense, taxId } = req.body

    // Check if user exists in ANY model (email must be unique across all user types)
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    for (const Model of models) {
      const existingUser = await Model.findOne({ email })
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        })
      }
    }

    // Get the appropriate model
    const Model = getModelByRole(role)

    // Create user data based on role
    let userData = { name, email, password }

    if (role === 'customer') {
      userData = {
        ...userData,
        phone: phone || '',
        address: address ? {
          street: address,
          city: '',
          state: '',
          zipCode: '',
          country: ''
        } : {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      }
    } else if (role === 'vendor') {
      userData = {
        ...userData,
        phone: phone || '',
        storeName: storeName || '',
        storeDescription: storeDescription || '',
        businessLicense: businessLicense || '',
        taxId: taxId || '',
        businessName: storeName || '',
        businessAddress: {
          street: address || '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        isVerified: false
      }
    } else if (role === 'admin') {
      userData = {
        ...userData,
        phone: phone || '',
        permissions: ['all']
      }
    } else if (role === 'moderator') {
      userData = {
        ...userData,
        phone: phone || '',
        permissions: ['review_moderation']
      }
    } else if (role === 'delivery') {
      userData = {
        ...userData,
        phone: phone || '',
        vehicleType: 'motorcycle',
        licenseNumber: '',
        isAvailable: true,
        currentLocation: {
          latitude: 0,
          longitude: 0
        }
      }
    } else if (role === 'inventory') {
      userData = {
        ...userData,
        phone: phone || '',
        warehouseLocation: 'Main Warehouse',
        permissions: ['inventory_management']
      }
    }

    // Create user
    const user = await Model.create(userData)

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: role
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check all models for the user (prioritize Vendor to fix routing issue)
    const models = [Vendor, Customer, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null
    let userRole = ''

    for (const Model of models) {
      user = await Model.findOne({ email }).select('+password')
      if (user) {
        // Determine role based on model
        if (Model === Customer) userRole = 'customer'
        else if (Model === Vendor) userRole = 'vendor'
        else if (Model === Admin) userRole = 'admin'
        else if (Model === Moderator) userRole = 'moderator'
        else if (Model === DeliveryAgent) userRole = 'delivery'
        else if (Model === InventoryManager) userRole = 'inventory'
        break
      }
    }

    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLogin = new Date()
      await user.save()

      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: userRole,
          avatar: user.avatar
        },
        token: generateToken(user._id)
      })
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // Check all models for the user
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null

    for (const Model of models) {
      user = await Model.findById(req.user.id)
      if (user) break
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = async (req, res) => {
  try {
    // Check all models for the user
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null
    let Model = null

    for (const M of models) {
      user = await M.findById(req.user.id)
      if (user) {
        Model = M
        break
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    }

    const updatedUser = await Model.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
  try {
    // Check all models for the user
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null

    for (const Model of models) {
      user = await Model.findById(req.user.id).select('+password')
      if (user) break
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      })
    }

    user.password = req.body.newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  })
}

module.exports = {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  logout
}
