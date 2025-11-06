import { Box, Flex, HStack, VStack, Text, Button, IconButton, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Avatar, Menu, MenuButton, MenuList, MenuItem, Badge } from '@chakra-ui/react'
import { Menu as MenuIcon, ShoppingCart, Heart, User, Search, LogOut } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const Navbar = ({ role }) => {
  const { user, logout, isAuthenticated } = useAuth()
  const { getTotalItems } = useCart()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    { label: 'Home', path: '/', roles: ['all'] },
    { label: 'Catalog', path: '/customer/catalog', roles: ['customer'] },
    { label: 'Orders', path: '/customer/orders', roles: ['customer'] },
    { label: 'Wishlist', path: '/customer/wishlist', roles: ['customer'] },
    { label: 'Dashboard', path: `/${role}/dashboard`, roles: ['vendor', 'admin', 'moderator', 'inventory', 'delivery'] },
  ]

  const filteredNavItems = navigationItems.filter(item =>
    item.roles.includes('all') || item.roles.includes(role)
  )

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <MotionBox
      as="header"
      bg="white"
      shadow="sm"
      position="sticky"
      top="0"
      zIndex="10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Flex align="center" justify="space-between" px={6} py={4} maxW="1200px" mx="auto">
        {/* Logo */}
        <Link to="/">
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            Clothify
          </Text>
        </Link>

        {/* Desktop Navigation */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {filteredNavItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Text
                fontWeight={location.pathname === item.path ? 'bold' : 'medium'}
                color={location.pathname === item.path ? 'purple.600' : 'gray.700'}
                _hover={{ color: 'purple.600' }}
                transition="color 0.2s"
              >
                {item.label}
              </Text>
            </Link>
          ))}
        </HStack>

        {/* User Actions */}
        <HStack spacing={4}>
          {isAuthenticated ? (
            <>
              {/* Cart Icon (for customers) */}
              {role === 'customer' && (
                <Link to="/customer/cart">
                  <Button variant="ghost" position="relative">
                    <ShoppingCart size={20} />
                    {getTotalItems() > 0 && (
                      <Badge
                        position="absolute"
                        top="-2"
                        right="-2"
                        bg="purple.600"
                        color="white"
                        borderRadius="full"
                        fontSize="xs"
                        minW="20px"
                        h="20px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )}

              {/* User Menu */}
              <Menu>
                <MenuButton
                  as={Button}
                  variant="ghost"
                  borderRadius="full"
                  p={2}
                >
                  <Avatar size="sm" name={user?.name} src={user?.avatar} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<User size={16} />}>
                    Profile
                  </MenuItem>
                  <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <Link to="/auth/login">
              <Button colorScheme="purple" variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            icon={<MenuIcon />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Open menu"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Clothify</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {filteredNavItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={onClose}>
                  <Text
                    py={2}
                    px={4}
                    borderRadius="md"
                    bg={location.pathname === item.path ? 'purple.100' : 'transparent'}
                    color={location.pathname === item.path ? 'purple.600' : 'gray.700'}
                    _hover={{ bg: 'purple.50' }}
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}

              {isAuthenticated && (
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  onClick={handleLogout}
                  leftIcon={<LogOut size={16} />}
                >
                  Logout
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </MotionBox>
  )
}

export default Navbar