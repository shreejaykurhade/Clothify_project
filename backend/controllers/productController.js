const Product = require('../models/Product')
const Vendor = require('../models/Vendor')

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    let query

    // Copy req.query
    const reqQuery = { ...req.query }

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    // Create query string
    let queryStr = JSON.stringify(reqQuery)

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

    // Finding resource
    query = Product.find(JSON.parse(queryStr)).populate('vendor', 'name storeName')

    // Default filters for public access - only show approved and active products
    // unless explicitly requested otherwise (for admin/vendor access)
    if (!req.query.includeUnapproved) {
      query = query.where('isApproved').equals(true).where('isActive').equals(true)
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await Product.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    // Executing query
    const products = await query

    // Pagination result
    const pagination = {}

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name storeName')
      .populate('approvedBy', 'name')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Increment view count
    product.viewCount += 1
    await product.save()

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Vendor only)
const createProduct = async (req, res) => {
  try {
    // Add vendor to req.body
    req.body.vendor = req.user.id
    req.body.isApproved = false // Products need approval from admin/moderator
    req.body.approvalStatus = 'pending'

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.imageAlts ? req.body.imageAlts[index] || '' : '',
        isPrimary: index === 0 // First image is primary
      }))
      req.body.images = images
    } else {
      // If no images uploaded, return error
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      })
    }

    const product = await Product.create(req.body)

    res.status(201).json({
      success: true,
      data: product
    })
  } catch (error) {
    // Clean up uploaded files if product creation fails
    if (req.files && req.files.length > 0) {
      const fs = require('fs')
      const path = require('path')
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads', file.filename)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      })
    }

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Vendor/Admin only)
const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Make sure user is product owner or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Vendor/Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Make sure user is product owner or admin
    if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      })
    }

    await product.remove()

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
}

// @desc    Get products by vendor
// @route   GET /api/products/vendor/:vendorId
// @access  Public
const getProductsByVendor = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.params.vendorId,
      isActive: true
    }).populate('vendor', 'name storeName')

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true,
      isApproved: true
    }).populate('vendor', 'name storeName')

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true,
      isApproved: true
    }).populate('vendor', 'name storeName')

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a search query'
      })
    }

    const products = await Product.find({
      $text: { $search: q },
      isActive: true,
      isApproved: true
    }).populate('vendor', 'name storeName')

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
}
