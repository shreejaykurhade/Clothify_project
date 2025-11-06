import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Eye, Search, Filter, CheckCircle, XCircle, Edit, Star, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const ModeratorReviews = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const reviewStats = [
    {
      label: 'Total Reviews',
      value: '2,450',
      icon: MessageSquare,
      color: 'blue',
      change: '+15%',
      changeType: 'increase',
    },
    {
      label: 'Approved Reviews',
      value: '2,320',
      icon: CheckCircle,
      color: 'green',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Pending Reviews',
      value: '130',
      icon: Eye,
      color: 'orange',
      change: '+8%',
      changeType: 'increase',
    },
  ]

  const reviews = [
    { id: 1, product: 'Wireless Gaming Mouse', reviewer: 'John Doe', rating: 4, comment: 'Great product but the battery life could be better. Overall satisfied with the purchase.', status: 'pending', date: '2024-01-15', productImage: '/api/placeholder/50/50' },
    { id: 2, product: 'Cotton T-Shirt', reviewer: 'Jane Smith', rating: 5, comment: 'Perfect fit and excellent quality! Will definitely buy more colors.', status: 'approved', date: '2024-01-14', productImage: '/api/placeholder/50/50' },
    { id: 3, product: 'Bluetooth Headphones', reviewer: 'Mike Johnson', rating: 2, comment: 'Sound quality is okay but they disconnect frequently. Not worth the price.', status: 'pending', date: '2024-01-13', productImage: '/api/placeholder/50/50' },
    { id: 4, product: 'Smart Watch', reviewer: 'Sarah Wilson', rating: 3, comment: 'Decent features but the interface is confusing. Needs improvement.', status: 'rejected', date: '2024-01-12', productImage: '/api/placeholder/50/50' },
  ]

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green'
      case 'pending': return 'orange'
      case 'rejected': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'pending': return Eye
      case 'rejected': return XCircle
      default: return Eye
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
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bgGradient="linear(to-r, blue.500, cyan.500)"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Review Moderation
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Review and moderate product reviews to maintain quality and safety.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {reviewStats.map((stat, index) => (
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

      {/* Filters and Search */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <InputGroup maxW="300px">
              <InputLeftElement>
                <Icon as={Search} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Reviews List */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Reviews ({filteredReviews.length})
          </Heading>
          <VStack spacing={4} align="stretch">
            {filteredReviews.map((review) => {
              const StatusIcon = getStatusIcon(review.status)
              return (
                <Card key={review.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" align="start">
                        <HStack spacing={4}>
                          <Avatar size="md" name={review.reviewer} />
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Text fontWeight="semibold" color="gray.800">
                                {review.reviewer}
                              </Text>
                              <Badge colorScheme={getStatusColor(review.status)} borderRadius="full">
                                <HStack spacing={1}>
                                  <Icon as={StatusIcon} w={3} h={3} />
                                  <Text>{review.status}</Text>
                                </HStack>
                              </Badge>
                            </HStack>
                            <HStack spacing={1}>
                              {renderStars(review.rating)}
                              <Text fontSize="sm" color="gray.600" ml={2}>
                                on {review.product}
                              </Text>
                            </HStack>
                          </VStack>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {review.date}
                        </Text>
                      </HStack>

                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                        "{review.comment}"
                      </Text>

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        {review.status === 'pending' && (
                          <>
                            <Button size="sm" colorScheme="green" borderRadius="lg">
                              <Icon as={CheckCircle} w={4} h={4} mr={2} />
                              Approve
                            </Button>
                            <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                              <Icon as={XCircle} w={4} h={4} mr={2} />
                              Reject
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost" borderRadius="lg">
                          <Icon as={Edit} w={4} h={4} mr={2} />
                          Edit
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default ModeratorReviews
