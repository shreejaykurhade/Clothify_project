import { Box, VStack, HStack, Text, Card, CardBody, CardHeader, Heading, Grid, Stat, StatLabel, StatNumber, StatHelpText, Button, Badge, Divider, Avatar } from '@chakra-ui/react'
import { ShoppingBag, Heart, CreditCard, Truck, Star, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const CustomerDashboard = () => {
  const { user } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  // Mock data - in a real app, this would come from API
  const stats = {
    totalOrders: 12,
    totalSpent: 1247.89,
    wishlistItems: 8,
    pendingOrders: 2
  }

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 89.99,
      items: ['Wireless Headphones', 'Phone Case']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 156.50,
      items: ['Smart Watch', 'Charging Cable']
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'green'
      case 'shipped': return 'blue'
      case 'processing': return 'yellow'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  return (
    
      <VStack spacing={8} align="stretch">
        {/* Welcome Section */}
        <Box>
          <HStack spacing={4} align="center">
            <Avatar size="lg" name={user?.name} bg="purple.500" />
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                Welcome back, {user?.name}!
              </Text>
              <Text color="gray.600">
                Here's what's happening with your account today.
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Cart Items</StatLabel>
                <StatNumber>{getTotalItems()}</StatNumber>
                <StatHelpText>
                  <Button
                    size="sm"
                    variant="link"
                    colorScheme="purple"
                    onClick={() => navigate('/customer/cart')}
                  >
                    View Cart
                  </Button>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Orders</StatLabel>
                <StatNumber>{stats.totalOrders}</StatNumber>
                <StatHelpText>
                  <Button
                    size="sm"
                    variant="link"
                    colorScheme="purple"
                    onClick={() => navigate('/customer/orders')}
                  >
                    View Orders
                  </Button>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Spent</StatLabel>
                <StatNumber>${stats.totalSpent.toFixed(2)}</StatNumber>
                <StatHelpText>
                  <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  +12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Wishlist Items</StatLabel>
                <StatNumber>{stats.wishlistItems}</StatNumber>
                <StatHelpText>
                  <Button
                    size="sm"
                    variant="link"
                    colorScheme="purple"
                    onClick={() => navigate('/customer/wishlist')}
                  >
                    View Wishlist
                  </Button>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <Heading size="md">Quick Actions</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
              <Button
                leftIcon={<ShoppingBag />}
                colorScheme="purple"
                variant="outline"
                onClick={() => navigate('/customer/catalog')}
                h="auto"
                py={4}
                flexDirection="column"
                gap={2}
              >
                <Text>Browse Products</Text>
              </Button>

              <Button
                leftIcon={<Heart />}
                colorScheme="red"
                variant="outline"
                onClick={() => navigate('/customer/wishlist')}
                h="auto"
                py={4}
                flexDirection="column"
                gap={2}
              >
                <Text>My Wishlist</Text>
              </Button>

              <Button
                leftIcon={<CreditCard />}
                colorScheme="blue"
                variant="outline"
                onClick={() => navigate('/customer/orders')}
                h="auto"
                py={4}
                flexDirection="column"
                gap={2}
              >
                <Text>Order History</Text>
              </Button>

              <Button
                leftIcon={<Truck />}
                colorScheme="green"
                variant="outline"
                onClick={() => navigate('/customer/orders')}
                h="auto"
                py={4}
                flexDirection="column"
                gap={2}
              >
                <Text>Track Orders</Text>
              </Button>
            </Grid>
          </CardBody>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Recent Orders</Heading>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/customer/orders')}
              >
                View All
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {recentOrders.map((order) => (
                <Box key={order.id}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="semibold">{order.id}</Text>
                        <Badge colorScheme={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(order.date).toLocaleDateString()}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {order.items.join(', ')}
                      </Text>
                    </VStack>
                    <VStack align="end" spacing={1}>
                      <Text fontWeight="semibold">${order.total.toFixed(2)}</Text>
                      <Button size="xs" variant="outline">
                        View Details
                      </Button>
                    </VStack>
                  </HStack>
                  {order !== recentOrders[recentOrders.length - 1] && <Divider mt={4} />}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <Heading size="md">Account Settings</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">Personal Information</Text>
                <Text fontSize="sm" color="gray.600">
                  Update your name, email, and contact details
                </Text>
                <Button size="sm" variant="outline">
                  Edit Profile
                </Button>
              </VStack>

              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">Security</Text>
                <Text fontSize="sm" color="gray.600">
                  Change password and security settings
                </Text>
                <Button size="sm" variant="outline">
                  Change Password
                </Button>
              </VStack>
            </Grid>
          </CardBody>
        </Card>
      </VStack>
  )
}

export default CustomerDashboard
