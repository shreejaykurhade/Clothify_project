import { Box, Grid, Card, CardBody, Heading, Text, VStack, HStack, Icon, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, SimpleGrid, Badge, Progress, Divider, Avatar, AvatarGroup, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react'
import { Users, Search, Filter, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const MotionCard = motion(Card)

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const userStats = [
    {
      label: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'blue',
      change: '+15%',
      changeType: 'increase',
    },
    {
      label: 'Active Users',
      value: '1,156',
      icon: UserCheck,
      color: 'green',
      change: '+12%',
      changeType: 'increase',
    },
    {
      label: 'Inactive Users',
      value: '78',
      icon: UserX,
      color: 'red',
      change: '-5%',
      changeType: 'decrease',
    },
  ]

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'vendor', status: 'active', joinDate: '2024-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', status: 'inactive', joinDate: '2024-01-05' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'moderator', status: 'active', joinDate: '2024-01-01' },
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const getStatusColor = (status) => status === 'active' ? 'green' : 'red'
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'red'
      case 'moderator': return 'orange'
      case 'vendor': return 'blue'
      case 'customer': return 'green'
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
        bgGradient="linear(to-r, blue.500, purple.500)"
        color="white"
        borderRadius="2xl"
      >
        <CardBody p={8}>
          <VStack align="start" spacing={4}>
            <Heading size="lg">
              User Management
            </Heading>
            <Text fontSize="lg" opacity={0.9}>
              Manage all users across the Clothify platform.
            </Text>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {userStats.map((stat, index) => (
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
              />
            </InputGroup>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              maxW="200px"
              borderRadius="lg"
            >
              <option value="all">All Roles</option>
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </Select>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Users Table */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        borderRadius="xl"
        shadow="md"
      >
        <CardBody>
          <Heading size="lg" mb={6} color="gray.800">
            Users ({filteredUsers.length})
          </Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Join Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={user.name} />
                        <Text fontWeight="semibold">{user.name}</Text>
                      </HStack>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={getRoleColor(user.role)} borderRadius="full">
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(user.status)} borderRadius="full">
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>{user.joinDate}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button size="sm" colorScheme="blue" variant="outline" borderRadius="lg">
                          <Icon as={Edit} w={4} h={4} />
                        </Button>
                        <Button size="sm" colorScheme="red" variant="outline" borderRadius="lg">
                          <Icon as={Trash2} w={4} h={4} />
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </MotionCard>
    </VStack>
  )
}

export default AdminUsers