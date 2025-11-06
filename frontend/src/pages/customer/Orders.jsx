import { useState, useEffect } from "react"
import { Box, VStack, HStack, Text, Badge, Card, CardBody, Heading, SimpleGrid, Button, useToast, Spinner, Center } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'

const MotionBox = motion(Box)

const CustomerOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const response = await fetch(`${API_BASE_URL}/api/orders`)
      if (response.ok) {
        const allOrders = await response.json()
        // Filter orders for current user
        const userOrders = allOrders.filter(order => order.customerId === user.id)
        setOrders(userOrders)
      } else {
        throw new Error('Failed to fetch orders')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'shipped': return 'blue'
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout title="My Orders" role="customer">
        <Center h="400px">
          <Spinner size="xl" color="purple.500" />
        </Center>
      </Layout>
    )
  }

  return (
    <Box maxW="1200px" mx="auto" px={6}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" color="gray.800">
            My Orders
          </Heading>

          {orders.length === 0 ? (
            <Card shadow="md" borderRadius="xl">
              <CardBody textAlign="center" py={12}>
                <Text fontSize="lg" color="gray.600" mb={4}>
                  You haven't placed any orders yet.
                </Text>
                <Button
                  colorScheme="purple"
                  onClick={() => navigate('/customer/catalog')}
                  borderRadius="xl"
                >
                  Start Shopping
                </Button>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {orders.map((order) => (
                <MotionBox
                  key={order.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card shadow="md" borderRadius="xl" _hover={{ shadow: 'lg' }} transition="all 0.2s">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.600">
                              Order #{order.id}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              {formatDate(order.orderDate)}
                            </Text>
                          </VStack>
                          <Badge
                            colorScheme={getStatusColor(order.status)}
                            borderRadius="full"
                            px={3}
                            py={1}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </HStack>

                        <Divider />

                        <VStack align="stretch" spacing={2}>
                          {order.items.slice(0, 3).map((item, index) => (
                            <HStack key={index} justify="space-between">
                              <Text fontSize="sm" noOfLines={1}>
                                {item.name}
                              </Text>
                              <Text fontSize="sm" color="gray.600">
                                x{item.quantity}
                              </Text>
                            </HStack>
                          ))}
                          {order.items.length > 3 && (
                            <Text fontSize="sm" color="gray.500">
                              +{order.items.length - 3} more items
                            </Text>
                          )}
                        </VStack>

                        <Divider />

                        <HStack justify="space-between" align="center">
                          <Text fontSize="sm" color="gray.600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </Text>
                          <Text fontWeight="bold" color="purple.600">
                            ${order.total.toFixed(2)}
                          </Text>
                        </HStack>

                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="purple"
                          w="full"
                          borderRadius="lg"
                          onClick={() => {
                            // TODO: Implement order details modal/page
                            toast({
                              title: 'Order Details',
                              description: 'Order details view coming soon!',
                              status: 'info',
                              duration: 2000,
                              isClosable: true,
                            })
                          }}
                        >
                          View Details
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </MotionBox>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </MotionBox>
    </Box>
  )
}

export default CustomerOrders
