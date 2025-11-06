import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { BarChart3, TrendingUp, TrendingDown, Eye, CheckCircle, XCircle, Flag, MessageSquare, Package, Users, Calendar, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const ModeratorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const analyticsStats = [
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
      label: 'Reports Handled',
      value: '189',
      icon: Flag,
      color: 'orange',
      change: '+25%',
      changeType: 'increase',
    },
  ]

  const moderationTrends = [
    { period: 'Mon', reviews: 45, approved: 38, rejected: 7 },
    { period: 'Tue', reviews: 52, approved: 41, rejected: 11 },
    { period: 'Wed', reviews: 38, approved: 32, rejected: 6 },
    { period: 'Thu', reviews: 61, approved: 49, rejected: 12 },
    { period: 'Fri', reviews: 73, approved: 58, rejected: 15 },
    { period: 'Sat', reviews: 29, approved: 25, rejected: 4 },
    { period: 'Sun', reviews: 36, approved: 31, rejected: 5 },
  ]

  const topCategories = [
    { category: 'Electronics', moderated: 245, approved: 198, rejected: 47 },
    { category: 'Clothing', moderated: 189, approved: 167, rejected: 22 },
    { category: 'Home & Garden', moderated: 156, approved: 142, rejected: 14 },
    { category: 'Sports', moderated: 98, approved: 89, rejected: 9 },
    { category: 'Books', moderated: 76, approved: 72, rejected: 4 },
  ]

  const recentActivity = [
    { action: 'Bulk approved 15 reviews', time: '2 hours ago', impact: 'positive' },
    { action: 'Rejected spam content', time: '4 hours ago', impact: 'neutral' },
    { action: 'Flagged inappropriate review', time: '6 hours ago', impact: 'negative' },
    { action: 'Approved vendor product', time: '8 hours ago', impact: 'positive' },
  ]

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'positive': return 'green'
      case 'negative': return 'red'
      case 'neutral': return 'blue'
      default: return 'gray'
    }
  }

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return TrendingUp
      case 'negative': return TrendingDown
      case 'neutral': return Activity
      default: return Activity
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="purple.600"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Moderation Analytics
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Track your moderation performance and platform health metrics.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Time Range Selector */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <HStack spacing={4}>
            <Text fontWeight="semibold" color="gray.700">
              Time Range:
            </Text>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {analyticsStats.map((stat, index) => (
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



      {/* Top Categories and Recent Activity */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Top Categories */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Top Categories Moderated
            </Heading>
            <VStack spacing={4} align="stretch">
              {topCategories.map((category, index) => (
                <Box key={index}>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" color="gray.800">
                      {category.category}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {category.moderated} total
                    </Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Progress
                      value={(category.approved / category.moderated) * 100}
                      colorScheme="green"
                      size="sm"
                      flex={1}
                      borderRadius="full"
                    />
                    <Text fontSize="xs" color="green.600" minW="40px">
                      {Math.round((category.approved / category.moderated) * 100)}%
                    </Text>
                  </HStack>
                  <HStack spacing={4} mt={1}>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="green.500" borderRadius="full"></Box>
                      <Text fontSize="xs" color="gray.600">
                        {category.approved} approved
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Box w={2} h={2} bg="red.500" borderRadius="full"></Box>
                      <Text fontSize="xs" color="gray.600">
                        {category.rejected} rejected
                      </Text>
                    </HStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Recent Activity */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Recent Activity
            </Heading>
            <VStack spacing={4} align="stretch">
              {recentActivity.map((activity, index) => {
                const ImpactIcon = getImpactIcon(activity.impact)
                return (
                  <HStack
                    key={index}
                    spacing={3}
                    p={3}
                    bg={`${getImpactColor(activity.impact)}.50`}
                    borderRadius="lg"
                  >
                    <Icon
                      as={ImpactIcon}
                      color={`${getImpactColor(activity.impact)}.500`}
                      w={4}
                      h={4}
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                        {activity.action}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {activity.time}
                      </Text>
                    </VStack>
                  </HStack>
                )
              })}
            </VStack>
          </CardBody>
        </MotionCard>
      </SimpleGrid>
    </VStack>
  )
}

export default ModeratorAnalytics
