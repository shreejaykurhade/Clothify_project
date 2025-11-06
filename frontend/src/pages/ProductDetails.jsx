import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Button, Image, Badge, Divider, SimpleGrid, Card, CardBody, Heading, IconButton, useToast, Spinner, Alert, AlertIcon, FormControl, FormLabel, Textarea, Input, Avatar } from '@chakra-ui/react'
import { Star, Heart, Plus, Minus, ShoppingCart, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import axios from 'axios'

const MotionBox = motion(Box)

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, addToWishlist, wishlist } = useCart()
  const { isAuthenticated } = useAuth()
  const toast = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  useEffect(() => {
    fetchProduct()
    fetchReviews()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}`)
      setProduct(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to load product details. Please try again.')
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/${id}/reviews`)
      setReviews(response.data)
    } catch (err) {
      console.error('Error fetching reviews:', err)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to add items to cart',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      navigate('/customer/login')
      return
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }

    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} has been added to your cart`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to add items to wishlist',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      navigate('/customer/login')
      return
    }

    addToWishlist(product)
    toast({
      title: 'Added to wishlist',
      description: `${product.name} has been added to your wishlist`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({
        title: 'Please login first',
        description: 'You need to be logged in to submit a review',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      navigate('/customer/login')
      return
    }

    setIsSubmittingReview(true)
    try {
      await axios.post(`${API_BASE_URL}/api/products/${id}/reviews`, {
        rating: newReview.rating,
        comment: newReview.comment,
      })

      toast({
        title: 'Review submitted',
        description: 'Thank you for your review!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })

      setNewReview({ rating: 5, comment: '' })
      fetchReviews()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const renderStars = (rating, interactive = false, onChange = null) => {
    return Array(5).fill('').map((_, i) => (
      <IconButton
        key={i}
        icon={<Star />}
        variant="ghost"
        size="sm"
        color={i < rating ? 'yellow.400' : 'gray.300'}
        fill={i < rating ? 'yellow.400' : 'none'}
        onClick={interactive ? () => onChange && onChange(i + 1) : undefined}
        cursor={interactive ? 'pointer' : 'default'}
        _hover={interactive ? { color: 'yellow.500' } : {}}
      />
    ))
  }

  const isInWishlist = wishlist.some(item => item.id === product?.id)

  if (loading) {
    return (
      <Layout title="Product Details">
        <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.600">Loading product details...</Text>
          </VStack>
        </Box>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout title="Product Details">
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          {error || 'Product not found'}
        </Alert>
      </Layout>
    )
  }

  const images = product.images || [product.image || '/placeholder.jpg']

  return (
    <Layout title={product.name}>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Product Images */}
            <VStack spacing={4} align="stretch">
              <Box position="relative" overflow="hidden" borderRadius="xl" shadow="lg">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  w="full"
                  h="400px"
                  objectFit="cover"
                  transition="transform 0.3s"
                  _hover={{ transform: 'scale(1.05)' }}
                />

                {/* Wishlist Button */}
                <IconButton
                  icon={<Heart />}
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme={isInWishlist ? 'red' : 'gray'}
                  variant="solid"
                  borderRadius="full"
                  onClick={handleAddToWishlist}
                  isDisabled={isInWishlist}
                />
              </Box>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <HStack spacing={2} overflowX="auto" pb={2}>
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      w="80px"
                      h="80px"
                      borderRadius="lg"
                      overflow="hidden"
                      cursor="pointer"
                      border={selectedImage === index ? '2px solid' : '2px solid transparent'}
                      borderColor={selectedImage === index ? 'purple.500' : 'transparent'}
                      onClick={() => setSelectedImage(index)}
                      transition="all 0.2s"
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </HStack>
              )}
            </VStack>

            {/* Product Info */}
            <VStack align="stretch" spacing={6}>
              <VStack align="start" spacing={3}>
                <HStack spacing={2}>
                  <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                    {product.category}
                  </Badge>
                  {product.featured && (
                    <Badge colorScheme="orange" borderRadius="full" px={3} py={1}>
                      Featured
                    </Badge>
                  )}
                </HStack>

                <Heading size="xl" color="gray.800">
                  {product.name}
                </Heading>

                <HStack spacing={2} align="center">
                  {renderStars(Math.floor(product.rating || 0))}
                  <Text fontSize="sm" color="gray.600">
                    ({product.reviews || 0} reviews)
                  </Text>
                </HStack>

                <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                  ${product.price}
                </Text>

                <Text color="gray.600" lineHeight="tall">
                  {product.description}
                </Text>
              </VStack>

              <Divider />

              {/* Stock Status */}
              <HStack justify="space-between" align="center">
                <Text color="gray.600">Stock:</Text>
                <Badge
                  colorScheme={product.stock > 10 ? 'green' : product.stock > 0 ? 'orange' : 'red'}
                  borderRadius="full"
                  px={3}
                  py={1}
                >
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </Badge>
              </HStack>

              {/* Quantity Selector */}
              <HStack spacing={4} align="center">
                <Text fontWeight="semibold">Quantity:</Text>
                <HStack spacing={2}>
                  <IconButton
                    icon={<Minus />}
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={quantity <= 1}
                  />
                  <Text fontSize="lg" fontWeight="semibold" minW="40px" textAlign="center">
                    {quantity}
                  </Text>
                  <IconButton
                    icon={<Plus />}
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    isDisabled={quantity >= product.stock}
                  />
                </HStack>
              </HStack>

              {/* Action Buttons */}
              <VStack spacing={3}>
                <Button
                  colorScheme="purple"
                  size="lg"
                  w="full"
                  leftIcon={<ShoppingCart />}
                  onClick={handleAddToCart}
                  isDisabled={product.stock === 0}
                  borderRadius="xl"
                  _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart - $${(product.price * quantity).toFixed(2)}`}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  w="full"
                  onClick={handleAddToWishlist}
                  isDisabled={isInWishlist}
                  borderRadius="xl"
                >
                  {isInWishlist ? 'Already in Wishlist' : 'Add to Wishlist'}
                </Button>
              </VStack>
            </VStack>
          </SimpleGrid>
        </MotionBox>

        {/* Reviews Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card borderRadius="xl" shadow="md">
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Heading size="lg" color="gray.800">
                  Customer Reviews ({reviews.length})
                </Heading>

                {/* Add Review Form */}
                {isAuthenticated && (
                  <Card bg="gray.50" borderRadius="lg">
                    <CardBody>
                      <form onSubmit={handleSubmitReview}>
                        <VStack spacing={4} align="stretch">
                          <HStack spacing={2}>
                            <Text fontWeight="semibold">Your Rating:</Text>
                            {renderStars(newReview.rating, true, (rating) =>
                              setNewReview({ ...newReview, rating })
                            )}
                          </HStack>

                          <FormControl>
                            <FormLabel>Your Review</FormLabel>
                            <Textarea
                              placeholder="Share your thoughts about this product..."
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              bg="white"
                              borderRadius="lg"
                              minH="100px"
                              required
                            />
                          </FormControl>

                          <Button
                            type="submit"
                            colorScheme="purple"
                            alignSelf="start"
                            isLoading={isSubmittingReview}
                            loadingText="Submitting..."
                            borderRadius="lg"
                          >
                            Submit Review
                          </Button>
                        </VStack>
                      </form>
                    </CardBody>
                  </Card>
                )}

                {/* Reviews List */}
                <VStack spacing={4} align="stretch">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <Card key={review.id} borderRadius="lg" shadow="sm">
                        <CardBody>
                          <HStack spacing={4} align="start">
                            <Avatar size="sm" name={review.customerName} />
                            <VStack align="start" spacing={2} flex={1}>
                              <HStack justify="space-between" w="full">
                                <Text fontWeight="semibold">{review.customerName}</Text>
                                <HStack spacing={1}>
                                  {renderStars(review.rating)}
                                </HStack>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </Text>
                              <Text color="gray.700">{review.comment}</Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <Text textAlign="center" color="gray.500" py={8}>
                      No reviews yet. Be the first to review this product!
                    </Text>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </VStack>
    </Layout>
  )
}

export default ProductDetails
