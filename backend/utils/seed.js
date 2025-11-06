const mongoose = require('mongoose')
const Customer = require('../models/Customer')
const Vendor = require('../models/Vendor')
const Admin = require('../models/Admin')
const Moderator = require('../models/Moderator')
const DeliveryAgent = require('../models/DeliveryAgent')
const InventoryManager = require('../models/InventoryManager')
const Product = require('../models/Product')
const Cart = require('../models/Cart')
const Order = require('../models/Order')
const Review = require('../models/Review')
const Wishlist = require('../models/Wishlist')
const DeliveryStatus = require('../models/DeliveryStatus')
require('dotenv').config()

const customers = [
  {
    name: 'Demo Customer',
    email: 'customer@example.com',
    password: 'password123',
    phone: '+1234567890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1987654321',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '+1122334455',
    address: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    }
  }
]

const vendors = [
  {
    name: 'Fashion Hub',
    email: 'fashionhub@example.com',
    password: 'password123',
    phone: '+1555123456',
    storeName: 'Fashion Hub Inc.',
    storeDescription: 'Premium fashion store offering the latest trends in clothing and accessories.',
    businessLicense: 'BL123456789',
    taxId: 'FH123456789',
    isVerified: true,
    isApproved: true
  },
  {
    name: 'Tech Store',
    email: 'techstore@example.com',
    password: 'password123',
    phone: '+1444987654',
    storeName: 'Tech Store LLC',
    storeDescription: 'Leading technology store with cutting-edge electronics and gadgets.',
    businessLicense: 'BL987654321',
    taxId: 'TS987654321',
    isVerified: true,
    isApproved: true
  }
]

const admins = [
  {
    name: 'Demo Admin',
    email: 'admin@example.com',
    password: 'password123',
    phone: '+1333444555',
    permissions: ['all']
  }
]

const moderators = [
  {
    name: 'Demo Moderator',
    email: 'moderator@example.com',
    password: 'password123',
    phone: '+1666777888',
    permissions: ['review_moderation', 'user_management']
  }
]

const deliveryAgents = [
  {
    name: 'Demo Delivery Agent',
    email: 'delivery@example.com',
    password: 'password123',
    phone: '+1999888777',
    vehicleType: 'motorcycle',
    licenseNumber: 'DL123456789',
    isAvailable: true,
    currentLocation: {
      latitude: 40.7128,
      longitude: -74.0060
    }
  }
]

const inventoryManagers = [
  {
    name: 'Demo Inventory Manager',
    email: 'inventory@example.com',
    password: 'password123',
    phone: '+1223344556',
    warehouseLocation: 'Main Warehouse',
    permissions: ['inventory_management', 'product_approval']
  }
]

