import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Flag, Search, Filter, CheckCircle, XCircle, Eye, AlertTriangle, MessageSquare, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const ModeratorReports = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('all')

  const reportStats = [
    {
      label: 'Total Reports',
      value: '234',
      icon: Flag,
      color: 'red',
      change: '+18%',
      changeType: 'increase',
    },
    {
      label: 'High Priority',
      value: '45',
      icon: AlertTriangle,
      color: 'orange',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Resolved',
      value: '189',
      icon: CheckCircle,
      color: 'green',
      change: '+25%',
      changeType: 'increase',
    },
  ]

  const reports = [
    { id: 1, type: 'Review', content: 'Inappropriate language in review about Wireless Headphones', reporter: 'User123', priority: 'high', status: 'pending', date: '2024-01-15', reportedContent: 'Review content with offensive language' },
    { id: 2, type: 'Product', content: 'Suspicious product description for Smart Watch', reporter: 'Vendor456', priority: 'medium', status: 'investigating', date: '2024-01-14', reportedContent: 'Product description appears to be spam' },
    { id: 3, type: 'Review', content: 'Spam review on Bluetooth Speaker', reporter: 'User789', priority: 'low', status: 'resolved', date: '2024-01-13', reportedContent: 'Multiple identical reviews posted' },
    { id: 4, type: 'User', content: 'Harassment in user profile', reporter: 'Customer001', priority: 'high', status: 'pending', date: '2024-01-12', reportedContent: 'User profile contains harassing content' },
  ]

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const getTypeColor = (type) => {
    switch (type) {
      case 'Review': return 'blue'
      case 'Product': return 'purple'
      case 'User': return 'red'
      default: return 'gray'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Review': return MessageSquare
      case 'Product': return Package
      case 'User': return AlertTriangle
      default: return Flag
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange'
      case 'investigating': return 'blue'
      case 'resolved': return 'green'
      case 'dismissed': return 'gray'
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
        bgGradient="linear(to-r, red.500, pink.500)"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              Reported Content
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Review and handle user reports to maintain platform safety.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {reportStats.map((stat, index) => (
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
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Reports List */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Reports ({filteredReports.length})
          </Heading>
          <VStack spacing={4} align="stretch">
            {filteredReports.map((report) => {
              const TypeIcon = getTypeIcon(report.type)
              return (
                <Card key={report.id} borderRadius="lg" shadow="sm" border="1px solid" borderColor="red.200">
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between" align="start">
                        <HStack spacing={4}>
                          <Box
                            p={2}
                            borderRadius="full"
                            bg={`${getTypeColor(report.type)}.100`}
                            color={`${getTypeColor(report.type)}.600`}
                          >
                            <Icon as={TypeIcon} w={5} h={5} />
                          </Box>
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Badge colorScheme={getTypeColor(report.type)} borderRadius="full">
                                {report.type}
                              </Badge>
                              <Badge colorScheme={getPriorityColor(report.priority)} borderRadius="full">
                                {report.priority} priority
                              </Badge>
                              <Badge colorScheme={getStatusColor(report.status)} borderRadius="full">
                                {report.status}
                              </Badge>
                            </HStack>
                            <Text fontWeight="semibold" color="gray.800">
                              {report.content}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Reported by {report.reporter}
                            </Text>
                          </VStack>
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {report.date}
                        </Text>
                      </HStack>

                      <Box p={3} bg="red.50" borderRadius="lg">
                        <Text fontSize="sm" color="gray.700" fontWeight="semibold">
                          Reported Content:
                        </Text>
                        <Text fontSize="sm" color="gray.600" mt={1}>
                          {report.reportedContent}
                        </Text>
                      </Box>

                      <HStack spacing={2} justify="end">
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Eye} w={4} h={4} mr={2} />
                          Investigate
                        </Button>
                        {report.status === 'pending' && (
                          <>
                            <Button size="sm" colorScheme="green" borderRadius="lg">
                              <Icon as={CheckCircle} w={4} h={4} mr={2} />
                              Dismiss
                            </Button>
                            <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                              <Icon as={XCircle} w={4} h={4} mr={2} />
                              Remove Content
                            </Button>
                          </>
                        )}
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

export default ModeratorReports
