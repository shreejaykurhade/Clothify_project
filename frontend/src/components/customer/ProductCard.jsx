import { Box, Image, Text, VStack, HStack, Badge, Button, IconButton, useToast } from '@chakra-ui/react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { customerService } from '../../services/customerService'

const ProductCard = ({ product, onClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const toast = useToast()

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to add items to cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setAddingToCart(true)
      await addToCart({
        product: product._id,
        quantity: 1,
        selectedVariants: {}
      })
      toast({
        title: 'Added to cart',
        description: `${product.name} has been added to your cart`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setAddingToCart(false)
    }
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? 'gold' : 'none'}
        color={i < rating ? 'gold' : 'gray'}
      />
    ))
  }

  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="md"
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      onClick={onClick}
      position="relative"
    >
      {/* Product Image */}
      <Box position="relative" h="200px" overflow="hidden">
        <Image
          src={product.images && product.images.length > 0 ? product.images[0].url : product.primaryImage || '/placeholder-product.jpg'}
          alt={product.name}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.3s"
          _hover={{ transform: 'scale(1.05)' }}
        />

        {/* Badges */}
        <VStack position="absolute" top={2} left={2} spacing={1}>
          {product.isFeatured && (
            <Badge colorScheme="purple" fontSize="xs">
              Featured
            </Badge>
          )}
          {product.discount > 0 && (
            <Badge colorScheme="red" fontSize="xs">
              -{product.discount}%
            </Badge>
          )}
        </VStack>

        {/* Wishlist Button */}
        <IconButton
          icon={<Heart />}
          variant="ghost"
          colorScheme={isWishlisted ? 'red' : 'gray'}
          position="absolute"
          top={2}
          right={2}
          size="sm"
          onClick={handleWishlist}
          bg="white"
          _hover={{ bg: 'gray.100' }}
        />
      </Box>

      {/* Product Info */}
      <VStack p={4} align="start" spacing={2}>
        <Text fontWeight="semibold" fontSize="md" noOfLines={2}>
          {product.name}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {product.description}
        </Text>

        {/* Rating */}
        <HStack spacing={1}>
          {renderStars(product.ratings?.average || 0)}
          <Text fontSize="sm" color="gray.500">
            ({product.ratings?.count || 0})
          </Text>
        </HStack>

        {/* Price */}
        <HStack spacing={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="purple.600">
            ${product.price}
          </Text>
          {product.originalPrice && product.originalPrice > product.price && (
            <Text fontSize="sm" color="gray.500" textDecoration="line-through">
              ${product.originalPrice}
            </Text>
          )}
        </HStack>

        {/* Stock Status */}
        <Badge
          colorScheme={product.stock > 0 ? 'green' : 'red'}
          fontSize="xs"
          variant="subtle"
        >
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </Badge>

        {/* Add to Cart Button */}
        <Button
          colorScheme="purple"
          size="sm"
          w="full"
          leftIcon={<ShoppingCart size={16} />}
          onClick={handleAddToCart}
          isLoading={addingToCart}
          loadingText="Adding..."
          isDisabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </VStack>
    </Box>
  )
}

export default ProductCard
