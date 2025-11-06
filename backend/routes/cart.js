const express = require('express')
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart
} = require('../controllers/cartController')

const { protect } = require('../middleware/auth')

const router = express.Router()

router.route('/:userId')
  .get(protect, getCart)
  .delete(protect, clearCart)

router.post('/:userId', protect, addToCart)
router.put('/:userId/item', protect, updateCartItem)
router.delete('/:userId/item/:productId', protect, removeFromCart)
router.post('/:userId/sync', protect, syncCart)

module.exports = router
