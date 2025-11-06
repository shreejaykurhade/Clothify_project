import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Alert, AlertIcon, Link, HStack, Divider } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)

      // Redirect based on user role
      const user = JSON.parse(localStorage.getItem('user'))
      const roleRoutes = {
        customer: '/customer/dashboard',
        vendor: '/vendor/dashboard',
        admin: '/admin/dashboard',
        moderator: '/moderator/dashboard',
        inventory: '/inventory/dashboard',
        delivery: '/delivery/dashboard'
      }

      navigate(roleRoutes[user.role] || from)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Box maxW="md" mx="auto" p={8} bg="white" borderRadius="lg" shadow="lg">
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Welcome Back
          </Text>

          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit} w="full">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Signing in..."
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          <HStack spacing={2}>
            <Text>Don't have an account?</Text>
            <Link as={RouterLink} to="/auth/register" color="purple.600">
              Sign up
            </Link>
          </HStack>

          <Divider />

          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              Demo Accounts:
            </Text>
            <Text fontSize="xs" color="gray.500">
              Customer: customer@example.com / password123
            </Text>
            <Text fontSize="xs" color="gray.500">
              Vendor: vendor@example.com / password123
            </Text>
            <Text fontSize="xs" color="gray.500">
              Admin: admin@example.com / password123
            </Text>
            <Text fontSize="xs" color="gray.500">
              Moderator: moderator@example.com / password123
            </Text>
            <Text fontSize="xs" color="gray.500">
              Inventory: inventory@example.com / password123
            </Text>
            <Text fontSize="xs" color="gray.500">
              Delivery: delivery@example.com / password123
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
