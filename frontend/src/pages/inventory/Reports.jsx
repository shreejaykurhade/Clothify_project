import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Package, AlertTriangle, DollarSign, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const InventoryReports = () => {
  const [reportType, setReportType] = useState('stock_levels')
  const [dateRange, setDateRange] = useState('30d')

  const stockReports = [
    { category: 'Electronics', totalProducts: 245, inStock: 198, lowStock: 32, outOfStock: 15, value: '$45,230' },
    { category: 'Accessories', totalProducts: 189, inStock: 167, lowStock: 18, outOfStock: 4, value: '$12,450' },
    { category: 'Office Supplies', totalProducts: 156, inStock: 142, lowStock: 12, outOfStock: 2, value: '$8,920' },
    { category: 'Home & Garden', totalProducts: 98, inStock: 89, lowStock: 7, outOfStock: 2, value: '$15,670' },
  ]

  const movementReports = [
    { period: 'This Week', inbound: 450, outbound: 380, net: 70 },
    { period: 'Last Week', inbound: 520, outbound: 490, net: 30 },
    { period: '2 Weeks Ago', inbound: 480, outbound: 460, net: 20 },
    { period: '3 Weeks Ago', inbound: 510, outbound: 500, net: 10 },
  ]

  const supplierReports = [
    { supplier: 'TechCorp', products: 89, totalValue: '$28,450', avgDelivery: '3.2 days', reliability: '98%' },
    { supplier: 'OfficePlus', products: 67, totalValue: '$15,230', avgDelivery: '2.8 days', reliability: '95%' },
    { supplier: 'HomeGoods', products: 45, totalValue: '$12,890', avgDelivery: '4.1 days', reliability: '92%' },
    { supplier: 'Accessories Inc', products: 34, totalValue: '$9,670', avgDelivery: '3.5 days', reliability: '97%' },
  ]

  const lowStockAlerts = [
    { product: 'Wireless Headphones', currentStock: 3, reorderPoint: 10, supplier: 'TechCorp', estimatedArrival: '2 days' },
    { product: 'Gaming Mouse', currentStock: 5, reorderPoint: 15, supplier: 'TechCorp', estimatedArrival: '3 days' },
    { product: 'USB Cable', currentStock: 8, reorderPoint: 20, supplier: 'Accessories Inc', estimatedArrival: '1 day' },
    { product: 'Phone Case', currentStock: 2, reorderPoint: 12, supplier: 'Accessories Inc', estimatedArrival: '4 days' },
  ]

  const exportReport = (type) => {
    // Simulate export functionality
    console.log(`Exporting ${type} report...`)
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
              Inventory Reports
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Generate comprehensive reports on stock levels, movements, and supplier performance.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Report Controls */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              maxW="250px"
              borderRadius="lg"
            >
              <option value="stock_levels">Stock Levels Report</option>
              <option value="movements">Stock Movements Report</option>
              <option value="suppliers">Supplier Performance</option>
              <option value="low_stock">Low Stock Alerts</option>
            </Select>
            <Select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </Select>
            <Button leftIcon={<Download />} colorScheme="blue" borderRadius="lg" onClick={() => exportReport(reportType)}>
              Export Report
            </Button>
            <Button leftIcon={<RefreshCw />} colorScheme="gray" variant="outline" borderRadius="lg">
              Refresh Data
            </Button>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Report Content */}
      <Tabs value={reportType} onChange={(index) => setReportType(['stock_levels', 'movements', 'suppliers', 'low_stock'][index])}>
        <TabList mb={6}>
          <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600' }}>Stock Levels</Tab>
          <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600' }}>Stock Movements</Tab>
          <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600' }}>Supplier Performance</Tab>
          <Tab _selected={{ color: 'blue.600', borderColor: 'blue.600' }}>Low Stock Alerts</Tab>
        </TabList>

        <TabPanels>
          {/* Stock Levels Report */}
          <TabPanel p={0}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              borderRadius="xl"
              shadow="md"
            >
              <CardBody>
                <Heading size="lg" mb={6} color="gray.800">
                  Stock Levels by Category
                </Heading>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Category</Th>
                        <Th>Total Products</Th>
                        <Th>In Stock</Th>
                        <Th>Low Stock</Th>
                        <Th>Out of Stock</Th>
                        <Th>Total Value</Th>
                        <Th>Stock Health</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {stockReports.map((report, index) => {
                        const totalStock = report.inStock + report.lowStock + report.outOfStock
                        const healthPercentage = (report.inStock / totalStock) * 100
                        return (
                          <Tr key={index}>
                            <Td>
                              <Text fontWeight="semibold" color="gray.800">
                                {report.category}
                              </Text>
                            </Td>
                            <Td>{report.totalProducts}</Td>
                            <Td>
                              <Badge colorScheme="green" borderRadius="full">
                                {report.inStock}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme="orange" borderRadius="full">
                                {report.lowStock}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge colorScheme="red" borderRadius="full">
                                {report.outOfStock}
                              </Badge>
                            </Td>
                            <Td>
                              <Text fontWeight="semibold" color="green.600">
                                {report.value}
                              </Text>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  {Math.round(healthPercentage)}% healthy
                                </Text>
                                <Progress
                                  value={healthPercentage}
                                  colorScheme={healthPercentage > 80 ? 'green' : healthPercentage > 60 ? 'orange' : 'red'}
                                  size="sm"
                                  borderRadius="full"
                                  w="100px"
                                />
                              </VStack>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </MotionCard>
          </TabPanel>

          {/* Stock Movements Report */}
          <TabPanel p={0}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              borderRadius="xl"
              shadow="md"
            >
              <CardBody>
                <Heading size="lg" mb={6} color="gray.800">
                  Stock Movements Overview
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  {movementReports.map((report, index) => (
                    <Card key={index} borderRadius="lg" shadow="sm">
                      <CardBody>
                        <VStack align="stretch" spacing={3}>
                          <Text fontWeight="semibold" color="gray.800" textAlign="center">
                            {report.period}
                          </Text>
                          <Divider />
                          <HStack justify="space-between">
                            <VStack align="center" spacing={1}>
                              <Icon as={TrendingUp} color="green.500" w={5} h={5} />
                              <Text fontSize="sm" color="gray.600">Inbound</Text>
                              <Text fontSize="lg" color="green.600" fontWeight="bold">
                                {report.inbound}
                              </Text>
                            </VStack>
                            <VStack align="center" spacing={1}>
                              <Icon as={TrendingDown} color="blue.500" w={5} h={5} />
                              <Text fontSize="sm" color="gray.600">Outbound</Text>
                              <Text fontSize="lg" color="blue.600" fontWeight="bold">
                                {report.outbound}
                              </Text>
                            </VStack>
                            <VStack align="center" spacing={1}>
                              <Icon as={Package} color="purple.500" w={5} h={5} />
                              <Text fontSize="sm" color="gray.600">Net</Text>
                              <Text fontSize="lg" color="purple.600" fontWeight="bold">
                                {report.net > 0 ? '+' : ''}{report.net}
                              </Text>
                            </VStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </CardBody>
            </MotionCard>
          </TabPanel>

          {/* Supplier Performance Report */}
          <TabPanel p={0}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              borderRadius="xl"
              shadow="md"
            >
              <CardBody>
                <Heading size="lg" mb={6} color="gray.800">
                  Supplier Performance Metrics
                </Heading>
                <Box overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Supplier</Th>
                        <Th>Products</Th>
                        <Th>Total Value</Th>
                        <Th>Avg Delivery Time</Th>
                        <Th>Reliability</Th>
                        <Th>Performance Score</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {supplierReports.map((supplier, index) => {
                        const reliabilityScore = parseFloat(supplier.reliability)
                        return (
                          <Tr key={index}>
                            <Td>
                              <Text fontWeight="semibold" color="gray.800">
                                {supplier.supplier}
                              </Text>
                            </Td>
                            <Td>{supplier.products}</Td>
                            <Td>
                              <Text fontWeight="semibold" color="green.600">
                                {supplier.totalValue}
                              </Text>
                            </Td>
                            <Td>{supplier.avgDelivery}</Td>
                            <Td>
                              <HStack spacing={2}>
                                <Text color={reliabilityScore > 95 ? 'green.600' : reliabilityScore > 90 ? 'orange.600' : 'red.600'}>
                                  {supplier.reliability}
                                </Text>
                              </HStack>
                            </Td>
                            <Td>
                              <VStack align="start" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  {reliabilityScore > 95 ? 'Excellent' : reliabilityScore > 90 ? 'Good' : 'Needs Improvement'}
                                </Text>
                                <Progress
                                  value={reliabilityScore}
                                  colorScheme={reliabilityScore > 95 ? 'green' : reliabilityScore > 90 ? 'orange' : 'red'}
                                  size="sm"
                                  borderRadius="full"
                                  w="80px"
                                />
                              </VStack>
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                </Box>
              </CardBody>
            </MotionCard>
          </TabPanel>

          {/* Low Stock Alerts Report */}
          <TabPanel p={0}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              borderRadius="xl"
              shadow="md"
            >
              <CardBody>
                <Heading size="lg" mb={6} color="gray.800">
                  Critical Low Stock Items
                </Heading>
                <VStack spacing={4} align="stretch">
                  {lowStockAlerts.map((alert, index) => (
                    <Card key={index} borderRadius="lg" shadow="sm" border="1px solid" borderColor="red.200">
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1}>
                              <HStack spacing={2}>
                                <Text fontWeight="semibold" color="gray.800">
                                  {alert.product}
                                </Text>
                                <Badge colorScheme="red" borderRadius="full">
                                  Critical
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                Supplier: {alert.supplier}
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={1}>
                              <Text fontSize="sm" color="red.600" fontWeight="semibold">
                                {alert.currentStock} / {alert.reorderPoint}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                Current / Reorder Point
                              </Text>
                            </VStack>
                          </HStack>

                          <HStack justify="space-between" align="center">
                            <Text fontSize="sm" color="gray.600">
                              Estimated arrival: {alert.estimatedArrival}
                            </Text>
                            <HStack spacing={2}>
                              <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                                View Details
                              </Button>
                              <Button size="sm" colorScheme="green" borderRadius="lg">
                                Place Order
                              </Button>
                            </HStack>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </CardBody>
            </MotionCard>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default InventoryReports
