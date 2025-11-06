import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge } from '@chakra-ui/react'
import { Users, Store, Package, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MotionCard = motion(Card)

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    {
      label: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'blue',
      change: '+15%',
      changeType: 'increase',
    },
    {
      label: 'Active Vendors',
      value: '89',
      icon: Store,
      color: 'green',
      change: '+8%',
      changeType: 'increase',
    },
    {
      label: 'Total Products',
      value: '2,450',
      icon: Package,
      color: 'purple',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Total Revenue',
      value: '$45,230',
      icon: DollarSign,
      color: 'orange',
      change: '+23%',
      changeType: 'increase',
    },
  ]

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage users and roles',
      icon: Users,
      color: 'blue',
      action: () => navigate('/admin/Users'), // Redirects to admin/Users.jsx
    },
    {
      title: 'Vendor Approvals',
      description: 'Review vendor applications',
      icon: Store,
      color: 'green',
      action: () => navigate('/admin/Vendors'), // Redirects to admin/Vendors.jsx
    },
    {
      title: 'Product Approvals',
      description: 'Review new products',
      icon: Package,
      color: 'purple',
      action: () => navigate('/admin/Products'), // Redirects to admin/Products.jsx
    },
    {
      title: 'Reports',
      description: 'View analytics and reports',
      icon: BarChart3,
      color: 'orange',
      action: () => navigate('/admin/reports'),
    },
  ]

  const pendingApprovals = [
    { type: 'Vendor', name: 'TechStore Pro', applicant: 'John Smith', date: '2024-01-15', status: 'pending' },
    { type: 'Product', name: 'Wireless Gaming Mouse', vendor: 'GameTech Inc', date: '2024-01-14', status: 'pending' },
    { type: 'Vendor', name: 'Fashion Hub', applicant: 'Sarah Johnson', date: '2024-01-13', status: 'pending' },
  ]

  const recentActivity = [
    { action: 'New vendor approved', user: 'TechStore Pro', time: '2 hours ago', type: 'success' },
    { action: 'Product rejected', user: 'GameTech Inc', time: '4 hours ago', type: 'error' },
    { action: 'New user registered', user: 'Mike Davis', time: '6 hours ago', type: 'info' },
    { action: 'Vendor application submitted', user: 'Fashion Hub', time: '8 hours ago', type: 'info' },
  ]

  const systemAlerts = [
    { message: 'Server maintenance scheduled for tonight', type: 'warning', time: '1 hour ago' },
    { message: 'New vendor onboarding completed', type: 'success', time: '3 hours ago' },
    { message: 'Payment gateway updated successfully', type: 'success', time: '5 hours ago' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'green'
      case 'error': return 'red'
      case 'warning': return 'orange'
      case 'info': return 'blue'
      default: return 'gray'
    }
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return XCircle
      case 'info': return Clock
      default: return Clock
    }
  }

  return (
    <Box p={8} bg="gray.50" minH="100vh">
      <VStack spacing={8} align="stretch">
        {/* Welcome Message */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, red.500, orange.500)"
          color="white"
          borderRadius="2xl"
        >
          <CardBody p={8}>
            <VStack align="start" spacing={4}>
              <Heading size="lg">
                Welcome back, {user?.name || 'Administrator'}!
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Monitor and manage the entire Clothify platform from your admin dashboard.
              </Text>
              <Button
                colorScheme="whiteAlpha"
                variant="outline"
                size="lg"
                onClick={() => navigate('/admin/reports')}
                _hover={{ bg: 'white', color: 'red.500' }}
                borderRadius="xl"
              >
                View Reports
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

        {/* Quick Actions - These buttons navigate to respective admin pages */}
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

        {/* Pending Approvals and Recent Activity */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Pending Approvals - Button redirects to admin/Approvals.jsx */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody>
              <HStack justify="space-between" align="center" mb={6}>
                <HStack spacing={2}>
                  <Icon as={Clock} color="orange.500" />
                  <Heading size="md" color="gray.800">
                    Pending Approvals ({pendingApprovals.length})
                  </Heading>
                </HStack>
                <Button
                  variant="outline"
                  colorScheme="orange"
                  size="sm"
                  onClick={() => navigate('/admin/approvals')} // Redirects to admin/Approvals.jsx
                  borderRadius="lg"
                >
                  Review All
                </Button>
              </HStack>

              <VStack spacing={4} align="stretch">
                {pendingApprovals.map((item, index) => (
                  <Box
                    key={index}
                    p={4}
                    bg="orange.50"
                    borderRadius="lg"
                  >
                    <VStack align="start" spacing={2}>
                      <HStack spacing={2}>
                        <Badge colorScheme="orange" borderRadius="full">
                          {item.type}
                        </Badge>
                        <Text fontWeight="semibold" color="gray.800" fontSize="sm">
                          {item.name}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.600">
                        {item.type === 'Vendor' ? `Applicant: ${item.applicant}` : `Vendor: ${item.vendor}`}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.date}
                      </Text>
                      <HStack spacing={2} mt={2}>
                        <Button size="xs" colorScheme="green" borderRadius="lg">
                          Approve
                        </Button>
                        <Button size="xs" colorScheme="red" variant="outline" borderRadius="lg">
                          Reject
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Recent Activity */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            borderRadius="xl"
            shadow="md"
          >
            <CardBody>
              <HStack justify="space-between" align="center" mb={6}>
                <Heading size="md" color="gray.800">
                  Recent Activity
                </Heading>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="sm"
                  onClick={() => navigate('/admin/activity')}
                  borderRadius="lg"
                >
                  View All
                </Button>
              </HStack>

              <VStack spacing={4} align="stretch">
                {recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <HStack
                      key={index}
                      spacing={3}
                      p={3}
                      bg="gray.50"
                      borderRadius="lg"
                    >
                      <Icon
                        as={ActivityIcon}
                        color={`${getStatusColor(activity.type)}.500`}
                        w={4}
                        h={4}
                      />
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                          {activity.action}
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          {activity.user}
                        </Text>
                      </VStack>
                      <Text fontSize="xs" color="gray.500">
                        {activity.time}
                      </Text>
                    </HStack>
                  )
                })}
              </VStack>
            </CardBody>
          </MotionCard>
        </SimpleGrid>

        {/* System Alerts */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <HStack justify="space-between" align="center" mb={6}>
              <HStack spacing={2}>
                <Icon as={AlertTriangle} color="yellow.500" />
                <Heading size="md" color="gray.800">
                  System Alerts
                </Heading>
              </HStack>
              <Button
                variant="outline"
                colorScheme="yellow"
                size="sm"
                onClick={() => navigate('/admin/system')}
                borderRadius="lg"
              >
                View All
              </Button>
            </HStack>

            <VStack spacing={4} align="stretch">
              {systemAlerts.map((alert, index) => (
                <HStack
                  key={index}
                  spacing={3}
                  p={4}
                  bg={`${getStatusColor(alert.type)}.50`}
                  borderRadius="lg"
                  borderLeft="4px solid"
                  borderLeftColor={`${getStatusColor(alert.type)}.500`}
                >
                  <Icon
                    as={alert.type === 'warning' ? AlertTriangle : CheckCircle}
                    color={`${getStatusColor(alert.type)}.500`}
                    w={5}
                    h={5}
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                      {alert.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {alert.time}
                    </Text>
                  </VStack>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>
      </VStack>
    </Box>
  )
}

export default AdminDashboard