import { Box, Container } from '@chakra-ui/react'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children, title, showFooter = true, role }) => {
  const { user } = useAuth()

  // Different container settings for different roles
  const getContainerProps = () => {
    switch (role) {
      case 'vendor':
        return { maxW: '1400px', py: 6 }
      case 'admin':
      case 'moderator':
        return { maxW: '1200px', py: 8 }
      default:
        return { maxW: '1200px', py: 8 }
    }
  }

  const containerProps = getContainerProps()

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Navbar */}
      <Navbar role={role} />

      {/* Main Content */}
      <Box as="main" flex="1">
        <Container {...containerProps}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      {showFooter && <Footer />}
    </Box>
  )
}

export default Layout
