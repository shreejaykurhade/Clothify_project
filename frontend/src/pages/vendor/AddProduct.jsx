import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Input, Textarea, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormControl, FormLabel, FormErrorMessage, Image, useToast, Progress, SimpleGrid } from '@chakra-ui/react'
import { Package, Upload, X, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { vendorService } from '../../services/vendorService'
import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const AddProduct = () => {
  const { user, role, isLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  // Wait for authentication to load
  if (isLoading) {
    return (
      <Layout role="vendor">
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      </Layout>
    )
  }

  // Check if user is authenticated and is a vendor
  if (!user || role !== 'vendor') {
    navigate('/auth/login')
    return null
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: []
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const categories = [
    'Clothing',
    'Shoes',
    'Accessories',
    'Electronics',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Other'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }))

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }))
  }

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      // Create FormData for multipart upload
      const formDataToSend = new FormData()

      // Add text fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', formData.stock)

      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append('images', image.file)
      })

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Make API call to create product
      await vendorService.createProduct(formDataToSend)

      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: 'Product Submitted Successfully!',
        description: 'Your product has been submitted and is pending approval from admin.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: []
      })

      // Navigate back to products page
      setTimeout(() => {
        navigate('/vendor/products')
      }, 1500)

    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add product. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, green.500, teal.500)"
          color="white"
          borderRadius="2xl"
        >
          <CardBody p={8}>
            <VStack align="start" spacing={4}>
              <Heading size="lg">
                Add New Product
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Fill in the details below to add a new product to your store.
              </Text>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Form */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                {/* Basic Information */}
                <Box>
                  <Heading size="md" mb={4} color="gray.800">
                    Basic Information
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={errors.name}>
                      <FormLabel>Product Name *</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter product name"
                        borderRadius="lg"
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.category}>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        placeholder="Select category"
                        borderRadius="lg"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                      <FormErrorMessage>{errors.category}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Description */}
                <FormControl isInvalid={errors.description}>
                  <FormLabel>Description *</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product in detail"
                    rows={4}
                    borderRadius="lg"
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                {/* Pricing and Stock */}
                <Box>
                  <Heading size="md" mb={4} color="gray.800">
                    Pricing & Inventory
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isInvalid={errors.price}>
                      <FormLabel>Price ($) *</FormLabel>
                      <NumberInput
                        value={formData.price}
                        onChange={(value) => handleInputChange('price', value)}
                        min={0}
                        precision={2}
                      >
                        <NumberInputField borderRadius="lg" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.price}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={errors.stock}>
                      <FormLabel>Stock Quantity *</FormLabel>
                      <NumberInput
                        value={formData.stock}
                        onChange={(value) => handleInputChange('stock', value)}
                        min={0}
                      >
                        <NumberInputField borderRadius="lg" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.stock}</FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                {/* Image Upload */}
                <Box>
                  <Heading size="md" mb={4} color="gray.800">
                    Product Images
                  </Heading>

                  <FormControl isInvalid={errors.images}>
                    <VStack spacing={4} align="stretch">
                      <Box
                        border="2px dashed"
                        borderColor="gray.300"
                        borderRadius="lg"
                        p={8}
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ borderColor: "green.400", bg: "green.50" }}
                        transition="all 0.2s"
                        onClick={() => document.getElementById('image-upload').click()}
                      >
                        <Icon as={Upload} w={8} h={8} color="gray.400" mb={2} />
                        <Text color="gray.600">
                          Click to upload images or drag and drop
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          PNG, JPG up to 10MB each
                        </Text>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                      </Box>

                      {formData.images.length > 0 && (
                        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                          {formData.images.map((image) => (
                            <Box key={image.id} position="relative">
                              <Image
                                src={image.preview}
                                alt="Product preview"
                                borderRadius="lg"
                                w="full"
                                h="120px"
                                objectFit="cover"
                              />
                              <Button
                                size="sm"
                                position="absolute"
                                top={2}
                                right={2}
                                colorScheme="red"
                                borderRadius="full"
                                onClick={() => removeImage(image.id)}
                              >
                                <Icon as={X} w={3} h={3} />
                              </Button>
                            </Box>
                          ))}
                        </SimpleGrid>
                      )}

                      <FormErrorMessage>{errors.images}</FormErrorMessage>
                    </VStack>
                  </FormControl>
                </Box>

                {/* Upload Progress */}
                {isSubmitting && (
                  <Box>
                    <Text mb={2}>Uploading product...</Text>
                    <Progress value={uploadProgress} colorScheme="green" borderRadius="lg" />
                  </Box>
                )}

                {/* Submit Button */}
                <HStack spacing={4} justify="end">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/vendor/products')}
                    borderRadius="lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={isSubmitting}
                    loadingText="Adding Product..."
                    borderRadius="lg"
                  >
                    Add Product
                  </Button>
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </MotionCard>
      </VStack>
  )
}

export default AddProduct
