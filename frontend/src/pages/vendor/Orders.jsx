import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Badge, Select, Input, InputGroup, InputLeftElement, SimpleGrid, Avatar, AvatarGroup, useToast, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { ShoppingCart, Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, MoreVertical, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
//import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const Orders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('')

  // Mock data - replace with actual API call
  const orders = [
    {
      id: '#ORD-2024-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Wireless Bluetooth Headphones', quantity: 1, price: 89.99 },
        { name: 'Phone Case', quantity: 2, price: 19.99 }
      ],
      total: 129.97,
      status: 'processing',
      date: '2024-01-15',
      shippingAddress: '123 Main St, City, State 12345'
    },
    {
      id: '#ORD-2024-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Smart Watch', quantity: 1, price: 199.99 }
      ],
      total: 199.99,
      status: 'shipped',
      date: '2024-01-14',
      shippingAddress: '456 Oak Ave, City, State 12345'
    },
    {
      id: '#ORD-2024-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Running Shoes', quantity: 1, price: 79.99 },
        { name: 'Sports Socks', quantity: 3, price: 9.99 }
      ],
      total: 109.96,
      status: 'delivered',
      date: '2024-01-13',
      shippingAddress: '789 Pine Rd, City, State 12345'
    },
    {
      id: '#ORD-2024-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Cotton T-Shirt', quantity: 2, price: 19.99 }
      ],
      total: 39.98,
      status: 'cancelled',
      date: '2024-01-12',
      shippingAddress: '321 Elm St, City, State 12345'
    },
    {
      id: '#ORD-2024-005',
      customer: {
        name: 'David Brown',
        email: 'david@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Leather Wallet', quantity: 1, price: 34.99 },
        { name: 'Belt', quantity: 1, price: 29.99 }
      ],
      total: 64.98,
      status: 'processing',
      date: '2024-01-11',
      shippingAddress: '654 Maple Dr, City, State 12345'
    },
    {
      id: '#ORD-2024-006',
      customer: {
        name: 'Lisa Davis',
        email: 'lisa@example.com',
        avatar: '/api/placeholder/40/40'
      },
      products: [
        { name: 'Coffee Mug Set', quantity: 1, price: 24.99 }
      ],
      total: 24.99,
      status: 'shipped',
      date: '2024-01-10',
      shippingAddress: '987 Cedar Ln, City, State 12345'
    }
  ]

  const statuses = ['All', 'processing', 'shipped', 'delivered', 'cancelled']
  const dateRanges = ['All', 'Today', 'Last 7 days', 'Last 30 days', 'Last 3 months']

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || order.status === selectedStatus
    // For simplicity, not implementing date range filtering in this mock
    const matchesDateRange = selectedDateRange === '' || selectedDateRange === 'All'

    return matchesSearch && matchesStatus && matchesDateRange
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'blue'
      case 'shipped': return 'orange'
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return Clock
      case 'shipped': return Truck
      case 'delivered': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Processing'
      case 'shipped': return 'Shipped'
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const handleStatusChange = (orderId, newStatus) => {
    // Here you would make an API call to update the order status
    toast({
      title: 'Status Updated',
      description: `Order ${orderId} status changed to ${getStatusText(newStatus)}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleViewOrder = (orderId) => {
    navigate(`/vendor/orders/${orderId}`)
  }

  const totalRevenue = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0)

  const orderStats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
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
                Manage Orders
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Track and manage all your customer orders from this dashboard.
              </Text>
              <HStack spacing={4}>
                <Text fontSize="sm" opacity={0.8}>
                  Total Revenue: ${totalRevenue.toFixed(2)}
                </Text>
                <Text fontSize="sm" opacity={0.8}>
                  Total Orders: {orderStats.total}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
          {[
            { label: 'Total Orders', value: orderStats.total, color: 'blue' },
            { label: 'Processing', value: orderStats.processing, color: 'blue' },
            { label: 'Shipped', value: orderStats.shipped, color: 'orange' },
            { label: 'Delivered', value: orderStats.delivered, color: 'green' },
            { label: 'Cancelled', value: orderStats.cancelled, color: 'red' }
          ].map((stat, index) => (
            <MotionCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              borderRadius="xl"
              shadow="md"
            >
              <CardBody textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color={`${stat.color}.600`}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {stat.label}
                </Text>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Filters */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                />
              </InputGroup>

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

              <Select
                placeholder="All Time"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                borderRadius="lg"
              >
                {dateRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </Select>

              <Button
                leftIcon={<Filter />}
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedStatus('')
                  setSelectedDateRange('')
                }}
                borderRadius="lg"
              >
                Clear Filters
              </Button>
            </SimpleGrid>
          </CardBody>
        </MotionCard>

        {/* Orders List */}
        <VStack spacing={4} align="stretch">
          {filteredOrders.map((order, index) => {
            const StatusIcon = getStatusIcon(order.status)
            return (
              <MotionCard
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                borderRadius="xl"
                shadow="md"
                _hover={{ shadow: 'lg' }}
              >
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Order Header */}
                    <HStack justify="space-between" align="start">
                      <HStack spacing={3}>
                        <Avatar size="sm" src={order.customer.avatar} name={order.customer.name} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" color="gray.800">
                            {order.customer.name}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {order.customer.email}
                          </Text>
                        </VStack>
                      </HStack>

                      <VStack align="end" spacing={1}>
                        <Text fontWeight="semibold" color="gray.800">
                          {order.id}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {order.date}
                        </Text>
                      </VStack>
                    </HStack>

                    {/* Order Items */}
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                        Items:
                      </Text>
                      <VStack spacing={1} align="stretch">
                        {order.products.map((product, idx) => (
                          <HStack key={idx} justify="space-between">
                            <Text fontSize="sm" color="gray.600">
                              {product.quantity}x {product.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              ${product.price * product.quantity}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>

                    {/* Order Footer */}
                    <HStack justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600">
                          Total: <Text as="span" fontWeight="semibold" color="green.600">${order.total}</Text>
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {order.shippingAddress}
                        </Text>
                      </VStack>

                      <HStack spacing={2}>
                        <Badge
                          colorScheme={getStatusColor(order.status)}
                          borderRadius="full"
                          px={3}
                          py={1}
                          display="flex"
                          alignItems="center"
                          gap={1}
                        >
                          <Icon as={StatusIcon} w={3} h={3} />
                          {getStatusText(order.status)}
                        </Badge>

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
                            <MenuItem icon={<Eye />} onClick={() => handleViewOrder(order.id)}>
                              View Details
                            </MenuItem>
                            {order.status === 'processing' && (
                              <MenuItem icon={<Truck />} onClick={() => handleStatusChange(order.id, 'shipped')}>
                                Mark as Shipped
                              </MenuItem>
                            )}
                            {order.status === 'shipped' && (
                              <MenuItem icon={<CheckCircle />} onClick={() => handleStatusChange(order.id, 'delivered')}>
                                Mark as Delivered
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            )
          })}
        </VStack>

        {filteredOrders.length === 0 && (
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody textAlign="center" py={12}>
              <Icon as={ShoppingCart} w={12} h={12} color="gray.400" mb={4} />
              <Heading size="md" color="gray.600" mb={2}>
                No orders found
              </Heading>
              <Text color="gray.500">
                {searchTerm || selectedStatus || selectedDateRange ? 'Try adjusting your filters.' : 'No orders have been placed yet.'}
              </Text>
            </CardBody>
          </MotionCard>
        )}
      </VStack>
  )
}

export default Orders
