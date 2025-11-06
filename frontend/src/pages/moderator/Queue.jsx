import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Clock, Search, Filter, CheckCircle, XCircle, Eye, MessageSquare, Package, Flag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const ModeratorQueue = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const queueStats = [
    {
      label: 'Total in Queue',
      value: '156',
      icon: Clock,
      color: 'orange',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Reviews Pending',
      value: '89',
      icon: MessageSquare,
      color: 'blue',
      change: '+8%',
      changeType: 'increase',
    },
    {
      label: 'Products Pending',
      value: '67',
      icon: Package,
      color: 'purple',
      change: '+15%',
      changeType: 'increase',
    },
  ]

  const queueItems = [
    { id: 1, type: 'review', title: 'Wireless Gaming Mouse Review', content: 'Great product but battery life could be better...', submitter: 'John Doe', priority: 'normal', date: '2024-01-15', status: 'pending' },
    { id: 2, type: 'product', title: 'Cotton T-Shirt', content: 'New clothing item for review', submitter: 'Fashion Hub', priority: 'high', date: '2024-01-14', status: 'pending' },
    { id: 3, type: 'review', title: 'Bluetooth Headphones Review', content: 'Sound quality is okay but disconnects frequently', submitter: 'Mike Johnson', priority: 'normal', date: '2024-01-13', status: 'pending' },
    { id: 4, type: 'product', title: 'Smart Watch', content: 'New electronics product', submitter: 'TechStore Pro', priority: 'urgent', date: '2024-01-12', status: 'pending' },
  ]

  const filteredItems = queueItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.submitter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type) => {
    switch (type) {
      case 'review': return 'blue'
      case 'product': return 'purple'
      case 'report': return 'red'
      default: return 'gray'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'review': return MessageSquare
      case 'product': return Package
      case 'report': return Flag
      default: return Clock
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'red'
      case 'high': return 'orange'
      case 'normal': return 'green'
      default: return 'gray'
    }
  }

  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bgGradient="linear(to-r, orange.500, yellow.500)"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Content Moderation Queue
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Review and approve pending content submissions and reviews.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {queueStats.map((stat, index) => (
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
                placeholder="Search queue..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Types</option>
              <option value="review">Reviews</option>
              <option value="product">Products</option>
              <option value="report">Reports</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Queue Items */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Moderation Queue ({filteredItems.length})
          </Heading>
          <VStack spacing={4} align="stretch">
            {filteredItems.map((item) => {
              const TypeIcon = getTypeIcon(item.type)
              return (
                <Card key={item.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="orange.200">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" align="start">
                        <HStack spacing={4}>
                          <Box
                            p={2}
                            borderRadius="full"
                            bg={`${getTypeColor(item.type)}.100`}
                            color={`${getTypeColor(item.type)}.600`}
                          >
                            <Icon as={TypeIcon} w={5} h={5} />
                          </Box>
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Badge colorScheme={getTypeColor(item.type)} borderRadius="full">
                                {item.type}
                              </Badge>
                              <Badge colorScheme={getPriorityColor(item.priority)} borderRadius="full">
                                {item.priority}
                              </Badge>
                            </HStack>
                            <Text fontWeight="semibold" color="gray.800">
                              {item.title}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              by {item.submitter}
                            </Text>
                          </VStack>
                        </HStack>
                        <VStack align="end" spacing={1}>
                          <Text fontSize="sm" color="gray.500">
                            {item.date}
                          </Text>
                          <Badge colorScheme="orange" borderRadius="full">
                            Pending
                          </Badge>
                        </VStack>
                      </HStack>

                      <Text color="gray.700" fontSize="sm" lineHeight="1.6">
                        {item.content}
                      </Text>

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          View Details
                        </Button>
                        <Button size="sm" colorScheme="green" borderRadius="lg">
                          <Icon as={CheckCircle} w={4} h={4} mr={2} />
                          Approve
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                          <Icon as={XCircle} w={4} h={4} mr={2} />
                          Reject
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

export default ModeratorQueue
