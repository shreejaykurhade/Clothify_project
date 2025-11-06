import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { TrendingUp, TrendingDown, Clock, CheckCircle, Star, Calendar, Target, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const DeliveryPerformance = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const performanceStats = [
    {
      label: 'Average Delivery Time',
      value: '32 min',
      icon: Clock,
      color: 'blue',
      change: '-8%',
      changeType: 'decrease',
      target: '30 min',
    },
    {
      label: 'On-Time Delivery Rate',
      value: '94%',
      icon: CheckCircle,
      color: 'green',
      change: '+2%',
      changeType: 'increase',
      target: '95%',
    },
    {
      label: 'Customer Rating',
      value: '4.8/5',
      icon: Star,
      color: 'yellow',
      change: '+0.1',
      changeType: 'increase',
      target: '4.9/5',
    },
    {
      label: 'Deliveries Completed',
      value: '156',
      icon: Target,
      color: 'purple',
      change: '+12%',
      changeType: 'increase',
      target: '160',
    },
  ]

  const weeklyPerformance = [
    { day: 'Mon', deliveries: 24, avgTime: 28, rating: 4.9 },
    { day: 'Tue', deliveries: 31, avgTime: 32, rating: 4.7 },
    { day: 'Wed', deliveries: 28, avgTime: 30, rating: 4.8 },
    { day: 'Thu', deliveries: 35, avgTime: 35, rating: 4.6 },
    { day: 'Fri', deliveries: 38, avgTime: 33, rating: 4.8 },
  ]

  const achievements = [
    { title: 'Speed Demon', description: 'Delivered 10 orders under 20 minutes', icon: Award, color: 'gold', earned: true },
    { title: 'Perfect Week', description: '100% on-time delivery rate for a week', icon: Target, color: 'silver', earned: true },
    { title: 'Customer Favorite', description: 'Maintain 4.9+ rating for a month', icon: Star, color: 'bronze', earned: false },
    { title: 'Delivery Master', description: 'Complete 500 deliveries', icon: CheckCircle, color: 'gold', earned: false },
  ]

  const customerFeedback = [
    { customer: 'John D.', rating: 5, comment: 'Super fast delivery! Driver was very polite.', date: '2 days ago' },
    { customer: 'Sarah M.', rating: 4, comment: 'Package arrived on time, but box was slightly damaged.', date: '3 days ago' },
    { customer: 'Mike R.', rating: 5, comment: 'Excellent service as always. Will order again!', date: '4 days ago' },
  ]

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
              Performance Analytics
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Track your delivery performance and customer satisfaction metrics.
            </Text>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              maxW="200px"
              bg="white"
              color="green.600"
              borderRadius="lg"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Performance Stats */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        {performanceStats.map((stat, index) => (
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
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Target: {stat.target}
                </Text>
              </Stat>
            </CardBody>
          </MotionCard>
        ))}
      </SimpleGrid>

      {/* Weekly Performance Chart */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Weekly Performance
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 5 }} spacing={4}>
            {weeklyPerformance.map((day, index) => (
              <VStack key={index} spacing={3}>
                <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                  {day.day}
                </Text>
                <VStack spacing={2} align="stretch" w="full">
                  <Box
                    h="60px"
                    bg="blue.100"
                    borderRadius="md"
                    position="relative"
                    overflow="hidden"
                  >
                    <Box
                      h={`${(day.deliveries / Math.max(...weeklyPerformance.map(d => d.deliveries))) * 100}%`}
                      bg="blue.500"
                      borderRadius="md"
                      position="absolute"
                      bottom={0}
                      w="full"
                    />
                  </Box>
                  <Text fontSize="xs" color="blue.600" textAlign="center">
                    {day.deliveries} deliveries
                  </Text>
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Avg: {day.avgTime}min
                  </Text>
                  <HStack spacing={1} justify="center">
                    <Icon as={Star} w={3} h={3} color="yellow.400" />
                    <Text fontSize="xs" color="gray.600">
                      {day.rating}
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>
        </CardBody>
      </MotionCard>

      {/* Achievements and Customer Feedback */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Achievements */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Achievements
            </Heading>
            <VStack spacing={4} align="stretch">
              {achievements.map((achievement, index) => {
                const AchievementIcon = achievement.icon
                return (
                  <HStack
                    key={index}
                    spacing={4}
                    p={4}
                    bg={achievement.earned ? `${achievement.color}.50` : 'gray.50'}
                    borderRadius="lg"
                    border={achievement.earned ? `2px solid ${achievement.color}` : '2px solid gray.200'}
                  >
                    <Box
                      p={2}
                      borderRadius="full"
                      bg={achievement.earned ? `${achievement.color}.500` : 'gray.400'}
                      color="white"
                    >
                      <Icon as={AchievementIcon} w={5} h={5} />
                    </Box>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="semibold" color="gray.800">
                        {achievement.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {achievement.description}
                      </Text>
                    </VStack>
                    {achievement.earned && (
                      <Badge colorScheme={achievement.color} borderRadius="full">
                        Earned
                      </Badge>
                    )}
                  </HStack>
                )
              })}
            </VStack>
          </CardBody>
        </MotionCard>

        {/* Customer Feedback */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          borderRadius="xl"
          shadow="md"
        >
          <CardBody>
            <Heading size="lg" mb={6} color="gray.800">
              Recent Customer Feedback
            </Heading>
            <VStack spacing={4} align="stretch">
              {customerFeedback.map((feedback, index) => (
                <Box key={index} p={4} bg="gray.50" borderRadius="lg">
                  <HStack justify="space-between" align="start" mb={2}>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="semibold" color="gray.800">
                        {feedback.customer}
                      </Text>
                      <HStack spacing={1}>
                        {Array(5).fill('').map((_, i) => (
                          <Box
                            key={i}
                            as="span"
                            color={i < feedback.rating ? 'yellow.400' : 'gray.300'}
                            fontSize="sm"
                          >
                            ★
                          </Box>
                        ))}
                      </HStack>
                    </VStack>
                    <Text fontSize="xs" color="gray.500">
                      {feedback.date}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    "{feedback.comment}"
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

export default DeliveryPerformance
