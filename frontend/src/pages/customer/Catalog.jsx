import { useState, useEffect } from 'react'
import { Box, Grid, Input, InputGroup, InputLeftElement, Select, VStack, HStack, Text, Badge, Button, useToast } from '@chakra-ui/react'
import { Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../../components/customer/ProductCard'

// Static product data
const staticProducts = [
  {
    _id: '1',
    name: 'Classic White T-Shirt',
    description: 'Comfortable cotton t-shirt perfect for everyday wear. Made from 100% organic cotton with a relaxed fit.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Clothing',
    subcategory: 'tops',
    brand: 'ComfortWear',
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'White T-Shirt Front' },
      { url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500', alt: 'White T-Shirt Back' }
    ],
    stock: 50,
    sku: 'CWT-001',
    tags: ['cotton', 'basic', 'casual'],
    attributes: {
      size: ['S', 'M', 'L', 'XL'],
      color: ['White', 'Black', 'Gray'],
      material: ['Cotton']
    },
    variants: [
      { name: 'Size', value: 'M', priceModifier: 0, stock: 20 },
      { name: 'Color', value: 'White', priceModifier: 0, stock: 30 }
    ],
    isActive: true,
    isApproved: true,
    isFeatured: true,
    isTrending: true,
    isDiscounted: true,
    discountPercentage: 25,
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 2 },
    seo: {
      metaTitle: 'Classic White T-Shirt - ComfortWear',
      metaDescription: 'Buy our comfortable cotton t-shirt. Perfect for everyday wear with 25% discount.',
      slug: 'classic-white-t-shirt'
    },
    ratings: { average: 4.5, count: 12 },
    salesCount: 25,
    viewCount: 150
  },
  {
    _id: '2',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers.',
    price: 199.99,
    category: 'Electronics',
    subcategory: 'audio',
    brand: 'SoundTech',
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Bluetooth Headphones' }
    ],
    stock: 30,
    sku: 'WBH-002',
    tags: ['wireless', 'bluetooth', 'noise-cancelling'],
    attributes: {
      color: ['Black', 'White', 'Blue']
    },
    isActive: true,
    isApproved: true,
    isFeatured: true,
    weight: 0.3,
    dimensions: { length: 20, width: 18, height: 8 },
    seo: {
      metaTitle: 'Wireless Bluetooth Headphones - SoundTech',
      metaDescription: 'Experience premium sound with our wireless noise-cancelling headphones.',
      slug: 'wireless-bluetooth-headphones'
    },
    ratings: { average: 4.8, count: 8 },
    salesCount: 15,
    viewCount: 200
  },
  {
    _id: '3',
    name: 'Elegant Evening Dress',
    description: 'Stunning evening dress perfect for special occasions. Made from premium silk with intricate embroidery.',
    price: 299.99,
    category: 'Clothing',
    subcategory: 'dresses',
    brand: 'Elegance',
    images: [
      { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', alt: 'Evening Dress' }
    ],
    stock: 15,
    sku: 'EED-003',
    tags: ['evening', 'formal', 'silk'],
    attributes: {
      size: ['XS', 'S', 'M', 'L'],
      color: ['Red', 'Black', 'Navy']
    },
    isActive: true,
    isApproved: true,
    isTrending: true,
    weight: 0.8,
    dimensions: { length: 120, width: 40, height: 5 },
    seo: {
      metaTitle: 'Elegant Evening Dress - Elegance',
      metaDescription: 'Make a statement with our stunning evening dress collection.',
      slug: 'elegant-evening-dress'
    },
    ratings: { average: 4.7, count: 6 },
    salesCount: 8,
    viewCount: 120
  },
  {
    _id: '4',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology. Perfect for athletes and fitness enthusiasts.',
    price: 149.99,
    originalPrice: 179.99,
    category: 'Shoes',
    subcategory: 'footwear',
    brand: 'RunFit',
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', alt: 'Running Shoes' }
    ],
    stock: 40,
    sku: 'RS-004',
    tags: ['running', 'athletic', 'cushioning'],
    attributes: {
      size: ['7', '8', '9', '10', '11'],
      color: ['Black', 'White', 'Blue']
    },
    isActive: true,
    isApproved: true,
    isDiscounted: true,
    discountPercentage: 17,
    weight: 0.4,
    dimensions: { length: 32, width: 20, height: 12 },
    seo: {
      metaTitle: 'Running Shoes - RunFit',
      metaDescription: 'Get the best running shoes with advanced cushioning technology.',
      slug: 'running-shoes'
    },
    ratings: { average: 4.3, count: 15 },
    salesCount: 22,
    viewCount: 180
  },
  {
    _id: '5',
    name: 'Leather Crossbody Bag',
    description: 'Stylish leather crossbody bag with multiple compartments. Perfect for everyday use and travel.',
    price: 89.99,
    category: 'Accessories',
    subcategory: 'crossbody',
    brand: 'LeatherCraft',
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', alt: 'Crossbody Bag' }
    ],
    stock: 25,
    sku: 'LCB-005',
    tags: ['leather', 'crossbody', 'stylish'],
    attributes: {
      color: ['Brown', 'Black', 'Tan']
    },
    isActive: true,
    isApproved: true,
    weight: 0.6,
    dimensions: { length: 25, width: 15, height: 20 },
    seo: {
      metaTitle: 'Leather Crossbody Bag - LeatherCraft',
      metaDescription: 'Carry your essentials in style with our premium leather crossbody bags.',
      slug: 'leather-crossbody-bag'
    },
    ratings: { average: 4.6, count: 9 },
    salesCount: 12,
    viewCount: 95
  },
  {
    _id: '6',
    name: 'Kids Winter Jacket',
    description: 'Warm and cozy winter jacket for kids with waterproof material and fun designs.',
    price: 79.99,
    category: 'Clothing',
    subcategory: 'outerwear',
    brand: 'KidComfort',
    images: [
      { url: 'https://images.unsplash.com/photo-1503944168849-c1246463e59?w=500', alt: 'Kids Winter Jacket' }
    ],
    stock: 35,
    sku: 'KWJ-006',
    tags: ['winter', 'kids', 'waterproof'],
    attributes: {
      size: ['2T', '3T', '4T', '5T'],
      color: ['Blue', 'Pink', 'Green']
    },
    isActive: true,
    isApproved: true,
    weight: 0.7,
    dimensions: { length: 50, width: 35, height: 5 },
    seo: {
      metaTitle: 'Kids Winter Jacket - KidComfort',
      metaDescription: 'Keep your kids warm and stylish this winter with our waterproof jackets.',
      slug: 'kids-winter-jacket'
    },
    ratings: { average: 4.4, count: 11 },
    salesCount: 18,
    viewCount: 140
  },
  {
    _id: '7',
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health monitoring, GPS, and long battery life.',
    price: 249.99,
    category: 'Electronics',
    subcategory: 'wearables',
    brand: 'TechLife',
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch' }
    ],
    stock: 20,
    sku: 'SW-007',
    tags: ['smartwatch', 'health', 'GPS'],
    attributes: {
      color: ['Black', 'Silver', 'Gold']
    },
    isActive: true,
    isApproved: true,
    isFeatured: true,
    weight: 0.1,
    dimensions: { length: 4, width: 4, height: 1 },
    seo: {
      metaTitle: 'Smart Watch - TechLife',
      metaDescription: 'Stay connected and monitor your health with our advanced smartwatch.',
      slug: 'smart-watch'
    },
    ratings: { average: 4.2, count: 14 },
    salesCount: 10,
    viewCount: 300
  },
  {
    _id: '8',
    name: 'Home Decor Vase',
    description: 'Elegant ceramic vase perfect for home decoration. Handcrafted with attention to detail.',
    price: 45.99,
    category: 'Home & Garden',
    subcategory: 'decor',
    brand: 'HomeStyle',
    images: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Decor Vase' }
    ],
    stock: 18,
    sku: 'HDV-008',
    tags: ['ceramic', 'decor', 'handcrafted'],
    attributes: {
      color: ['White', 'Blue', 'Green']
    },
    isActive: true,
    isApproved: true,
    weight: 1.2,
    dimensions: { length: 15, width: 15, height: 30 },
    seo: {
      metaTitle: 'Home Decor Vase - HomeStyle',
      metaDescription: 'Add elegance to your home with our handcrafted ceramic vases.',
      slug: 'home-decor-vase'
    },
    ratings: { average: 4.1, count: 7 },
    salesCount: 9,
    viewCount: 85
  }
]

