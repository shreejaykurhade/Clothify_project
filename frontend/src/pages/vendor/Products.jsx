import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Input, Select, Badge, Image, SimpleGrid, InputGroup, InputLeftElement, useToast, Menu, MenuButton, MenuList, MenuItem, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure, FormControl } from '@chakra-ui/react'
import { Package, Search, Filter, Plus, Edit, Trash2, Eye, MoreVertical, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const Products = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Mock data - replace with actual API call
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 89.99,
      category: 'Electronics',
      stock: 25,
      status: 'active',
      image: '/api/placeholder/200/200',
      rating: 4.5,
      reviews: 23,
      sales: 156
    },
    {
      id: 2,
      name: 'Cotton T-Shirt',
      description: 'Comfortable 100% cotton t-shirt in various colors',
      price: 19.99,
      category: 'Clothing',
      stock: 50,
      status: 'active',
      image: '/api/placeholder/200/200',
      rating: 4.2,
      reviews: 45,
      sales: 89
    },
    {
      id: 3,
      name: 'Smart Watch',
      description: 'Fitness tracking smart watch with heart rate monitor',
      price: 199.99,
      category: 'Electronics',
      stock: 0,
      status: 'out_of_stock',
      image: '/api/placeholder/200/200',
      rating: 4.8,
      reviews: 67,
      sales: 234
    },
    {
      id: 4,
      name: 'Running Shoes',
      description: 'Lightweight running shoes for all terrains',
      price: 79.99,
      category: 'Shoes',
      stock: 15,
      status: 'active',
      image: '/api/placeholder/200/200',
      rating: 4.3,
      reviews: 34,
      sales: 78
    },
    {
      id: 5,
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with multiple card slots',
      price: 34.99,
      category: 'Accessories',
      stock: 8,
      status: 'low_stock',
      image: '/api/placeholder/200/200',
      rating: 4.0,
      reviews: 12,
      sales: 45
    },
    {
      id: 6,
      name: 'Coffee Mug Set',
      description: 'Set of 4 ceramic coffee mugs',
      price: 24.99,
      category: 'Home & Garden',
      stock: 30,
      status: 'active',
      image: '/api/placeholder/200/200',
      rating: 4.1,
      reviews: 18,
      sales: 92
    }
  ]

  const categories = ['All', 'Clothing', 'Shoes', 'Accessories', 'Electronics', 'Home & Garden', 'Sports & Outdoors', 'Books', 'Other']
  const statuses = ['All', 'active', 'out_of_stock', 'low_stock', 'pending_approval', 'approved', 'rejected']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '' || selectedCategory === 'All' || product.category === selectedCategory
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green'
      case 'out_of_stock': return 'red'
      case 'low_stock': return 'orange'
      case 'pending_approval': return 'blue'
      case 'approved': return 'green'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active'
      case 'out_of_stock': return 'Out of Stock'
      case 'low_stock': return 'Low Stock'
      case 'pending_approval': return 'Pending Approval'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      default: return status
    }
  }

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product)
    onOpen()
  }

  const confirmDelete = () => {
    // Here you would make an API call to delete the product
    toast({
      title: 'Product Deleted',
      description: `${selectedProduct.name} has been deleted successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    onClose()
    setSelectedProduct(null)
  }

  const handleEditProduct = (productId) => {
    navigate(`/vendor/products/edit/${productId}`)
  }

  const handleViewProduct = (productId) => {
    navigate(`/customer/product/${productId}`)
  }

  return (
    <Layout role="vendor">
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
                Manage Products
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                View, edit, and manage all your products from this dashboard.
              </Text>
              <Button
                leftIcon={<Plus />}
                colorScheme="whiteAlpha"
                variant="outline"
                size="lg"
                onClick={() => navigate('/vendor/products/add')}
                _hover={{ bg: 'white', color: 'green.500' }}
                borderRadius="xl"
              >
                Add New Product
              </Button>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Filters and Search */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <FormControl>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={Search} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="lg"
                  />
                </InputGroup>
              </FormControl>

              <Select
                placeholder="All Categories"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                borderRadius="lg"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>

              <Select
                placeholder="All Statuses"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                borderRadius="lg"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{getStatusText(status)}</option>
                ))}
              </Select>

              <Button
                leftIcon={<Filter />}
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedStatus('')
                }}
                borderRadius="lg"
              >
                Clear Filters
              </Button>
            </SimpleGrid>
          </CardBody>
        </MotionCard>

        {/* Products Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredProducts.map((product, index) => (
            <MotionCard
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              borderRadius="xl"
              shadow="md"
              _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
            >
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {/* Product Image */}
                  <Box position="relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      borderRadius="lg"
                      w="full"
                      h="200px"
                      objectFit="cover"
                    />
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      colorScheme={getStatusColor(product.status)}
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {getStatusText(product.status)}
                    </Badge>
                  </Box>

                  {/* Product Info */}
                  <VStack align="start" spacing={2}>
                    <Heading size="md" color="gray.800" noOfLines={2}>
                      {product.name}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" noOfLines={2}>
                      {product.description}
                    </Text>

                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold" color="green.600">
                        ${product.price}
                      </Text>
                      <HStack spacing={1}>
                        <Icon as={Star} w={4} h={4} color="yellow.400" fill="yellow.400" />
                        <Text fontSize="sm" color="gray.600">
                          {product.rating} ({product.reviews})
                        </Text>
                      </HStack>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm" color="gray.600">
                        Stock: {product.stock}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Sales: {product.sales}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Actions */}
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<Eye />}
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => handleViewProduct(product.id)}
                      flex={1}
                      borderRadius="lg"
                    >
                      View
                    </Button>

                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        variant="outline"
                        rightIcon={<MoreVertical />}
                        borderRadius="lg"
                      >
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem icon={<Edit />} onClick={() => handleEditProduct(product.id)}>
                          Edit Product
                        </MenuItem>
                        <MenuItem icon={<Trash2 />} onClick={() => handleDeleteProduct(product)}>
                          Delete Product
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {filteredProducts.length === 0 && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody textAlign="center" py={12}>
              <Icon as={Package} w={12} h={12} color="gray.400" mb={4} />
              <Heading size="md" color="gray.600" mb={2}>
                No products found
              </Heading>
              <Text color="gray.500" mb={4}>
                {searchTerm || selectedCategory || selectedStatus ? 'Try adjusting your filters.' : 'Start by adding your first product.'}
              </Text>
              <Button
                leftIcon={<Plus />}
                colorScheme="green"
                onClick={() => navigate('/vendor/products/add')}
                borderRadius="lg"
              >
                Add Product
              </Button>
            </CardBody>
          </MotionCard>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent borderRadius="xl">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Product
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} borderRadius="lg">
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3} borderRadius="lg">
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Layout>
  )
}

export default Products
