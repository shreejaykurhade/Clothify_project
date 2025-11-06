import { Box, VStack, HStack, Text, Button, Image, IconButton, Divider, Card, CardBody, useToast } from '@chakra-ui/react'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      toast({
        title: 'Item removed',
        description: 'Item has been removed from your cart',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId)
    toast({
      title: 'Item removed',
      description: `${productName} has been removed from your cart`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to checkout',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      navigate('/auth/login')
      return
    }

    if (items.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart before checkout',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    navigate('/customer/checkout')
  }

  if (items.length === 0) {
    return (
      <Box textAlign="center" py={12} w="full" maxW="100%">
        <VStack spacing={6}>
          <Text fontSize="2xl" color="gray.500">
            Your cart is empty
          </Text>
          <Text color="gray.600">
            Add some products to get started!
          </Text>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => navigate('/customer/catalog')}
          >
            Browse Products
          </Button>
        </VStack>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch" w="full" maxW="100%">
      {/* Cart Items */}
      <VStack spacing={4} align="stretch">
        {items.map((item) => (
          <Card key={item.id} size="sm">
            <CardBody>
              <HStack spacing={4} align="start">
                <Image
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="md"
                />

                <VStack flex={1} align="start" spacing={2}>
                  <Text fontWeight="semibold" fontSize="lg">
                    {item.name}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    ${item.price} each
                  </Text>

                  <HStack spacing={3}>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<Minus />}
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        isDisabled={item.quantity <= 1}
                      />
                      <Text fontSize="lg" fontWeight="semibold" minW="40px" textAlign="center">
                        {item.quantity}
                      </Text>
                      <IconButton
                        icon={<Plus />}
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        isDisabled={item.quantity >= item.stock}
                      />
                    </HStack>

                    <IconButton
                      icon={<Trash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      aria-label="Remove item"
                    />
                  </HStack>
                </VStack>

                <VStack align="end" spacing={2}>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Cart Summary */}
      <Card bg="purple.50">
        <CardBody>
          <VStack spacing={4}>
            <HStack justify="space-between" w="full">
              <Text fontSize="lg">Subtotal ({getTotalItems()} items)</Text>
              <Text fontSize="lg" fontWeight="semibold">
                ${getTotalPrice().toFixed(2)}
              </Text>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text>Shipping</Text>
              <Text fontWeight="semibold">
                {getTotalPrice() >= 50 ? 'Free' : '$9.99'}
              </Text>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text>Tax</Text>
              <Text fontWeight="semibold">
                ${(getTotalPrice() * 0.08).toFixed(2)}
              </Text>
            </HStack>

            <Divider />

            <HStack justify="space-between" w="full">
              <Text fontSize="xl" fontWeight="bold">
                Total
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 9.99) + getTotalPrice() * 0.08).toFixed(2)}
              </Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <HStack spacing={4} justify="space-between" flexWrap="wrap">
        <Button
          variant="outline"
          colorScheme="red"
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>

        <HStack spacing={4} flexWrap="wrap">
          <Button
            variant="outline"
            onClick={() => navigate('/customer/catalog')}
          >
            Continue Shopping
          </Button>

          <Button
            colorScheme="purple"
            size="lg"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </HStack>
      </HStack>
    </VStack>
  )
}

export default Cart