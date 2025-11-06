import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Clock, Search, Filter, CheckCircle, XCircle, Eye, Store, Package, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { adminService } from '../../services/adminService'
import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const AdminApprovals = () => {
  const { user, role, isLoading } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [pendingVendors, setPendingVendors] = useState([])
  const [pendingProducts, setPendingProducts] = useState([])
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
    const fetchPendingItems = async () => {
      try {
        setLoading(true)
        const [vendorsRes, productsRes] = await Promise.all([
          adminService.getPendingVendors(),
          adminService.getPendingProducts()
        ])

        // Transform vendors data
        const vendors = vendorsRes.data.map(vendor => ({
          id: vendor._id,
          name: vendor.vendorInfo?.storeName || vendor.name,
          applicant: vendor.name,
          email: vendor.email,
          date: new Date(vendor.createdAt).toLocaleDateString(),
          type: 'vendor',
          rawData: vendor
        }))

        // Transform products data
        const products = productsRes.data.map(product => ({
          id: product._id,
          name: product.name,
          vendor: product.vendor?.name || 'Unknown Vendor',
          category: product.category,
          price: product.price,
          date: new Date(product.createdAt).toLocaleDateString(),
          type: 'product',
          rawData: product
        }))

        setPendingVendors(vendors)
        setPendingProducts(products)
      } catch (err) {
        setError('Failed to load pending approvals')
        console.error('Error fetching pending items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingItems()
  }, [])

  const approvalStats = [
    {
      label: 'Pending Vendors',
      value: pendingVendors.length.toString(),
      icon: Store,
      color: 'green',
      change: '+2',
      changeType: 'increase',
    },
    {
      label: 'Pending Products',
      value: pendingProducts.length.toString(),
      icon: Package,
      color: 'purple',
      change: '+15',
      changeType: 'increase',
    },
    {
      label: 'Total Pending',
      value: (pendingVendors.length + pendingProducts.length).toString(),
      icon: Clock,
      color: 'orange',
      change: '+17',
      changeType: 'increase',
    },
  ]

  const allPending = [...pendingVendors, ...pendingProducts]

  const filteredItems = allPending.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.applicant && item.applicant.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.vendor && item.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const handleApproveVendor = async (vendorId) => {
    try {
      await adminService.approveVendor(vendorId)
      // Refresh the data
      const vendorsRes = await adminService.getPendingVendors()
      const vendors = vendorsRes.data.map(vendor => ({
        id: vendor._id,
        name: vendor.vendorInfo?.storeName || vendor.name,
        applicant: vendor.name,
        email: vendor.email,
        date: new Date(vendor.createdAt).toLocaleDateString(),
        type: 'vendor',
        rawData: vendor
      }))
      setPendingVendors(vendors)
    } catch (error) {
      console.error('Error approving vendor:', error)
    }
  }

  const handleRejectVendor = async (vendorId, reason) => {
    try {
      await adminService.rejectVendor(vendorId, reason)
      // Refresh the data
      const vendorsRes = await adminService.getPendingVendors()
      const vendors = vendorsRes.data.map(vendor => ({
        id: vendor._id,
        name: vendor.vendorInfo?.storeName || vendor.name,
        applicant: vendor.name,
        email: vendor.email,
        date: new Date(vendor.createdAt).toLocaleDateString(),
        type: 'vendor',
        rawData: vendor
      }))
      setPendingVendors(vendors)
    } catch (error) {
      console.error('Error rejecting vendor:', error)
    }
  }

  const handleApproveProduct = async (productId) => {
    try {
      await adminService.approveProduct(productId)
      // Refresh the data
      const productsRes = await adminService.getPendingProducts()
      const products = productsRes.data.map(product => ({
        id: product._id,
        name: product.name,
        vendor: product.vendor?.name || 'Unknown Vendor',
        category: product.category,
        price: product.price,
        date: new Date(product.createdAt).toLocaleDateString(),
        type: 'product',
        rawData: product
      }))
      setPendingProducts(products)
    } catch (error) {
      console.error('Error approving product:', error)
    }
  }

  const handleRejectProduct = async (productId, reason) => {
    try {
      await adminService.rejectProduct(productId, reason)
      // Refresh the data
      const productsRes = await adminService.getPendingProducts()
      const products = productsRes.data.map(product => ({
        id: product._id,
        name: product.name,
        vendor: product.vendor?.name || 'Unknown Vendor',
        category: product.category,
        price: product.price,
        date: new Date(product.createdAt).toLocaleDateString(),
        type: 'product',
        rawData: product
      }))
      setPendingProducts(products)
    } catch (error) {
      console.error('Error rejecting product:', error)
    }
  }

  if (loading) {
    return (
      <Layout role="admin">
        <Box textAlign="center" py={10}>
          <Text>Loading pending approvals...</Text>
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
    <Layout role="admin">
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, orange.500, red.500)"
          color="white"
          borderRadius="2xl"
        >
          <CardBody p={8}>
            <VStack align="start" spacing={4}>
              <Heading size="lg">
                Pending Approvals
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Review and approve vendor applications and product listings.
              </Text>
            </VStack>
          </CardBody>
        </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {approvalStats.map((stat, index) => (
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
                placeholder="Search approvals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Types</option>
              <option value="vendor">Vendors</option>
              <option value="product">Products</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Tabs for different approval types */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Tabs variant="enclosed" colorScheme="orange">
            <TabList>
              <Tab>All ({allPending.length})</Tab>
              <Tab>Vendors ({pendingVendors.length})</Tab>
              <Tab>Products ({pendingProducts.length})</Tab>
            </TabList>

            <TabPanels>
              {/* All Approvals */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {filteredItems.map((item) => (
                    <HStack
                      key={item.id}
                      justify="space-between"
                      align="center"
                      p={6}
                      bg="orange.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="orange.200"
                    >
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Badge colorScheme={item.type === 'vendor' ? 'green' : 'purple'} borderRadius="full">
                            {item.type}
                          </Badge>
                          <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                            {item.name}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          {item.type === 'vendor' ? `Applicant: ${item.applicant}` : `Vendor: ${item.vendor}`}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {item.type === 'vendor' ? item.email : `Category: ${item.category} • $${item.price}`}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Submitted: {item.date}
                        </Text>
                      </VStack>

                      <HStack spacing={3}>
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg" onClick={() => item.type === 'vendor' ? handleApproveVendor(item.id) : handleApproveProduct(item.id)}>
                          <Icon as={CheckCircle} w={4} h={4} mr={2} />
                          Approve
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg" onClick={() => item.type === 'vendor' ? handleRejectVendor(item.id, 'Not approved') : handleRejectProduct(item.id, 'Not approved')}>
                          <Icon as={XCircle} w={4} h={4} mr={2} />
                          Reject
                        </Button>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </TabPanel>

              {/* Vendor Approvals */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {pendingVendors.map((vendor) => (
                    <HStack
                      key={vendor.id}
                      justify="space-between"
                      align="center"
                      p={6}
                      bg="green.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="green.200"
                    >
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Badge colorScheme="green" borderRadius="full">
                            vendor
                          </Badge>
                          <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                            {vendor.name}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Applicant: {vendor.applicant}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {vendor.email}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Submitted: {vendor.date}
                        </Text>
                      </VStack>

                      <HStack spacing={3}>
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg" onClick={() => handleApproveVendor(vendor.id)}>
                          <Icon as={CheckCircle} w={4} h={4} mr={2} />
                          Approve
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg" onClick={() => handleRejectVendor(vendor.id, 'Not approved')}>
                          <Icon as={XCircle} w={4} h={4} mr={2} />
                          Reject
                        </Button>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </TabPanel>

              {/* Product Approvals */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {pendingProducts.map((product) => (
                    <HStack
                      key={product.id}
                      justify="space-between"
                      align="center"
                      p={6}
                      bg="purple.50"
                      borderRadius="lg"
                      border="1px solid"
                      borderColor="purple.200"
                    >
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Badge colorScheme="purple" borderRadius="full">
                            product
                          </Badge>
                          <Text fontWeight="semibold" color="gray.800" fontSize="lg">
                            {product.name}
                          </Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Vendor: {product.vendor}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          Category: {product.category} • ${product.price}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Submitted: {product.date}
                        </Text>
                      </VStack>

                      <HStack spacing={3}>
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg">
                          <Icon as={CheckCircle} w={4} h={4} mr={2} />
                          Approve
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                          <Icon as={XCircle} w={4} h={4} mr={2} />
                          Reject
                        </Button>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </MotionCard>
    </VStack>
    </Layout>
  )
}

export default AdminApprovals
