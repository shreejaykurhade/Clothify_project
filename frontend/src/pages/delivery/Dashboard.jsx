import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Truck, Package, Clock, CheckCircle, MapPin, TrendingUp, Calendar, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const DeliveryDashboard = () => {
  const [timeRange, setTimeRange] = useState('today')

  const deliveryStats = [
    {
      label: 'Orders Delivered Today',
      value: '24',
      icon: Truck,
      color: 'green',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Pending Deliveries',
      value: '8',
      icon: Package,
      color: 'orange',
      change: '-5%',
      changeType: 'decrease',
    },
    {
      label: 'Average Delivery Time',
      value: '32 min',
      icon: Clock,
      color: 'blue',
      change: '+8%',
      changeType: 'increase',
    },
    {
      label: 'Customer Satisfaction',
      value: '4.8/5',
      icon: CheckCircle,
      color: 'purple',
      change: '+2%',
      changeType: 'increase',
    },
  ]

  const recentDeliveries = [
    { id: '#1234', customer: 'John Doe', address: '123 Main St, City', status: 'delivered', time: '2 hours ago', rating: 5 },
    { id: '#1235', customer: 'Jane Smith', address: '456 Oak Ave, City', status: 'in_transit', time: '30 min ago', rating: null },
    { id: '#1236', customer: 'Mike Johnson', address: '789 Pine Rd, City', status: 'pending', time: 'Scheduled for 3 PM', rating: null },
    { id: '#1237', customer: 'Sarah Wilson', address: '321 Elm St, City', status: 'delivered', time: '4 hours ago', rating: 4 },
  ]

  const upcomingDeliveries = [
    { id: '#1238', customer: 'Tom Brown', address: '654 Maple Dr, City', time: '2:00 PM', priority: 'normal' },
    { id: '#1239', customer: 'Lisa Davis', address: '987 Cedar Ln, City', time: '3:30 PM', priority: 'high' },
    { id: '#1240', customer: 'Chris Evans', address: '147 Birch St, City', time: '4:15 PM', priority: 'normal' },
  ]

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'normal': return 'green'
      default: return 'gray'
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
              Delivery Dashboard
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Manage your deliveries and track performance metrics.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {deliveryStats.map((stat, index) => (
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
                  {stat.change} from yesterday
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>

      {/* Recent Deliveries and Upcoming */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Recent Deliveries */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Recent Deliveries
            </Heading>
            <VStack spacing={4} align="stretch">
              {recentDeliveries.map((delivery) => {
                const StatusIcon = getStatusIcon(delivery.status)
                return (
                  <Card key={delivery.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="semibold" color="gray.800">
                                {delivery.customer}
                              </Text>
                              <Badge colorScheme={getStatusColor(delivery.status)} borderRadius="full">
                                <HStack spacing={1}>
                                  <Icon as={StatusIcon} w={3} h={3} />
                                  <Text>{delivery.status.replace('_', ' ')}</Text>
                                </HStack>
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Order {delivery.id}
                            </Text>
                          </VStack>
                          <Text fontSize="sm" color="gray.500">
                            {delivery.time}
                          </Text>
                        </HStack>

                        <HStack spacing={2}>
                          <Icon as={MapPin} w={4} h={4} color="gray.400" />
                          <Text fontSize="sm" color="gray.700" flex={1}>
                            {delivery.address}
                          </Text>
                        </HStack>

                        {delivery.rating && (
                          <HStack spacing={1}>
                            <Text fontSize="sm" color="gray.600">Rating:</Text>
                            {Array(5).fill('').map((_, i) => (
                              <Box
                                key={i}
                                as="span"
                                color={i < delivery.rating ? 'yellow.400' : 'gray.300'}
                                fontSize="sm"
                              >
                                ★
                              </Box>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                )
              })}
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Upcoming Deliveries */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Upcoming Deliveries
            </Heading>
            <VStack spacing={4} align="stretch">
              {upcomingDeliveries.map((delivery) => (
                <Card key={delivery.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="orange.200">
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text fontWeight="semibold" color="gray.800">
                              {delivery.customer}
                            </Text>
                            <Badge colorScheme={getPriorityColor(delivery.priority)} borderRadius="full">
                              {delivery.priority} priority
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            Order {delivery.id}
                          </Text>
                        </VStack>
                        <Text fontSize="sm" color="gray.500">
                          {delivery.time}
                        </Text>
                      </HStack>

                      <HStack spacing={2}>
                        <Icon as={MapPin} w={4} h={4} color="gray.400" />
                        <Text fontSize="sm" color="gray.700" flex={1}>
                          {delivery.address}
                        </Text>
                      </HStack>

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg">
                          Start Delivery
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </SimpleGrid>
    </VStack>
  )
}

export default DeliveryDashboard
