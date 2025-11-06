import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider } from '@chakra-ui/react'
import { Store, Package, TrendingUp, DollarSign, Users, ShoppingCart, BarChart3, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
//import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const VendorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    {
      label: 'Total Products',
      value: '24',
      icon: Package,
      color: 'blue',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Total Sales',
      value: '$12,450',
      icon: DollarSign,
      color: 'green',
      change: '+18%',
      changeType: 'increase',
    },
    {
      label: 'Orders',
      value: '156',
      icon: ShoppingCart,
      color: 'purple',
      change: '+8%',
      changeType: 'increase',
    },
    {
      label: 'Customers',
      value: '89',
      icon: Users,
      color: 'orange',
      change: '+15%',
      changeType: 'increase',
    },
  ]

  const quickActions = [
    {
      title: 'Add Product',
      description: 'Add a new product to your store',
      icon: Package,
      color: 'blue',
      action: () => navigate('/vendor/products/add'),
    },
    {
      title: 'Manage Products',
      description: 'View and edit your products',
      icon: Store,
      color: 'green',
      action: () => navigate('/vendor/products'),
    },
    {
      title: 'View Orders',
      description: 'Check your recent orders',
      icon: ShoppingCart,
      color: 'purple',
      action: () => navigate('/vendor/orders'),
    },
    {
      title: 'Analytics',
      description: 'View sales analytics',
      icon: BarChart3,
      color: 'orange',
      action: () => navigate('/vendor/analytics'),
    },
  ]

  const recentOrders = [
    { id: '#1234', customer: 'John Doe', product: 'Wireless Headphones', amount: '$89.99', status: 'Shipped' },
    { id: '#1233', customer: 'Jane Smith', product: 'Smart Watch', amount: '$199.99', status: 'Processing' },
    { id: '#1232', customer: 'Mike Johnson', product: 'Bluetooth Speaker', amount: '$49.99', status: 'Delivered' },
  ]

  const lowStockProducts = [
    { name: 'Wireless Earbuds', stock: 3, threshold: 5 },
    { name: 'Phone Case', stock: 2, threshold: 10 },
    { name: 'Screen Protector', stock: 1, threshold: 15 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'green'
      case 'Shipped': return 'blue'
      case 'Processing': return 'orange'
      default: return 'gray'
    }
  }

  return (
      <VStack spacing={8} align="stretch">
        {/* Welcome Message */}
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
                Welcome back, {user?.name || 'Vendor'}!
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Manage your store, track sales, and grow your business with Clothify.
              </Text>
              <Button
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

        {/* Stats Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {stats.map((stat, index) => (
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

        {/* Quick Actions */}
        <Box>
          <Heading size="lg" mb={6} color="gray.800">
            Quick Actions
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {quickActions.map((action, index) => (
              <MotionCard
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                cursor="pointer"
                onClick={action.action}
                _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }}
                borderRadius="xl"
              >
                <CardBody p={6}>
                  <VStack spacing={4}>
                    <Box
                      p={3}
                      borderRadius="full"
                      bg={`${action.color}.100`}
                      color={`${action.color}.600`}
                    >
                      <Icon as={action.icon} w={6} h={6} />
                    </Box>
                    <VStack spacing={1} textAlign="center">
                      <Text fontWeight="semibold" color="gray.800">
                        {action.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {action.description}
                      </Text>
                    </VStack>
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>
        </Box>

        {/* Recent Orders and Low Stock */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Recent Orders */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="gray.800">
                  Recent Orders
                </Heading>
                <Button
                  variant="outline"
                  colorScheme="green"
                  onClick={() => navigate('/vendor/orders')}
                  borderRadius="lg"
                >
                  View All
                </Button>
              </HStack>

              <VStack spacing={4} align="stretch">
                {recentOrders.map((order) => (
                  <HStack
                    key={order.id}
                    justify="space-between"
                    align="center"
                    p={4}
                    bg="gray.50"
                    borderRadius="lg"
                  >
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        {order.id}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {order.customer} • {order.product}
                      </Text>
                    </VStack>

                    <VStack align="end" spacing={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        {order.amount}
                      </Text>
                      <Badge
                        colorScheme={getStatusColor(order.status)}
                        borderRadius="full"
                        px={3}
                        py={1}
                      >
                        {order.status}
                      </Badge>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Low Stock Alert */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody>
              <HStack justify="space-between" align="center" mb={6}>
                <HStack spacing={2}>
                  <Icon as={AlertTriangle} color="orange.500" />
                  <Heading size="lg" color="gray.800">
                    Low Stock Alert
                  </Heading>
                </HStack>
                <Button
                  variant="outline"
                  colorScheme="orange"
                  onClick={() => navigate('/vendor/products')}
                  borderRadius="lg"
                >
                  Manage Stock
                </Button>
              </HStack>

              <VStack spacing={4} align="stretch">
                {lowStockProducts.map((product) => (
                  <Box key={product.name} p={4} bg="orange.50" borderRadius="lg">
                    <HStack justify="space-between" align="center" mb={2}>
                      <Text fontWeight="semibold" color="gray.800">
                        {product.name}
                      </Text>
                      <Badge colorScheme="orange" borderRadius="full">
                        {product.stock} left
                      </Badge>
                    </HStack>
                    <Progress
                      value={(product.stock / product.threshold) * 100}
                      colorScheme="orange"
                      size="sm"
                      borderRadius="full"
                    />
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Threshold: {product.threshold} units
                    </Text>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>
        </SimpleGrid>
      </VStack>
  )
}

export default VendorDashboard
