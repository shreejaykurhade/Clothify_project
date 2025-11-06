import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Image } from '@chakra-ui/react'
import { Package, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Clock, Eye, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/adminService'
import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const AdminProducts = () => {
  const { user, role, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Wait for authentication to load
  if (isLoading) {
    return (
      <Layout role="admin">
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      </Layout>
    )
  }

  // Check if user is authenticated and is an admin
  if (!user || role !== 'admin') {
    return (
      <Layout role="admin">
        <Box textAlign="center" py={10}>
          <Text>Access denied. Admin privileges required.</Text>
        </Box>
      </Layout>
    )
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await adminService.getAllProducts()
        setProducts(response.data)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleApproveProduct = async (productId) => {
    try {
      await adminService.approveProduct(productId)
      // Refresh the data
      const response = await adminService.getAllProducts()
      setProducts(response.data)
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleRejectProduct = async (productId, reason) => {
    try {
      await adminService.rejectProduct(productId, reason)
      // Refresh the data
      const response = await adminService.getAllProducts()
      setProducts(response.data)
    } catch (error) {
      console.error('Error rejecting product:', error)
    }
  }

  const productStats = [
    {
      label: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'purple',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Approved Products',
      value: products.filter(p => p.approvalStatus === 'approved').length.toString(),
      icon: CheckCircle,
      color: 'green',
      change: '+10%',
      changeType: 'increase',
    },
    {
      label: 'Pending Approvals',
      value: products.filter(p => p.approvalStatus === 'pending').length.toString(),
      icon: Clock,
      color: 'orange',
      change: '+15',
      changeType: 'increase',
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.vendor && product.vendor.name && product.vendor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.approvalStatus === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green'
      case 'pending': return 'orange'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'pending': return Clock
      case 'rejected': return XCircle
      default: return Clock
    }
  }

  if (loading) {
    return (
      <Layout role="admin">
        <Box textAlign="center" py={10}>
          <Text>Loading products...</Text>
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout role="admin">
        <Box textAlign="center" py={10}>
          <Text color="red.500">{error}</Text>
        </Box>
      </Layout>
    )
  }

  return (
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, purple.500, pink.500)"
          color="white"
          borderRadius="2xl"
        >
          <CardBody p={8}>
            <VStack align="start" spacing={4}>
              <Heading size="lg">
                Product Management
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Review and manage product listings across the platform.
              </Text>
            </VStack>
          </CardBody>
        </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {productStats.map((stat, index) => (
          <MotionCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            borderRadius="xl"
            shadow="md"
            _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.600" fontSize="sm">
                  {stat.label}
                </StatLabel>
                <StatNumber fontSize="2xl" color={`${stat.color}.600`} fontWeight="bold">
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={stat.changeType} />
                  {stat.change} from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>

      {/* Filters and Search */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="300px">
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
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Products Table */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Products ({filteredProducts.length})
          </Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Product</Th>
                  <Th>Vendor</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Status</Th>
                  <Th>Date Added</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product) => {
                  const StatusIcon = getStatusIcon(product.approvalStatus)
                  return (
                    <Tr key={product._id}>
                      <Td>
                        <HStack>
                          <Image
                            src={product.images && product.images.length > 0 ? product.images[0].url : '/api/placeholder/50/50'}
                            alt={product.name}
                            boxSize="50px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold">{product.name}</Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>{product.vendor ? product.vendor.name : 'N/A'}</Td>
                      <Td>
                        <Badge colorScheme="blue" borderRadius="full">
                          {product.category}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack>
                          <Icon as={DollarSign} w={4} h={4} color="green.500" />
                          <Text fontWeight="semibold">{product.price}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(product.approvalStatus)} borderRadius="full">
                          <HStack spacing={1}>
                            <Icon as={StatusIcon} w={3} h={3} />
                            <Text>{product.approvalStatus}</Text>
                          </HStack>
                        </Badge>
                      </Td>
                      <Td>{new Date(product.createdAt).toLocaleDateString()}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                            <Icon as={Eye} w={4} h={4} />
                          </Button>
                          {product.approvalStatus === 'pending' && (
                            <>
                              <Button size="sm" colorScheme="green" borderRadius="lg" onClick={() => handleApproveProduct(product._id)}>
                                Approve
                              </Button>
                              <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg" onClick={() => handleRejectProduct(product._id, 'Rejected by admin')}>
                                Reject
                              </Button>
                            </>
                          )}
                          {product.approvalStatus === 'approved' && (
                            <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                              <Icon as={Trash2} w={4} h={4} />
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default AdminProducts
