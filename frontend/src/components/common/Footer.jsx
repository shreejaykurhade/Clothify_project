import { Box, Container, Grid, VStack, HStack, Text, Link, Icon, Divider } from '@chakra-ui/react'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <Box as="footer" bg="gray.900" color="white" mt={16}>
      <Container maxW="1200px" py={12}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={8}>
          {/* Company Info */}
          <VStack align="start" spacing={4}>
            <Text fontSize="2xl" fontWeight="bold" color="purple.400">
              Clothify
            </Text>
            <Text color="gray.300" lineHeight="tall">
              Your premier destination for fashion and lifestyle products.
              Discover the latest trends and express your unique style.
            </Text>
            <HStack spacing={4}>
              <Icon as={Facebook} w={5} h={5} cursor="pointer" _hover={{ color: 'purple.400' }} />
              <Icon as={Twitter} w={5} h={5} cursor="pointer" _hover={{ color: 'purple.400' }} />
              <Icon as={Instagram} w={5} h={5} cursor="pointer" _hover={{ color: 'purple.400' }} />
              <Icon as={Youtube} w={5} h={5} cursor="pointer" _hover={{ color: 'purple.400' }} />
            </HStack>
          </VStack>

          {/* Quick Links */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="semibold" color="white">
              Quick Links
            </Text>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>About Us</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Contact</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>FAQ</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Shipping Info</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Returns</Link>
          </VStack>

          {/* Customer Service */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="semibold" color="white">
              Customer Service
            </Text>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>My Account</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Order Tracking</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Size Guide</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Gift Cards</Link>
            <Link color="gray.300" _hover={{ color: 'purple.400' }}>Store Locator</Link>
          </VStack>

          {/* Contact Info */}
          <VStack align="start" spacing={3}>
            <Text fontSize="lg" fontWeight="semibold" color="white">
              Contact Us
            </Text>
            <HStack>
              <Icon as={Mail} w={4} h={4} color="purple.400" />
              <Text color="gray.300">support@clothify.com</Text>
            </HStack>
            <HStack>
              <Icon as={Phone} w={4} h={4} color="purple.400" />
              <Text color="gray.300">1-800-CLOTHIFY</Text>
            </HStack>
            <HStack>
              <Icon as={MapPin} w={4} h={4} color="purple.400" />
              <Text color="gray.300">123 Fashion St, Style City, SC 12345</Text>
            </HStack>
          </VStack>
        </Grid>

        <Divider my={8} borderColor="gray.700" />

        {/* Bottom Section */}
        <HStack justify="space-between" align="center" flexWrap="wrap" spacing={4}>
          <Text color="gray.400" fontSize="sm">
            © 2024 Clothify. All rights reserved.
          </Text>
          <HStack spacing={6} flexWrap="wrap">
            <Link color="gray.400" _hover={{ color: 'purple.400' }} fontSize="sm">
              Privacy Policy
            </Link>
            <Link color="gray.400" _hover={{ color: 'purple.400' }} fontSize="sm">
              Terms of Service
            </Link>
            <Link color="gray.400" _hover={{ color: 'purple.400' }} fontSize="sm">
              Cookie Policy
            </Link>
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}

export default Footer