const Catalog = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [categories, setCategories] = useState([])
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [searchTerm, category, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Simulate API delay for now
      await new Promise(resolve => setTimeout(resolve, 500))

      let filteredProducts = [...staticProducts]

      // Apply search filter
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply category filter
      if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category)
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name)
          case 'price_asc':
            return a.price - b.price
          case 'price_desc':
            return b.price - a.price
          case 'rating':
            return (b.ratings?.average || 0) - (a.ratings?.average || 0)
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
          default:
            return 0
        }
      })

      setProducts(filteredProducts)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      // Extract unique categories from static products
      const uniqueCategories = [...new Set(staticProducts.map(product => product.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleProductClick = (productId) => {
    navigate(`/customer/product/${productId}`)
  }

  return (
    <VStack spacing={6} align="stretch" w="full" maxW="100%">
      {/* Search and Filters */}
      <Box>
        <VStack spacing={4}>
          <InputGroup maxW="md">
            <InputLeftElement pointerEvents="none">
              <Search color="gray" size={20} />
            </InputLeftElement>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              bg="white"
            />
          </InputGroup>

          <HStack spacing={4} w="full" flexWrap="wrap">
            <Select
              placeholder="All Categories"
              value={category}
              onChange={handleCategoryChange}
              maxW="200px"
              bg="white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Select
              value={sortBy}
              onChange={handleSortChange}
              maxW="200px"
              bg="white"
            >
              <option value="name">Name A-Z</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </Select>
          </HStack>
        </VStack>
      </Box>

      {/* Results Count */}
      <HStack justify="space-between" align="center">
        <Text color="gray.600">
          {loading ? 'Loading...' : `${products.length} products found`}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="purple" variant="subtle">
            {category || 'All Categories'}
          </Badge>
        </HStack>
      </HStack>

      {/* Products Grid */}
      {loading ? (
        <Box textAlign="center" py={12}>
          <Text>Loading products...</Text>
        </Box>
      ) : products.length === 0 ? (
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="gray.500">
            No products found matching your criteria.
          </Text>
          <Button
            mt={4}
            colorScheme="purple"
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setCategory('')
            }}
          >
            Clear Filters
          </Button>
        </Box>
      ) : (
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)'
          }}
          gap={6}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => handleProductClick(product._id)}
            />
          ))}
        </Grid>
      )}
    </VStack>
  )
}

export default Catalog