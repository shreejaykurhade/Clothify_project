import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Package, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Warehouse, BarChart3, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const InventoryDashboard = () => {
  const [timeRange, setTimeRange] = useState('today')

  const inventoryStats = [
    {
      label: 'Total Products',
      value: '2,847',
      icon: Package,
      color: 'blue',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Low Stock Items',
      value: '23',
      icon: AlertTriangle,
      color: 'orange',
      change: '-8%',
      changeType: 'decrease',
    },
    {
      label: 'Out of Stock',
      value: '5',
      icon: TrendingDown,
      color: 'red',
      change: '+2%',
      changeType: 'increase',
    },
    {
      label: 'Stock Value',
      value: '$127,450',
      icon: Warehouse,
      color: 'green',
      change: '+15%',
      changeType: 'increase',
    },
  ]

  const lowStockAlerts = [
    { product: 'Wireless Headphones', currentStock: 3, minStock: 10, supplier: 'TechCorp', urgency: 'high' },
    { product: 'Gaming Mouse', currentStock: 5, minStock: 15, supplier: 'GameTech', urgency: 'medium' },
    { product: 'USB Cable', currentStock: 8, minStock: 20, supplier: 'CableMaster', urgency: 'low' },
    { product: 'Phone Case', currentStock: 2, minStock: 12, supplier: 'CasePro', urgency: 'high' },
  ]

  const recentMovements = [
    { product: 'Laptop Stand', action: 'Stock In', quantity: 50, time: '2 hours ago', type: 'inbound' },
    { product: 'Keyboard', action: 'Stock Out', quantity: 8, time: '4 hours ago', type: 'outbound' },
    { product: 'Monitor', action: 'Stock In', quantity: 25, time: '6 hours ago', type: 'inbound' },
    { product: 'Mouse Pad', action: 'Stock Out', quantity: 15, time: '8 hours ago', type: 'outbound' },
  ]

  const topSellingProducts = [
    { name: 'Wireless Earbuds', sold: 145, stock: 67, category: 'Electronics' },
    { name: 'Laptop Sleeve', sold: 98, stock: 23, category: 'Accessories' },
    { name: 'Phone Charger', sold: 87, stock: 156, category: 'Electronics' },
    { name: 'Desk Organizer', sold: 76, stock: 45, category: 'Office' },
  ]

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'yellow'
      default: return 'gray'
    }
  }

  const getMovementColor = (type) => {
    switch (type) {
      case 'inbound': return 'green'
      case 'outbound': return 'blue'
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
        bg="blue.600"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Inventory Dashboard
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Monitor stock levels, track movements, and manage inventory efficiently.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {inventoryStats.map((stat, index) => (
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
                  {stat.change} from last week
                </StatHelpText>
              </Stat>
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>

      {/* Low Stock Alerts and Recent Movements */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Low Stock Alerts */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Low Stock Alerts
            </Heading>
            <VStack spacing={4} align="stretch">
              {lowStockAlerts.map((alert, index) => (
                <Card key={index} borderRadius="lg" shadow="sm" border="1px solid" borderColor={`${getUrgencyColor(alert.urgency)}.200`}>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1}>
                          <HStack spacing={2}>
                            <Text fontWeight="semibold" color="gray.800">
                              {alert.product}
                            </Text>
                            <Badge colorScheme={getUrgencyColor(alert.urgency)} borderRadius="full">
                              {alert.urgency} priority
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            Supplier: {alert.supplier}
                          </Text>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          <Text fontSize="sm" color="red.600" fontWeight="semibold">
                            {alert.currentStock} / {alert.minStock}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Current / Min
                          </Text>
                        </VStack>
                      </HStack>

                      <Progress
                        value={(alert.currentStock / alert.minStock) * 100}
                        colorScheme={alert.currentStock < alert.minStock * 0.5 ? 'red' : 'orange'}
                        size="sm"
                        borderRadius="full"
                      />

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg">
                          Restock
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Recent Movements */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Recent Stock Movements
            </Heading>
            <VStack spacing={4} align="stretch">
              {recentMovements.map((movement, index) => (
                <HStack
                  key={index}
                  spacing={4}
                  p={4}
                  bg={`${getMovementColor(movement.type)}.50`}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={`${getMovementColor(movement.type)}.200`}
                >
                  <Box
                    p={2}
                    borderRadius="full"
                    bg={`${getMovementColor(movement.type)}.500`}
                    color="white"
                  >
                    <Icon as={movement.type === 'inbound' ? TrendingUp : TrendingDown} w={4} h={4} />
                  </Box>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontWeight="semibold" color="gray.800">
                      {movement.product}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {movement.action} • {movement.quantity} units
                    </Text>
                  </VStack>
                  <Text fontSize="xs" color="gray.500">
                    {movement.time}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </SimpleGrid>

      {/* Top Selling Products */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Top Selling Products
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {topSellingProducts.map((product, index) => (
              <Card key={index} borderRadius="lg" shadow="sm">
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                        {product.name}
                      </Text>
                      <Badge colorScheme="blue" fontSize="xs">
                        {product.category}
                      </Badge>
                    </VStack>

                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontSize="xs" color="gray.600">Sold</Text>
                        <Text fontSize="lg" color="green.600" fontWeight="bold">
                          {product.sold}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={0}>
                        <Text fontSize="xs" color="gray.600">Stock</Text>
                        <Text fontSize="lg" color="blue.600" fontWeight="bold">
                          {product.stock}
                        </Text>
                      </VStack>
                    </HStack>

                    <Progress
                      value={(product.stock / (product.stock + product.sold)) * 100}
                      colorScheme="blue"
                      size="sm"
                      borderRadius="full"
                    />
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default InventoryDashboard
