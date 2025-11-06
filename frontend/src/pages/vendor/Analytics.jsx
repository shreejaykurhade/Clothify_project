import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Progress, Select, useColorModeValue } from '@chakra-ui/react'
import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Eye, Calendar, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
//import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const Analytics = () => {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  // Mock data - replace with actual API call
  const analyticsData = {
    overview: {
      totalRevenue: 15420.50,
      totalOrders: 234,
      totalCustomers: 189,
      totalProducts: 45,
      revenueChange: 12.5,
      ordersChange: 8.3,
      customersChange: 15.2,
      productsChange: 5.7
    },
    salesData: [
      { month: 'Jan', revenue: 3200, orders: 45 },
      { month: 'Feb', revenue: 3800, orders: 52 },
      { month: 'Mar', revenue: 4100, orders: 58 },
      { month: 'Apr', revenue: 3600, orders: 49 },
      { month: 'May', revenue: 4200, orders: 61 },
      { month: 'Jun', revenue: 4520, orders: 67 }
    ],
    topProducts: [
      { name: 'Wireless Bluetooth Headphones', sales: 45, revenue: 4045.55, growth: 23 },
      { name: 'Smart Watch', sales: 32, revenue: 6396.68, growth: 18 },
      { name: 'Running Shoes', sales: 28, revenue: 2239.72, growth: 12 },
      { name: 'Cotton T-Shirt', sales: 52, revenue: 1039.48, growth: -5 },
      { name: 'Leather Wallet', sales: 23, revenue: 805.77, growth: 8 }
    ],
    customerInsights: {
      newCustomers: 34,
      returningCustomers: 155,
      averageOrderValue: 65.90,
      customerRetentionRate: 78.5
    },
    trafficSources: [
      { source: 'Direct', visitors: 1250, percentage: 35 },
      { source: 'Search Engines', visitors: 980, percentage: 27 },
      { source: 'Social Media', visitors: 756, percentage: 21 },
      { source: 'Email Marketing', visitors: 432, percentage: 12 },
      { source: 'Referrals', visitors: 156, percentage: 5 }
    ]
  }

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num)
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
                Analytics Dashboard
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Track your store's performance and make data-driven decisions.
              </Text>
              <HStack spacing={4}>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  bg="white"
                  color="green.600"
                  borderRadius="lg"
                  w="200px"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>
                      {period.label}
                    </option>
                  ))}
                </Select>
                <Button
                  leftIcon={<Download />}
                  colorScheme="whiteAlpha"
                  variant="outline"
                  _hover={{ bg: 'white', color: 'green.500' }}
                  borderRadius="lg"
                >
                  Export Report
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Overview Stats */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {[
            {
              label: 'Total Revenue',
              value: formatCurrency(analyticsData.overview.totalRevenue),
              icon: DollarSign,
              color: 'green',
              change: analyticsData.overview.revenueChange,
              changeType: analyticsData.overview.revenueChange > 0 ? 'increase' : 'decrease'
            },
            {
              label: 'Total Orders',
              value: formatNumber(analyticsData.overview.totalOrders),
              icon: ShoppingCart,
              color: 'blue',
              change: analyticsData.overview.ordersChange,
              changeType: analyticsData.overview.ordersChange > 0 ? 'increase' : 'decrease'
            },
            {
              label: 'Total Customers',
              value: formatNumber(analyticsData.overview.totalCustomers),
              icon: Users,
              color: 'purple',
              change: analyticsData.overview.customersChange,
              changeType: analyticsData.overview.customersChange > 0 ? 'increase' : 'decrease'
            },
            {
              label: 'Total Products',
              value: formatNumber(analyticsData.overview.totalProducts),
              icon: Package,
              color: 'orange',
              change: analyticsData.overview.productsChange,
              changeType: analyticsData.overview.productsChange > 0 ? 'increase' : 'decrease'
            }
          ].map((stat, index) => (
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
                    {Math.abs(stat.change)}% from last period
                  </StatHelpText>
                </Stat>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>

        {/* Sales Chart Placeholder */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <HStack justify="space-between" align="center" mb={6}>
              <Heading size="lg" color="gray.800">
                Sales Overview
              </Heading>
              <Icon as={BarChart3} w={6} h={6} color="gray.400" />
            </HStack>

            <Box h="300px" bg="gray.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
              <VStack spacing={2}>
                <Icon as={BarChart3} w={12} h={12} color="gray.400" />
                <Text color="gray.500" fontSize="sm">
                  Sales chart visualization would go here
                </Text>
                <Text color="gray.400" fontSize="xs">
                  (Chart library integration needed)
                </Text>
              </VStack>
            </Box>
          </CardBody>
        </MotionCard>

        {/* Top Products and Customer Insights */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Top Products */}
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
                  Top Products
                </Heading>
                <Icon as={Package} w={5} h={5} color="gray.400" />
              </HStack>

              <VStack spacing={4} align="stretch">
                {analyticsData.topProducts.map((product, index) => (
                  <HStack key={index} justify="space-between" align="center">
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                        {product.name}
                      </Text>
                      <HStack spacing={4}>
                        <Text fontSize="xs" color="gray.600">
                          {product.sales} sales
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {formatCurrency(product.revenue)}
                        </Text>
                      </HStack>
                    </VStack>

                    <HStack spacing={2}>
                      <Icon
                        as={product.growth > 0 ? TrendingUp : TrendingDown}
                        w={4}
                        h={4}
                        color={product.growth > 0 ? 'green.500' : 'red.500'}
                      />
                      <Text
                        fontSize="sm"
                        color={product.growth > 0 ? 'green.500' : 'red.500'}
                        fontWeight="semibold"
                      >
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </Text>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Customer Insights */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading size="lg" color="gray.800">
                  Customer Insights
                </Heading>
                <Icon as={Users} w={5} h={5} color="gray.400" />
              </HStack>

              <SimpleGrid columns={2} spacing={4}>
                <Box p={4} bg="blue.50" borderRadius="lg">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    {analyticsData.customerInsights.newCustomers}
                  </Text>
                  <Text fontSize="sm" color="blue.700">
                    New Customers
                  </Text>
                </Box>

                <Box p={4} bg="green.50" borderRadius="lg">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {analyticsData.customerInsights.returningCustomers}
                  </Text>
                  <Text fontSize="sm" color="green.700">
                    Returning Customers
                  </Text>
                </Box>

                <Box p={4} bg="purple.50" borderRadius="lg">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    {formatCurrency(analyticsData.customerInsights.averageOrderValue)}
                  </Text>
                  <Text fontSize="sm" color="purple.700">
                    Avg Order Value
                  </Text>
                </Box>

                <Box p={4} bg="orange.50" borderRadius="lg">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                    {analyticsData.customerInsights.customerRetentionRate}%
                  </Text>
                  <Text fontSize="sm" color="orange.700">
                    Retention Rate
                  </Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* Traffic Sources */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <HStack justify="space-between" align="center" mb={6}>
              <Heading size="lg" color="gray.800">
                Traffic Sources
              </Heading>
              <Icon as={Eye} w={5} h={5} color="gray.400" />
            </HStack>

            <VStack spacing={4} align="stretch">
              {analyticsData.trafficSources.map((source, index) => (
                <Box key={index}>
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="semibold" color="gray.800">
                      {source.source}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.600">
                        {formatNumber(source.visitors)} visitors
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        ({source.percentage}%)
                      </Text>
                    </HStack>
                  </HStack>
                  <Progress
                    value={source.percentage}
                    colorScheme="blue"
                    borderRadius="full"
                    size="sm"
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </VStack>
  )
}

export default Analytics
