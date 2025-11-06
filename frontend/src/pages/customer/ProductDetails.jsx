import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Button, Image, Badge, Grid, Divider, useToast, Spinner, Alert, AlertIcon, Tabs, TabList, Tab, TabPanels, TabPanel, Avatar, IconButton } from '@chakra-ui/react'
import { ShoppingCart, Heart, Star, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { customerService } from '../../services/customerService'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const ProductDetails = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await customerService.getProduct(productId)
      setProduct(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load product details')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to add items to cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      navigate('/auth/login')
      return
    }

    try {
      setAddingToCart(true)
      await addToCart({
        product: product._id,
        quantity,
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

  const handleWishlist = () => {
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
        size={16}
        fill={i < rating ? 'gold' : 'none'}
        color={i < rating ? 'gold' : 'gray'}
      />
    ))
  }

  if (loading) {
    return (
      <Layout title="Product Details" role="customer">
        <Box textAlign="center" py={12}>
          <Spinner size="xl" color="purple.500" />
          <Text mt={4}>Loading product details...</Text>
        </Box>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout title="Product Details" role="customer">
        <Alert status="error">
          <AlertIcon />
          {error || 'Product not found'}
        </Alert>
      </Layout>
    )
  }

  const images = product.images && product.images.length > 0 ? product.images.map(img => img.url) : [product.primaryImage]

  return (
    <Layout title={product.name} role="customer">
      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
        {/* Product Images */}
        <VStack spacing={4} align="start">
          <Box position="relative">
            <Image
              src={images[selectedImage] || '/placeholder-product.jpg'}
              alt={product.name}
              w="full"
              h="400px"
              objectFit="cover"
              borderRadius="lg"
            />
            {product.isFeatured && (
              <Badge
                position="absolute"
                top={2}
                left={2}
                colorScheme="purple"
              >
                Featured
              </Badge>
            )}
          </Box>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <HStack spacing={2} overflowX="auto" w="full">
              {images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  w="60px"
                  h="60px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                  border={selectedImage === index ? '2px solid' : '1px solid'}
                  borderColor={selectedImage === index ? 'purple.500' : 'gray.200'}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </HStack>
          )}
        </VStack>

        {/* Product Info */}
        <VStack spacing={6} align="start">
          <VStack spacing={3} align="start" w="full">
            <HStack justify="space-between" w="full">
              <Text fontSize="sm" color="gray.600" textTransform="uppercase">
                {product.category}
              </Text>
              <IconButton
                icon={<Heart />}
                variant="ghost"
                colorScheme={isWishlisted ? 'red' : 'gray'}
                onClick={handleWishlist}
                aria-label="Add to wishlist"
              />
            </HStack>

            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              {product.name}
            </Text>

            <HStack spacing={2}>
              {renderStars(product.ratings?.average || 0)}
              <Text fontSize="sm" color="gray.600">
                ({product.ratings?.count || 0} reviews)
              </Text>
            </HStack>

            <HStack spacing={4} align="center">
              <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                ${product.price}
              </Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text fontSize="lg" color="gray.500" textDecoration="line-through">
                  ${product.originalPrice}
                </Text>
              )}
              {product.discount > 0 && (
                <Badge colorScheme="red">
                  -{product.discount}%
                </Badge>
              )}
            </HStack>

            <Badge
              colorScheme={product.stock > 0 ? 'green' : 'red'}
              fontSize="sm"
            >
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </Badge>
          </VStack>

          <Divider />

          {/* Quantity and Add to Cart */}
          <VStack spacing={4} w="full">
            <HStack spacing={4} w="full">
              <Text fontWeight="semibold">Quantity:</Text>
              <HStack spacing={2}>
                <IconButton
                  icon={<Minus />}
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  isDisabled={quantity <= 1}
                />
                <Text fontSize="lg" fontWeight="semibold" minW="40px" textAlign="center">
                  {quantity}
                </Text>
                <IconButton
                  icon={<Plus />}
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  isDisabled={quantity >= product.stock}
                />
              </HStack>
            </HStack>

            <Button
              colorScheme="purple"
              size="lg"
              w="full"
              leftIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              isLoading={addingToCart}
              loadingText="Adding to cart..."
              isDisabled={product.stock === 0}
            >
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </Button>
          </VStack>

          <Divider />

          {/* Product Features */}
          <VStack spacing={3} align="start" w="full">
            <HStack spacing={3}>
              <Truck size={20} color="green" />
              <Text fontSize="sm">Free shipping on orders over $50</Text>
            </HStack>
            <HStack spacing={3}>
              <Shield size={20} color="blue" />
              <Text fontSize="sm">2-year warranty included</Text>
            </HStack>
            <HStack spacing={3}>
              <RotateCcw size={20} color="purple" />
              <Text fontSize="sm">30-day return policy</Text>
            </HStack>
          </VStack>
        </VStack>
      </Grid>

      {/* Product Details Tabs */}
      <Box mt={12}>
        <Tabs variant="enclosed">
          <TabList>
            <Tab>Description</Tab>
            <Tab>Specifications</Tab>
            <Tab>Reviews</Tab>
            <Tab>Shipping & Returns</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Text whiteSpace="pre-line">{product.description}</Text>
            </TabPanel>

            <TabPanel>
              <VStack spacing={3} align="start">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <HStack key={key} spacing={4} w="full">
                    <Text fontWeight="semibold" minW="120px">{key}:</Text>
                    <Text>{value}</Text>
                  </HStack>
                ))}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="start">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <Box key={review._id} p={4} border="1px" borderColor="gray.200" borderRadius="md" w="full">
                      <HStack spacing={3} mb={2}>
                        <Avatar size="sm" name={review.user?.name} />
                        <VStack spacing={0} align="start">
                          <Text fontWeight="semibold">{review.user?.name}</Text>
                          <HStack spacing={1}>
                            {renderStars(review.rating)}
                          </HStack>
                        </VStack>
                      </HStack>
                      <Text>{review.comment}</Text>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500">No reviews yet. Be the first to review this product!</Text>
                )}
              </VStack>
            </TabPanel>

            <TabPanel>
              <VStack spacing={4} align="start">
                <Text fontWeight="semibold">Shipping Information</Text>
                <Text>
                  We offer free standard shipping on all orders over $50.
                  Orders are typically delivered within 3-5 business days.
                </Text>

                <Text fontWeight="semibold">Return Policy</Text>
                <Text>
                  We accept returns within 30 days of purchase for a full refund,
                  provided the item is in its original condition and packaging.
                </Text>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Layout>
  )
}

export default ProductDetails
