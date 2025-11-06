import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, Alert, AlertIcon, Link, Select, HStack, Divider, Textarea } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/common/Layout'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    phone: '',
    address: '',
    // Vendor specific fields
    storeName: '',
    storeDescription: '',
    businessLicense: '',
    taxId: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address
      }

      // Add vendor-specific fields if role is vendor
      if (formData.role === 'vendor') {
        userData.storeName = formData.storeName
        userData.storeDescription = formData.storeDescription
        userData.businessLicense = formData.businessLicense
        userData.taxId = formData.taxId
      }

      await register(userData)
      navigate('/auth/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showFooter={false}>
      <Box maxW="md" mx="auto" mt={8}>
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Create Account
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
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </FormControl>

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
                <FormLabel>Role</FormLabel>
                <Select name="role" value={formData.role} onChange={handleChange}>
                  <option value="customer">Customer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="delivery">Delivery Agent</option>
                  <option value="inventory">Inventory Manager</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </FormControl>

              {/* Vendor-specific fields */}
              {formData.role === 'vendor' && (
                <>
                  <Divider />
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Vendor Information
                  </Text>

                  <FormControl isRequired>
                    <FormLabel>Store Name</FormLabel>
                    <Input
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="Enter your store name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Store Description</FormLabel>
                    <Textarea
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleChange}
                      placeholder="Describe your store"
                      rows={3}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Business License</FormLabel>
                    <Input
                      name="businessLicense"
                      value={formData.businessLicense}
                      onChange={handleChange}
                      placeholder="Enter your business license number"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Tax ID</FormLabel>
                    <Input
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      placeholder="Enter your tax ID"
                    />
                  </FormControl>
                </>
              )}

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

              <FormControl isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Creating account..."
              >
                Create Account
              </Button>
            </VStack>
          </Box>

          <HStack spacing={2}>
            <Text>Already have an account?</Text>
            <Link as={RouterLink} to="/auth/login" color="purple.600">
              Sign in
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Layout>
  )
}

export default Register