const products = [
  {
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

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('Connected to MongoDB')

    // Clear existing data
    await Customer.deleteMany({})
    await Vendor.deleteMany({})
    await Admin.deleteMany({})
    await Moderator.deleteMany({})
    await DeliveryAgent.deleteMany({})
    await InventoryManager.deleteMany({})
    await Product.deleteMany({})
    await Cart.deleteMany({})
    await Order.deleteMany({})
    await Review.deleteMany({})
    await Wishlist.deleteMany({})
    await DeliveryStatus.deleteMany({})
    console.log('Cleared existing data')

    // Create users
    const createdCustomers = await Customer.create(customers)
    const createdVendors = await Vendor.create(vendors)
    const createdAdmins = await Admin.create(admins)
    const createdModerators = await Moderator.create(moderators)
    const createdDeliveryAgents = await DeliveryAgent.create(deliveryAgents)
    const createdInventoryManagers = await InventoryManager.create(inventoryManagers)
    console.log(`Created ${createdCustomers.length} customers, ${createdVendors.length} vendors, ${createdAdmins.length} admins, ${createdModerators.length} moderators, ${createdDeliveryAgents.length} delivery agents, ${createdInventoryManagers.length} inventory managers`)

    // Create products with vendor references
    const productsWithVendors = products.map(product => ({
      ...product,
      vendor: product.brand === 'ComfortWear' || product.brand === 'Elegance' || product.brand === 'KidComfort' || product.brand === 'HomeStyle'
        ? createdVendors[0]._id
        : createdVendors[1]._id
    }))

    const createdProducts = await Product.create(productsWithVendors)
    console.log(`Created ${createdProducts.length} products`)

    // Create carts
    const carts = [
      {
        user: createdCustomers[0]._id,
        items: [
          {
            product: createdProducts[0]._id,
            quantity: 2,
            price: createdProducts[0].price,
            selectedVariants: { size: 'M', color: 'White' }
          },
          {
            product: createdProducts[1]._id,
            quantity: 1,
            price: createdProducts[1].price,
            selectedVariants: { color: 'Black' }
          }
        ]
      },
      {
        user: createdCustomers[1]._id,
        items: [
          {
            product: createdProducts[2]._id,
            quantity: 1,
            price: createdProducts[2].price,
            selectedVariants: { size: 'M', color: 'Red' }
          }
        ]
      }
    ]

    const createdCarts = await Cart.create(carts)
    console.log(`Created ${createdCarts.length} carts`)

    // Create wishlists
    const wishlists = [
      {
        customer: createdCustomers[0]._id,
        items: [
          {
            product: createdProducts[3]._id,
            priceWhenAdded: createdProducts[3].price,
            addedAt: new Date()
          },
          {
            product: createdProducts[4]._id,
            priceWhenAdded: createdProducts[4].price,
            addedAt: new Date()
          }
        ]
      },
      {
        customer: createdCustomers[1]._id,
        items: [
          {
            product: createdProducts[5]._id,
            priceWhenAdded: createdProducts[5].price,
            addedAt: new Date()
          }
        ]
      }
    ]

    const createdWishlists = await Wishlist.create(wishlists)
    console.log(`Created ${createdWishlists.length} wishlists`)

    // Create orders
    const orders = [
      {
        orderNumber: 'ORD-001',
        customer: createdCustomers[0]._id,
        vendor: createdVendors[0]._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            image: createdProducts[0].images[0].url,
            price: createdProducts[0].price,
            quantity: 1,
            selectedVariants: { size: 'L', color: 'White' },
            subtotal: createdProducts[0].price
          }
        ],
        shippingAddress: {
          name: createdCustomers[0].name,
          email: createdCustomers[0].email,
          phone: createdCustomers[0].phone,
          ...createdCustomers[0].address
        },
        paymentMethod: 'card',
        paymentStatus: 'completed',
        orderStatus: 'delivered',
        subtotal: createdProducts[0].price,
        tax: 5.00,
        shipping: 10.00,
        total: createdProducts[0].price + 15.00,
        deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        deliveryAgent: createdDeliveryAgents[0]._id,
        deliveryStatus: 'delivered'
      },
      {
        orderNumber: 'ORD-002',
        customer: createdCustomers[1]._id,
        vendor: createdVendors[1]._id,
        items: [
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            image: createdProducts[1].images[0].url,
            price: createdProducts[1].price,
            quantity: 1,
            selectedVariants: { color: 'Black' },
            subtotal: createdProducts[1].price
          }
        ],
        shippingAddress: {
          name: createdCustomers[1].name,
          email: createdCustomers[1].email,
          phone: createdCustomers[1].phone,
          ...createdCustomers[1].address
        },
        paymentMethod: 'paypal',
        paymentStatus: 'completed',
        orderStatus: 'shipped',
        subtotal: createdProducts[1].price,
        tax: 10.00,
        shipping: 15.00,
        total: createdProducts[1].price + 25.00,
        deliveryAgent: createdDeliveryAgents[0]._id,
        deliveryStatus: 'in_transit'
      }
    ]

    const createdOrders = await Order.create(orders)
    console.log(`Created ${createdOrders.length} orders`)

    // Create delivery statuses
    const deliveryStatuses = [
      {
        order: createdOrders[0]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'assigned',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        order: createdOrders[0]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        order: createdOrders[0]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'delivered',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        order: createdOrders[1]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'assigned',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        order: createdOrders[1]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        order: createdOrders[1]._id,
        deliveryAgent: createdDeliveryAgents[0]._id,
        status: 'in_transit',
        location: 'En route to delivery address',
        timestamp: new Date()
      }
    ]

    const createdDeliveryStatuses = await DeliveryStatus.create(deliveryStatuses)
    console.log(`Created ${createdDeliveryStatuses.length} delivery statuses`)

    // Create reviews
    const reviews = [
      {
        product: createdProducts[0]._id,
        customer: createdCustomers[0]._id,
        vendor: createdVendors[0]._id,
        order: createdOrders[0]._id,
        rating: 5,
        title: 'Great quality t-shirt!',
        comment: 'Very comfortable and fits perfectly. The material is soft and durable. Highly recommend!',
        isApproved: true,
        approvedAt: new Date()
      },
      {
        product: createdProducts[1]._id,
        customer: createdCustomers[1]._id,
        vendor: createdVendors[1]._id,
        order: createdOrders[1]._id,
        rating: 4,
        title: 'Excellent sound quality',
        comment: 'The noise cancellation works great and battery life is impressive. Only minor complaint is the weight.',
        isApproved: true,
        approvedAt: new Date()
      }
    ]

    const createdReviews = await Review.create(reviews)
    console.log(`Created ${createdReviews.length} reviews`)

    // Update product ratings
    for (const product of createdProducts) {
      await product.updateRating()
    }

    console.log('Seeding completed successfully!')
    console.log('\nCreated data summary:')
    console.log(`- Customers: ${createdCustomers.length}`)
    console.log(`- Vendors: ${createdVendors.length}`)
    console.log(`- Admins: ${createdAdmins.length}`)
    console.log(`- Moderators: ${createdModerators.length}`)
    console.log(`- Delivery Agents: ${createdDeliveryAgents.length}`)
    console.log(`- Inventory Managers: ${createdInventoryManagers.length}`)
    console.log(`- Products: ${createdProducts.length}`)
    console.log(`- Carts: ${createdCarts.length}`)
    console.log(`- Orders: ${createdOrders.length}`)
    console.log(`- Reviews: ${createdReviews.length}`)
    console.log(`- Wishlists: ${createdWishlists.length}`)
    console.log(`- Delivery Statuses: ${createdDeliveryStatuses.length}`)

  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
