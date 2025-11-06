import { Box, Container, Heading, Text, Button, Flex, Image, VStack, HStack, Icon, SimpleGrid } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Store, ShieldCheck } from 'lucide-react'

const MotionBox = motion(Box)
const MotionFlex = motion(Flex)

const HomePage = () => {
  const navigate = useNavigate()

  return (
    <Box bgGradient="linear(to-br, purple.50, blue.50, pink.50)" minH="100vh">
      {/* Navbar */}
      <Flex
        as="nav"
        px={8}
        py={4}
        align="center"
        justify="space-between"
        bg="whiteAlpha.900"
        boxShadow="sm"
        position="sticky"
        top="0"
        zIndex="100"
      >
        <Heading
          size="lg"
          bgGradient="linear(to-r, purple.600, blue.600)"
          bgClip="text"
          fontWeight="extrabold"
        >
          Clothify
        </Heading>

        <HStack spacing={4}>
          <Button variant="ghost" colorScheme="purple" onClick={() => navigate('/auth/login')}>
            Login
          </Button>
          <Button colorScheme="purple" onClick={() => navigate('/auth/register')}>
            Register
          </Button>
        </HStack>
      </Flex>

      {/* Hero Section */}
      <MotionFlex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        px={{ base: 6, md: 16 }}
        py={{ base: 12, md: 24 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <VStack align="start" spacing={6} maxW="lg">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, purple.600, blue.600)"
            bgClip="text"
            lineHeight="shorter"
          >
            Shop. Sell. Manage.
          </Heading>
          <Text fontSize="xl" color="gray.600">
            A next-generation multi-role ecommerce experience for customers, vendors, and admins.
          </Text>
          <HStack spacing={4}>
            <Button colorScheme="purple" size="lg" onClick={() => navigate('/auth/register')}>
              Get Started
            </Button>
            <Button
              variant="outline"
              colorScheme="purple"
              size="lg"
              onClick={() => navigate('/auth/login')}
            >
              Sign In
            </Button>
          </HStack>
        </VStack>

        <MotionBox
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          mt={{ base: 10, md: 0 }}
        >
          <Image
            src="https://img.freepik.com/premium-vector/ecommerce-fashion-banner-template_498307-504.jpg?w=2000"
            alt="Shopping illustration"
            maxW={{ base: '100%', md: '1500px' }}
            borderRadius="2xl"
            boxShadow="xl"
          />
        </MotionBox>
      </MotionFlex>

      {/* Features Section */}
      <Container maxW="6xl" py={20}>
        <MotionBox
          textAlign="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          mb={12}
        >
          <Heading size="xl" color="gray.800" mb={2}>
            Why Choose Clothify?
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Designed for everyone — customers, vendors, and admins alike.
          </Text>
        </MotionBox>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
          {[
            {
              icon: ShoppingCart,
              title: 'Seamless Shopping',
              desc: 'Explore thousands of products with smooth checkout and real-time tracking.',
              color: 'purple.500',
            },
            {
              icon: Store,
              title: 'Empowered Vendors',
              desc: 'Easily manage products, track sales, and monitor store performance.',
              color: 'blue.500',
            },
            {
              icon: ShieldCheck,
              title: 'Admin Control',
              desc: 'Powerful tools for analytics, user management, and overall system security.',
              color: 'pink.500',
            },
          ].map((feature, index) => (
            <MotionBox
              key={index}
              p={8}
              bg="white"
              borderRadius="2xl"
              boxShadow="lg"
              textAlign="center"
              whileHover={{ y: -6, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                mx="auto"
                mb={6}
                w={16}
                h={16}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={`${feature.color}15`}
                borderRadius="full"
              >
                <Icon as={feature.icon} w={8} h={8} color={feature.color} />
              </Box>
              <Heading size="md" mb={3}>
                {feature.title}
              </Heading>
              <Text color="gray.600" fontSize="sm">
                {feature.desc}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="whiteAlpha.900" py={10} textAlign="center" borderTop="1px" borderColor="gray.200">
        <Text color="gray.500" fontSize="sm">
          © {new Date().getFullYear()} Clothify. All rights reserved.
        </Text>
      </Box>
    </Box>
  )
}

export default HomePage
