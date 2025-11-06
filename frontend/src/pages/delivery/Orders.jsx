import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Truck, Package, Clock, CheckCircle, MapPin, Search, Filter, Eye, Navigation, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const DeliveryOrders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const orders = [
    { id: '#1234', customer: 'John Doe', address: '123 Main St, City, State 12345', status: 'delivered', time: '2 hours ago', items: 3, total: '$45.99', phone: '(555) 123-4567' },
    { id: '#1235', customer: 'Jane Smith', address: '456 Oak Ave, City, State 12345', status: 'in_transit', time: '30 min ago', items: 2, total: '$32.50', phone: '(555) 234-5678' },
    { id: '#1236', customer: 'Mike Johnson', address: '789 Pine Rd, City, State 12345', status: 'pending', time: 'Scheduled for 3 PM', items: 1, total: '$18.99', phone: '(555) 345-6789' },
    { id: '#1237', customer: 'Sarah Wilson', address: '321 Elm St, City, State 12345', status: 'delivered', time: '4 hours ago', items: 4, total: '$67.25', phone: '(555) 456-7890' },
    { id: '#1238', customer: 'Tom Brown', address: '654 Maple Dr, City, State 12345', status: 'pending', time: 'Scheduled for 2 PM', items: 2, total: '$28.75', phone: '(555) 567-8901' },
  ]

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'green'
      case 'in_transit': return 'blue'
      case 'pending': return 'orange'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle
      case 'in_transit': return Truck
      case 'pending': return Clock
      default: return Package
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="green.600"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Delivery Orders
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              View and manage all delivery orders assigned to you.
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Orders List */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Orders ({filteredOrders.length})
          </Heading>
          <VStack spacing={4} align="stretch">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <Card key={order.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text fontWeight="semibold" color="gray.800">
                              {order.customer}
                            </Text>
                            <Badge colorScheme={getStatusColor(order.status)} borderRadius="full">
                              <HStack spacing={1}>
                                <Icon as={StatusIcon} w={3} h={3} />
                                <Text>{order.status.replace('_', ' ')}</Text>
                              </HStack>
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {order.id} • {order.items} items • {order.total}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text fontSize="sm" color="gray.500">
                            {order.time}
                          </Text>
                          <HStack spacing={1}>
                            <Icon as={Phone} w={4} h={4} color="gray.400" />
                            <Text fontSize="sm" color="gray.600">
                              {order.phone}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack spacing={2}>
                        <Icon as={MapPin} w={4} h={4} color="gray.400" />
                        <Text fontSize="sm" color="gray.700" flex={1}>
                          {order.address}
                        </Text>
                      </HStack>

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <Button size="sm" colorScheme="green" borderRadius="lg">
                            <Icon as={Navigation} w={4} h={4} mr={2} />
                            Start Delivery
                          </Button>
                        )}
                        {order.status === 'in_transit' && (
                          <Button size="sm" colorScheme="green" borderRadius="lg">
                            <Icon as={CheckCircle} w={4} h={4} mr={2} />
                            Mark Delivered
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default DeliveryOrders
