const express = require('express')
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productController')

const { protect, authorize } = require('../middleware/auth')
const { uploadProductImages } = require('../middleware/upload')

const router = express.Router()

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor', 'admin'), uploadProductImages, createProduct)

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, authorize('vendor', 'admin'), deleteProduct)

router.get('/vendor/:vendorId', getProductsByVendor)
router.get('/featured/all', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/search', searchProducts)

module.exports = router
