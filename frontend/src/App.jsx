import { Routes, Route, Navigate } from 'react-router-dom'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Common Components
import Layout from './components/common/Layout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Customer Pages
import HomePage from './pages/HomePage'
import CustomerCatalog from './pages/customer/Catalog'
import CustomerProductDetails from './pages/customer/ProductDetails'
import CustomerCart from './pages/customer/Cart'
import CustomerCheckout from './pages/customer/Checkout'
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerOrders from './pages/customer/Orders'
import CustomerWishlist from './pages/customer/Wishlist'

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard'
import AddProduct from './pages/vendor/AddProduct'
import Products from './pages/vendor/Products'
import Orders from './pages/vendor/Orders'
import Analytics from './pages/vendor/Analytics'

// Admin Pages
import AdminUsers from './pages/admin/Users'
import AdminVendors from './pages/admin/Vendors'
import AdminProducts from './pages/admin/Products'
import AdminApprovals from './pages/admin/Approvals'
import AdminDashboard from './pages/admin/Dashboard'

// Moderator Pages
import ModeratorDashboard from './pages/moderator/Dashboard'
import ModeratorReviews from './pages/moderator/Reviews'
import ModeratorQueue from './pages/moderator/Queue'
import ModeratorReports from './pages/moderator/Reports'
import ModeratorAnalytics from './pages/moderator/Analytics'

// Delivery Pages
import DeliveryDashboard from './pages/delivery/Dashboard'
import DeliveryOrders from './pages/delivery/Orders'
import DeliveryPerformance from './pages/delivery/Performance'

// Inventory Pages
import InventoryDashboard from './pages/inventory/Dashboard'
import InventoryProducts from './pages/inventory/Products'
import InventoryReports from './pages/inventory/Reports'


// Theme configuration
const theme = extendTheme({
  colors: {
    brand: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
})

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRoutes = {
      customer: '/customer/dashboard',
      vendor: '/vendor/dashboard',
      admin: '/admin/dashboard',
      moderator: '/moderator/dashboard',
      inventory: '/inventory/dashboard',
      delivery: '/delivery/dashboard'
    }
    return <Navigate to={roleRoutes[user.role] || '/'} replace />
  }

  return children
}

// Role-based Route Component
const RoleRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (!user || user.role !== role) {
    return <Navigate to="/auth/login" replace />
  }

  return children
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />

              {/* Customer Routes */}
              <Route
                path="/customer/catalog"
                element={
                  <Layout role="customer">
                    <CustomerCatalog />
                  </Layout>
                }
              />
              <Route
                path="/customer/product/:productId"
                element={
                  <Layout role="customer">
                    <CustomerProductDetails />
                  </Layout>
                }
              />
              <Route
                path="/customer/cart"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Layout role="customer">
                      <CustomerCart />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/checkout"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Layout role="customer">
                      <CustomerCheckout />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Layout role="customer">
                      <CustomerDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/orders"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Layout role="customer">
                      <CustomerOrders />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/wishlist"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <Layout role="customer">
                      <CustomerWishlist />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <Layout role="vendor">
                      <VendorDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/products/add"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <Layout role="vendor">
                      <AddProduct />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/products"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <Layout role="vendor">
                      <Products />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/orders"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <Layout role="vendor">
                      <Orders />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor/analytics"
                element={
                  <ProtectedRoute allowedRoles={['vendor']}>
                    <Layout role="vendor">
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <AdminDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <AdminUsers />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/vendors"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <AdminVendors />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <AdminProducts />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <div>Reports - Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <AdminApprovals />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/activity"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <div>Recent Activity - Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/system"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Layout role="admin">
                      <div>System Alerts - Coming Soon</div>
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Moderator Routes */}
              <Route
                path="/moderator/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['moderator']}>
                    <Layout role="moderator">
                      <ModeratorDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderator/reviews"
                element={
                  <ProtectedRoute allowedRoles={['moderator']}>
                    <Layout role="moderator">
                      <ModeratorReviews />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderator/queue"
                element={
                  <ProtectedRoute allowedRoles={['moderator']}>
                    <Layout role="moderator">
                      <ModeratorQueue />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderator/reports"
                element={
                  <ProtectedRoute allowedRoles={['moderator']}>
                    <Layout role="moderator">
                      <ModeratorReports />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/moderator/analytics"
                element={
                  <ProtectedRoute allowedRoles={['moderator']}>
                    <Layout role="moderator">
                      <ModeratorAnalytics />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Inventory Routes */}
              <Route
                path="/inventory/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['inventory']}>
                    <Layout role="inventory">
                      <InventoryDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/products"
                element={
                  <ProtectedRoute allowedRoles={['inventory']}>
                    <Layout role="inventory">
                      <InventoryProducts />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory/reports"
                element={
                  <ProtectedRoute allowedRoles={['inventory']}>
                    <Layout role="inventory">
                      <InventoryReports />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Delivery Routes */}
              <Route
                path="/delivery/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <Layout role="delivery">
                      <DeliveryDashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery/orders"
                element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <Layout role="delivery">
                      <DeliveryOrders />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery/performance"
                element={
                  <ProtectedRoute allowedRoles={['delivery']}>
                    <Layout role="delivery">
                      <DeliveryPerformance />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
