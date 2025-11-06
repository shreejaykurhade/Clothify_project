import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Package, Search, Filter, Edit, Eye, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const InventoryProducts = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')

  const products = [
    { id: 'P001', name: 'Wireless Headphones', category: 'Electronics', stock: 45, minStock: 10, maxStock: 100, price: '$89.99', status: 'in_stock', supplier: 'TechCorp', lastUpdated: '2 hours ago' },
    { id: 'P002', name: 'Gaming Mouse', category: 'Electronics', stock: 8, minStock: 15, maxStock: 80, price: '$49.99', status: 'low_stock', supplier: 'GameTech', lastUpdated: '4 hours ago' },
    { id: 'P003', name: 'USB Cable', category: 'Accessories', stock: 120, minStock: 20, maxStock: 200, price: '$12.99', status: 'in_stock', supplier: 'CableMaster', lastUpdated: '1 day ago' },
    { id: 'P004', name: 'Phone Case', category: 'Accessories', stock: 2, minStock: 12, maxStock: 150, price: '$24.99', status: 'critical', supplier: 'CasePro', lastUpdated: '6 hours ago' },
    { id: 'P005', name: 'Laptop Stand', category: 'Office', stock: 0, minStock: 8, maxStock: 50, price: '$34.99', status: 'out_of_stock', supplier: 'OfficePlus', lastUpdated: '3 days ago' },
    { id: 'P006', name: 'Desk Organizer', category: 'Office', stock: 67, minStock: 10, maxStock: 120, price: '$29.99', status: 'in_stock', supplier: 'HomeGoods', lastUpdated: '5 hours ago' },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && product.status === 'low_stock') ||
                        (stockFilter === 'critical' && product.status === 'critical') ||
                        (stockFilter === 'out' && product.status === 'out_of_stock') ||
                        (stockFilter === 'good' && product.status === 'in_stock')
    return matchesSearch && matchesCategory && matchesStock
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'green'
      case 'low_stock': return 'orange'
      case 'critical': return 'red'
      case 'out_of_stock': return 'gray'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in_stock': return CheckCircle
      case 'low_stock': return AlertTriangle
      case 'critical': return AlertTriangle
      case 'out_of_stock': return TrendingDown
      default: return Package
    }
  }

  const getStockPercentage = (current, min, max) => {
    if (current === 0) return 0
    return Math.min((current / max) * 100, 100)
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="blue.600"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Product Inventory
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Manage product stock levels, track inventory, and monitor supplier information.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Filters and Search */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
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
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Office">Office</option>
            </Select>
            <Select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Stock Levels</option>
              <option value="good">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="critical">Critical</option>
              <option value="out">Out of Stock</option>
            </Select>
            <Button leftIcon={<Plus />} colorScheme="blue" borderRadius="lg">
              Add Product
            </Button>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Products Table */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
                  <Th>Category</Th>
                  <Th>Stock Level</Th>
                  <Th>Price</Th>
                  <Th>Supplier</Th>
                  <Th>Last Updated</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((product) => {
                  const StatusIcon = getStatusIcon(product.status)
                  return (
                    <Tr key={product.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold" color="gray.800">
                            {product.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {product.id}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" borderRadius="full">
                          {product.category}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={2}>
                            <Icon as={StatusIcon} color={`${getStatusColor(product.status)}.500`} w={4} h={4} />
                            <Text fontWeight="semibold" color={`${getStatusColor(product.status)}.600`}>
                              {product.stock}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              / {product.maxStock}
                            </Text>
                          </HStack>
                          <Progress
                            value={getStockPercentage(product.stock, product.minStock, product.maxStock)}
                            colorScheme={getStatusColor(product.status)}
                            size="sm"
                            borderRadius="full"
                            w="100px"
                          />
                          <Text fontSize="xs" color="gray.500">
                            Min: {product.minStock}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontWeight="semibold" color="green.600">
                          {product.price}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.700">
                          {product.supplier}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.500">
                          {product.lastUpdated}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                            <Icon as={Eye} w={4} h={4} />
                          </Button>
                          <Button size="sm" colorScheme="green" variant="outline" borderRadius="lg">
                            <Icon as={Edit} w={4} h={4} />
                          </Button>
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

export default InventoryProducts
