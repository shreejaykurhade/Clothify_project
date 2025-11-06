import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react'
import { Store, Search, Filter, Edit, Trash2, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const AdminVendors = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const vendorStats = [
    {
      label: 'Total Vendors',
      value: '89',
      icon: Store,
      color: 'green',
      change: '+8%',
      changeType: 'increase',
    },
    {
      label: 'Active Vendors',
      value: '76',
      icon: CheckCircle,
      color: 'green',
      change: '+5%',
      changeType: 'increase',
    },
    {
      label: 'Pending Approvals',
      value: '13',
      icon: Clock,
      color: 'orange',
      change: '+2',
      changeType: 'increase',
    },
  ]

  const vendors = [
    { id: 1, name: 'TechStore Pro', owner: 'John Smith', email: 'john@techstore.com', status: 'approved', products: 45, joinDate: '2024-01-15' },
    { id: 2, name: 'Fashion Hub', owner: 'Sarah Johnson', email: 'sarah@fashionhub.com', status: 'pending', products: 0, joinDate: '2024-01-13' },
    { id: 3, name: 'Gadget World', owner: 'Mike Davis', email: 'mike@gadgetworld.com', status: 'approved', products: 32, joinDate: '2024-01-10' },
    { id: 4, name: 'Style Central', owner: 'Emma Wilson', email: 'emma@stylecentral.com', status: 'rejected', products: 0, joinDate: '2024-01-08' },
  ]

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || vendor.status === filterStatus
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
      case 'pending': return Clock
      case 'rejected': return XCircle
      default: return Clock
    }
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
              Vendor Management
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Review and manage vendor applications and accounts.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {vendorStats.map((stat, index) => (
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
                placeholder="Search vendors..."
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

      {/* Vendors Table */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Vendors ({filteredVendors.length})
          </Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Store Name</Th>
                  <Th>Owner</Th>
                  <Th>Email</Th>
                  <Th>Status</Th>
                  <Th>Products</Th>
                  <Th>Join Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredVendors.map((vendor) => {
                  const StatusIcon = getStatusIcon(vendor.status)
                  return (
                    <Tr key={vendor.id}>
                      <Td>
                        <HStack>
                          <Avatar size="sm" name={vendor.name} />
                          <Text fontWeight="semibold">{vendor.name}</Text>
                        </HStack>
                      </Td>
                      <Td>{vendor.owner}</Td>
                      <Td>{vendor.email}</Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(vendor.status)} borderRadius="full">
                          <HStack spacing={1}>
                            <Icon as={StatusIcon} w={3} h={3} />
                            <Text>{vendor.status}</Text>
                          </HStack>
                        </Badge>
                      </Td>
                      <Td>{vendor.products}</Td>
                      <Td>{vendor.joinDate}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                            <Icon as={Eye} w={4} h={4} />
                          </Button>
                          {vendor.status === 'pending' && (
                            <>
                              <Button size="sm" colorScheme="green" borderRadius="lg">
                                Approve
                              </Button>
                              <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                                Reject
                              </Button>
                            </>
                          )}
                          {vendor.status === 'approved' && (
                            <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                              <Icon as={Trash2} w={4} h={4} />
                            </Button>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default AdminVendors
