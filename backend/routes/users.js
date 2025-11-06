const express = require('express')
const Customer = require('../models/Customer')
const Vendor = require('../models/Vendor')
const Admin = require('../models/Admin')
const Moderator = require('../models/Moderator')
const DeliveryAgent = require('../models/DeliveryAgent')
const InventoryManager = require('../models/InventoryManager')
const { protect, authorize, ownerOrAdmin } = require('../middleware/auth')

const router = express.Router()

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    // Fetch users from all role-specific models
    const [customers, vendors, admins, moderators, deliveryAgents, inventoryManagers] = await Promise.all([
      Customer.find().select('-password'),
      Vendor.find().select('-password'),
      Admin.find().select('-password'),
      Moderator.find().select('-password'),
      DeliveryAgent.find().select('-password'),
      InventoryManager.find().select('-password')
    ])

    // Combine and format users with consistent structure
    const allUsers = [
      ...customers.map(user => ({ ...user.toObject(), role: 'customer', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt })),
      ...vendors.map(user => ({ ...user.toObject(), role: 'vendor', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt })),
      ...admins.map(user => ({ ...user.toObject(), role: 'admin', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt })),
      ...moderators.map(user => ({ ...user.toObject(), role: 'moderator', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt })),
      ...deliveryAgents.map(user => ({ ...user.toObject(), role: 'delivery', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt })),
      ...inventoryManagers.map(user => ({ ...user.toObject(), role: 'inventory', status: user.isActive ? 'active' : 'inactive', joinDate: user.createdAt }))
    ]

    res.status(200).json({
      success: true,
      count: allUsers.length,
      data: allUsers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get single user
router.get('/:id', protect, ownerOrAdmin, async (req, res) => {
  try {
    // Search for user in all role-specific models
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null
    let userRole = ''

    for (const Model of models) {
      user = await Model.findById(req.params.id).select('-password')
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Add role and status to the user object
    const userData = {
      ...user.toObject(),
      role: userRole,
      status: user.isActive ? 'active' : 'inactive',
      joinDate: user.createdAt
    }

    res.status(200).json({
      success: true,
      data: userData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update user
router.put('/:id', protect, ownerOrAdmin, async (req, res) => {
  try {
    // Search for user in all role-specific models
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null
    let Model = null

    for (const M of models) {
      user = await M.findById(req.params.id)
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

    const updatedUser = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password')

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
})

// Delete user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Search for user in all role-specific models
    const models = [Customer, Vendor, Admin, Moderator, DeliveryAgent, InventoryManager]
    let user = null
    let Model = null

    for (const M of models) {
      user = await M.findById(req.params.id)
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

    await Model.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      data: {}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router
