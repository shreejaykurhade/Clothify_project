import { useState, useEffect } from "react"
import { Box, VStack, HStack, Text, Button, SimpleGrid, Card, CardBody, Heading, useToast, Spinner, Center, IconButton } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import Layout from '../../components/common/Layout'
import { Heart } from 'lucide-react'

const MotionBox = motion(Box)

const CustomerWishlist = () => {
  const { user } = useAuth()
  const { wishlist, removeFromWishlist, addToCart } = useCart()
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = (product) => {
    addToCart(product)
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId)
    toast({
      title: 'Removed from wishlist',
      description: 'Item has been removed from your wishlist',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const renderStars = (rating) => {
    return Array(5).fill('').map((_, i) => (
      <Box
        key={i}
        as="span"
        color={i < rating ? 'yellow.400' : 'gray.300'}
        fontSize="sm"
      >
        ★
      </Box>
    ))
  }

  return (
    <Box maxW="1200px" mx="auto" px={6}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg" color="gray.800">
              My Wishlist ({wishlist.length})
            </Heading>
          </HStack>

          {wishlist.length === 0 ? (
            <VStack spacing={8} align="center" py={16}>
              <Box textAlign="center">
                <Heart size={64} color="#9CA3AF" />
                <Heading size="lg" color="gray.600" mt={4} mb={2}>
                  Your wishlist is empty
                </Heading>
                <Text color="gray.500" mb={6}>
                  Start adding items you love to your wishlist
                </Text>
                <Button
                  colorScheme="purple"
                  onClick={() => navigate('/customer/catalog')}
                  borderRadius="xl"
                  size="lg"
                >
                  Browse Products
                </Button>
              </Box>
            </VStack>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
              {wishlist.map((product) => (
                <MotionBox
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card shadow="md" borderRadius="xl" overflow="hidden" position="relative">
                    {/* Remove from wishlist button */}
                    <IconButton
                      icon={<Heart size={16} fill="currentColor" />}
                      position="absolute"
                      top={2}
                      right={2}
                      zIndex={2}
                      size="sm"
                      colorScheme="red"
                      variant="solid"
                      borderRadius="full"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      _hover={{ transform: 'scale(1.1)' }}
                      transition="all 0.2s"
                    />

                    {/* Product Image */}
                    <Box position="relative" overflow="hidden">
                      <Box
                        as="img"
                        src={product.image || '/placeholder.jpg'}
                        alt={product.name}
                        w="full"
                        h="200px"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _hover={{ transform: 'scale(1.05)' }}
                      />
                    </Box>

                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm" color="gray.500" textTransform="uppercase">
                            {product.category}
                          </Text>
                          <Text fontSize="lg" fontWeight="semibold" color="gray.800" noOfLines={2}>
                            {product.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600" noOfLines={2}>
                            {product.description}
                          </Text>
                        </VStack>

                        {/* Rating */}
                        <HStack spacing={1}>
                          {renderStars(Math.floor(product.rating || 0))}
                          <Text fontSize="sm" color="gray.500" ml={1}>
                            ({product.reviews || 0})
                          </Text>
                        </HStack>

                        {/* Price */}
                        <HStack justify="space-between" align="center">
                          <Text fontSize="xl" fontWeight="bold" color="purple.600">
                            ${product.price}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Stock: {product.stock}
                          </Text>
                        </HStack>

                        {/* Add to Cart Button */}
                        <Button
                          colorScheme="purple"
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          isDisabled={product.stock === 0}
                          w="full"
                          borderRadius="lg"
                          _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
                          transition="all 0.2s"
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </MotionBox>
    </Box>
  )
}

export default CustomerWishlist
