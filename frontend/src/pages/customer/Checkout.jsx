import { useState, useEffect } from 'react'
import { Box, VStack, HStack, Text, Button, Card, CardBody, CardHeader, Heading, Divider, FormControl, FormLabel, Input, Select, Textarea, useToast, RadioGroup, Radio, Stack, Grid, Badge, Icon, Flex, Spacer, Image } from '@chakra-ui/react'
import { CreditCard, Truck, MapPin, Shield, Lock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/common/Layout'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { customerService } from '../../services/customerService'

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [orderNotes, setOrderNotes] = useState('')

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (items.length === 0) {
      navigate('/customer/cart')
    }
  }, [items, navigate])

  const handleShippingChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCardChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        items: items.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress,
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? cardDetails : null,
        orderNotes,
        subtotal,
        shipping,
        tax,
        total
      }

      const response = await customerService.createOrder(orderData)

      // Clear cart after successful order
      clearCart()

      toast({
        title: 'Order placed successfully!',
        description: 'You will receive a confirmation email shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      navigate('/customer/orders')
    } catch (error) {
      toast({
        title: 'Order failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
      <form onSubmit={handleSubmit}>
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Left Column - Forms */}
          <VStack spacing={6} align="stretch">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <MapPin size={20} />
                  <Heading size="md">Shipping Address</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={shippingAddress.name}
                      onChange={(e) => handleShippingChange('name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      value={shippingAddress.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Country</FormLabel>
                    <Select
                      value={shippingAddress.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                    >
                      <option value="USA">United States</option>
                      <option value="CAN">Canada</option>
                      <option value="MEX">Mexico</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired gridColumn={{ md: 'span 2' }}>
                    <FormLabel>Street Address</FormLabel>
                    <Input
                      value={shippingAddress.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      placeholder="Enter your street address"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="Enter your city"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>State</FormLabel>
                    <Input
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      placeholder="Enter your state"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>ZIP Code</FormLabel>
                    <Input
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      placeholder="Enter your ZIP code"
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Payment Method */}
            <Card border="2px solid" borderColor="blue.200" bg="gray.50">
              <CardHeader bg="blue.500" color="white" borderRadius="md">
                <Flex justify="space-between" align="center">
                  <HStack spacing={2}>
                    <Icon as={Shield} />
                    <Heading size="md">Secure Payment Gateway</Heading>
                  </HStack>
                  <HStack spacing={1}>
                    <Icon as={Lock} size={16} />
                    <Text fontSize="sm">SSL Encrypted</Text>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  {/* Payment Method Selection */}
                  <Box>
                    <Text fontWeight="semibold" mb={3}>Choose Payment Method</Text>
                    <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                      <Stack spacing={3}>
                        <Card
                          border={paymentMethod === 'card' ? '2px solid blue.500' : '1px solid gray.200'}
                          bg={paymentMethod === 'card' ? 'blue.50' : 'white'}
                          cursor="pointer"
                          onClick={() => setPaymentMethod('card')}
                          _hover={{ borderColor: 'blue.300' }}
                        >
                          <CardBody p={4}>
                            <Flex align="center" justify="space-between">
                              <HStack spacing={3}>
                                <Icon as={CreditCard} color="blue.500" />
                                <Box>
                                  <Text fontWeight="semibold">Credit/Debit Card</Text>
                                  <Text fontSize="sm" color="gray.600">Visa, MasterCard, American Express</Text>
                                </Box>
                              </HStack>
                              <Radio value="card" isChecked={paymentMethod === 'card'} />
                            </Flex>
                          </CardBody>
                        </Card>

                        <Card
                          border={paymentMethod === 'paypal' ? '2px solid blue.500' : '1px solid gray.200'}
                          bg={paymentMethod === 'paypal' ? 'blue.50' : 'white'}
                          cursor="pointer"
                          onClick={() => setPaymentMethod('paypal')}
                          _hover={{ borderColor: 'blue.300' }}
                        >
                          <CardBody p={4}>
                            <Flex align="center" justify="space-between">
                              <HStack spacing={3}>
                                <Box w={6} h={6} bg="blue.600" borderRadius="sm" display="flex" alignItems="center" justifyContent="center">
                                  <Text fontSize="xs" fontWeight="bold" color="white">P</Text>
                                </Box>
                                <Box>
                                  <Text fontWeight="semibold">PayPal</Text>
                                  <Text fontSize="sm" color="gray.600">Pay with your PayPal account</Text>
                                </Box>
                              </HStack>
                              <Radio value="paypal" isChecked={paymentMethod === 'paypal'} />
                            </Flex>
                          </CardBody>
                        </Card>

                        <Card
                          border={paymentMethod === 'cod' ? '2px solid blue.500' : '1px solid gray.200'}
                          bg={paymentMethod === 'cod' ? 'blue.50' : 'white'}
                          cursor="pointer"
                          onClick={() => setPaymentMethod('cod')}
                          _hover={{ borderColor: 'blue.300' }}
                        >
                          <CardBody p={4}>
                            <Flex align="center" justify="space-between">
                              <HStack spacing={3}>
                                <Icon as={Truck} color="green.500" />
                                <Box>
                                  <Text fontWeight="semibold">Cash on Delivery</Text>
                                  <Text fontSize="sm" color="gray.600">Pay when you receive your order</Text>
                                </Box>
                              </HStack>
                              <Radio value="cod" isChecked={paymentMethod === 'cod'} />
                            </Flex>
                          </CardBody>
                        </Card>
                      </Stack>
                    </RadioGroup>
                  </Box>

                  {/* Card Details Form */}
                  {paymentMethod === 'card' && (
                    <Card border="1px solid" borderColor="gray.300" bg="white">
                      <CardHeader bg="gray.100" borderBottom="1px solid" borderColor="gray.200">
                        <HStack spacing={2}>
                          <Icon as={CreditCard} />
                          <Heading size="sm">Card Details</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4}>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm" fontWeight="semibold">Card Number</FormLabel>
                            <Input
                              value={cardDetails.number}
                              onChange={(e) => handleCardChange('number', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              bg="white"
                              border="1px solid"
                              borderColor="gray.300"
                              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                            />
                          </FormControl>

                          <Grid templateColumns="1fr 1fr" gap={4}>
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" fontWeight="semibold">Expiry Date</FormLabel>
                              <Input
                                value={cardDetails.expiry}
                                onChange={(e) => handleCardChange('expiry', e.target.value)}
                                placeholder="MM/YY"
                                bg="white"
                                border="1px solid"
                                borderColor="gray.300"
                                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                              />
                            </FormControl>

                            <FormControl isRequired>
                              <FormLabel fontSize="sm" fontWeight="semibold">CVV</FormLabel>
                              <Input
                                value={cardDetails.cvv}
                                onChange={(e) => handleCardChange('cvv', e.target.value)}
                                placeholder="123"
                                bg="white"
                                border="1px solid"
                                borderColor="gray.300"
                                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                              />
                            </FormControl>
                          </Grid>

                          <FormControl isRequired>
                            <FormLabel fontSize="sm" fontWeight="semibold">Name on Card</FormLabel>
                            <Input
                              value={cardDetails.name}
                              onChange={(e) => handleCardChange('name', e.target.value)}
                              placeholder="Enter name on card"
                              bg="white"
                              border="1px solid"
                              borderColor="gray.300"
                              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                            />
                          </FormControl>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* PayPal Section */}
                  {paymentMethod === 'paypal' && (
                    <Card border="1px solid" borderColor="gray.300" bg="white">
                      <CardBody textAlign="center" py={8}>
                        <VStack spacing={4}>
                          <Box w={12} h={12} bg="blue.600" borderRadius="full" display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="lg" fontWeight="bold" color="white">P</Text>
                          </Box>
                          <Text fontWeight="semibold">You will be redirected to PayPal</Text>
                          <Text fontSize="sm" color="gray.600">Secure payment processing by PayPal</Text>
                          <Badge colorScheme="green" p={2}>
                            <HStack spacing={1}>
                              <Icon as={CheckCircle} size={12} />
                              <Text fontSize="xs">Verified & Secure</Text>
                            </HStack>
                          </Badge>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* COD Section */}
                  {paymentMethod === 'cod' && (
                    <Card border="1px solid" borderColor="gray.300" bg="white">
                      <CardBody textAlign="center" py={8}>
                        <VStack spacing={4}>
                          <Icon as={Truck} size={48} color="green.500" />
                          <Text fontWeight="semibold">Cash on Delivery</Text>
                          <Text fontSize="sm" color="gray.600">Pay in cash when your order is delivered</Text>
                          <Badge colorScheme="orange" p={2}>
                            <Text fontSize="xs">Additional fee may apply</Text>
                          </Badge>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Security Notice */}
                  <Box bg="green.50" p={4} borderRadius="md" border="1px solid" borderColor="green.200">
                    <HStack spacing={3}>
                      <Icon as={Shield} color="green.500" />
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" color="green.700">Secure Payment</Text>
                        <Text fontSize="xs" color="green.600">Your payment information is encrypted and secure</Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <Heading size="md">Order Notes (Optional)</Heading>
              </CardHeader>
              <CardBody>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows={3}
                />
              </CardBody>
            </Card>
          </VStack>

          {/* Right Column - Order Summary */}
          <Box position={{ lg: 'sticky' }} top={4}>
            <Card>
              <CardHeader>
                <HStack spacing={2}>
                  <Truck size={20} />
                  <Heading size="md">Order Summary</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  {/* Order Items */}
                  <VStack spacing={3} w="full" align="stretch">
                    {items.map((item) => (
                      <HStack key={item.id} justify="space-between" w="full">
                        <VStack align="start" spacing={0} flex={1}>
                          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                            {item.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Qty: {item.quantity}
                          </Text>
                        </VStack>
                        <Text fontSize="sm" fontWeight="semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Divider />

                  {/* Pricing Breakdown */}
                  <VStack spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text>Subtotal</Text>
                      <Text>${subtotal.toFixed(2)}</Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text>Shipping</Text>
                      <Text>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Text>
                    </HStack>

                    <HStack justify="space-between" w="full">
                      <Text>Tax</Text>
                      <Text>${tax.toFixed(2)}</Text>
                    </HStack>

                    <Divider />

                    <HStack justify="space-between" w="full">
                      <Text fontSize="lg" fontWeight="bold">Total</Text>
                      <Text fontSize="lg" fontWeight="bold" color="purple.600">
                        ${total.toFixed(2)}
                      </Text>
                    </HStack>
                  </VStack>

                  <Button
                    type="submit"
                    colorScheme="purple"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Placing order..."
                  >
                    Place Order
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      </form>
  )
}

export default Checkout
