import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { Shield, Eye, MessageSquare, Flag, CheckCircle, XCircle, Clock, AlertTriangle, Users, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'

const MotionCard = motion(Card)

const ModeratorDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const stats = [
    {
      label: 'Reviews Moderated',
      value: '1,234',
      icon: Eye,
      color: 'blue',
      change: '+18%',
      changeType: 'increase',
    },
    {
      label: 'Content Approved',
      value: '856',
      icon: CheckCircle,
      color: 'green',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Content Rejected',
      value: '67',
      icon: XCircle,
      color: 'red',
      change: '-5%',
      changeType: 'decrease',
    },
    {
      label: 'Pending Reviews',
      value: '23',
      icon: Clock,
      color: 'orange',
      change: '+8%',
      changeType: 'increase',
    },
  ]

  const quickActions = [
    {
      title: 'Review Content',
      description: 'Moderate product reviews',
      icon: Eye,
      color: 'blue',
      action: () => navigate('/moderator/reviews'),
    },
    {
      title: 'Content Queue',
      description: 'Check pending approvals',
      icon: Clock,
      color: 'orange',
      action: () => navigate('/moderator/queue'),
    },
    {
      title: 'Reported Content',
      description: 'Handle user reports',
      icon: Flag,
      color: 'red',
      action: () => navigate('/moderator/reports'),
    },
    {
      title: 'Analytics',
      description: 'View moderation stats',
      icon: BarChart3,
      color: 'purple',
      action: () => navigate('/moderator/analytics'),
    },
  ]

  const pendingReviews = [
    { id: 1, product: 'Wireless Headphones', reviewer: 'John Doe', rating: 4, comment: 'Great product but...', status: 'pending', date: '2024-01-15' },
    { id: 2, product: 'Smart Watch', reviewer: 'Jane Smith', rating: 5, comment: 'Absolutely love it!', status: 'pending', date: '2024-01-14' },
    { id: 3, product: 'Bluetooth Speaker', reviewer: 'Mike Johnson', rating: 2, comment: 'Not as expected...', status: 'pending', date: '2024-01-13' },
  ]

  const reportedContent = [
    { id: 1, type: 'Review', content: 'Inappropriate language in review', reporter: 'User123', priority: 'high', date: '2024-01-15' },
    { id: 2, type: 'Product', content: 'Suspicious product description', reporter: 'Vendor456', priority: 'medium', date: '2024-01-14' },
    { id: 3, type: 'Review', content: 'Spam review', reporter: 'User789', priority: 'low', date: '2024-01-13' },
  ]

  const recentActions = [
    { action: 'Approved review', content: 'Wireless Headphones review', time: '2 hours ago', type: 'success' },
    { action: 'Rejected review', content: 'Smart Watch review', time: '4 hours ago', type: 'error' },
    { action: 'Flagged content', content: 'Product description', time: '6 hours ago', type: 'warning' },
    { action: 'Approved product', content: 'Bluetooth Speaker', time: '8 hours ago', type: 'success' },
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'orange'
      case 'low': return 'green'
      default: return 'gray'
    }
  }

  const getActionIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return XCircle
      case 'warning': return AlertTriangle
      default: return Clock
    }
  }

  const renderStars = (rating) => {
    return Array(5).fill('').map((_, i) => (
      <Box
        key={i}
        as="span"
        color={i < rating ? 'yellow.400' : 'gray.300'}
        fontSize="sm"
      >
        ★
      </Box>
    ))
  }

  return (
      <VStack spacing={8} align="stretch">
        {/* Welcome Message */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bgGradient="linear(to-r, teal.500, cyan.500)"
          color="white"
          borderRadius="2xl"
        >
          <CardBody p={8}>
            <VStack align="start" spacing={4}>
              <Heading size="lg">
                Welcome back, {user?.name || 'Moderator'}!
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Maintain quality and safety across the Clothify platform through content moderation.
              </Text>
              <Button
                colorScheme="whiteAlpha"
                variant="outline"
                size="lg"
                onClick={() => navigate('/moderator/queue')}
                _hover={{ bg: 'white', color: 'teal.500' }}
                borderRadius="xl"
              >
                Review Queue
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
                    {stat.change} from last week
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

        {/* Content Moderation Tabs */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="teal">
              <TabList mb={6}>
                <Tab>Pending Reviews ({pendingReviews.length})</Tab>
                <Tab>Reported Content ({reportedContent.length})</Tab>
                <Tab>Recent Actions</Tab>
              </TabList>

              <TabPanels>
                {/* Pending Reviews */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    {pendingReviews.map((review) => (
                      <Card key={review.id} borderRadius="lg" shadow="sm">
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <Text fontWeight="semibold" color="gray.800">
                                  {review.product}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  by {review.reviewer}
                                </Text>
                                <HStack spacing={1}>
                                  {renderStars(review.rating)}
                                </HStack>
                              </VStack>
                              <Badge colorScheme="orange" borderRadius="full">
                                Pending
                              </Badge>
                            </HStack>

                            <Text color="gray.700" fontSize="sm">
                              "{review.comment}"
                            </Text>

                            <HStack spacing={2} justify="end">
                              <Button size="sm" colorScheme="green" borderRadius="lg">
                                Approve
                              </Button>
                              <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                                Reject
                              </Button>
                              <Button size="sm" variant="ghost" borderRadius="lg">
                                Edit
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Reported Content */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    {reportedContent.map((report) => (
                      <Card key={report.id} borderRadius="lg" shadow="sm">
                        <CardBody>
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1}>
                                <HStack spacing={2}>
                                  <Badge colorScheme="red" borderRadius="full">
                                    {report.type}
                                  </Badge>
                                  <Badge colorScheme={getPriorityColor(report.priority)} borderRadius="full">
                                    {report.priority} priority
                                  </Badge>
                                </HStack>
                                <Text fontWeight="semibold" color="gray.800">
                                  {report.content}
                                </Text>
                                <Text fontSize="sm" color="gray.600">
                                  Reported by {report.reporter}
                                </Text>
                              </VStack>
                              <Text fontSize="sm" color="gray.500">
                                {report.date}
                              </Text>
                            </HStack>

                            <HStack spacing={2} justify="end">
                              <Button size="sm" colorScheme="green" borderRadius="lg">
                                Dismiss
                              </Button>
                              <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                                Remove Content
                              </Button>
                              <Button size="sm" variant="ghost" borderRadius="lg">
                                Investigate
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </VStack>
                </TabPanel>

                {/* Recent Actions */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    {recentActions.map((action, index) => {
                      const ActionIcon = getActionIcon(action.type)
                      return (
                        <HStack
                          key={index}
                          spacing={3}
                          p={4}
                          bg="gray.50"
                          borderRadius="lg"
                        >
                          <Icon
                            as={ActionIcon}
                            color={`${getStatusColor(action.type)}.500`}
                            w={5}
                            h={5}
                          />
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                              {action.action}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {action.content}
                            </Text>
                          </VStack>
                          <Text fontSize="xs" color="gray.500">
                            {action.time}
                          </Text>
                        </HStack>
                      )
                    })}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </MotionCard>
      </VStack>
  )
}

export default ModeratorDashboard
