const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://127.0.0.1:27017/ecommerce';

const products = [
    // Electronics
    {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immerse yourself in music with these high-fidelity, noise-cancelling headphones. 30-hour battery life.',
        price: 149.99,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        category: 'Electronics',
        stock: 50,
    },
    {
        name: 'Smartwatch Series 8',
        description: 'Track your fitness, stay connected, and monitor your health with the latest smartwatch technology.',
        price: 299.00,
        image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop',
        category: 'Electronics',
        stock: 35,
    },
    // Books
    {
        name: 'The Midnight Library',
        description: 'A novel by Matt Haig, exploring the choices that go into a life well lived.',
        price: 15.50,
        image_url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=2112&auto=format&fit=crop',
        category: 'Books',
        stock: 120,
    },
    {
        name: 'Atomic Habits',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.',
        price: 18.99,
        image_url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2070&auto=format&fit=crop',
        category: 'Books',
        stock: 200,
    },
    // Clothing
    {
        name: 'Classic Denim Jacket',
        description: 'A timeless denim jacket for all seasons. Made with 100% premium cotton.',
        price: 79.95,
        image_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1887&auto=format&fit=crop',
        category: 'Clothing',
        stock: 80,
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'A soft, breathable, and eco-friendly t-shirt. Available in multiple colors.',
        price: 25.00,
        image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop',
        category: 'Clothing',
        stock: 300,
    },
    // Home Goods
    {
        name: 'Aromatic Scented Candle',
        description: 'Create a relaxing atmosphere with this soy wax candle. Lavender and chamomile scent.',
        price: 22.50,
        image_url: 'https://images.unsplash.com/photo-1614301239103-6900c2e766e3?q=80&w=1887&auto=format&fit=crop',
        category: 'Home Goods',
        stock: 150,
    },
    {
        name: 'Stainless Steel French Press',
        description: 'Brew the perfect cup of coffee every morning with this durable and stylish French press.',
        price: 45.00,
        image_url: 'https://images.unsplash.com/photo-1563861225725-3b9b41865e92?q=80&w=1887&auto=format&fit=crop',
        category: 'Home Goods',
        stock: 60,
    },
    {
        name: 'Modern Ceramic Planter',
        description: 'A minimalist ceramic planter to showcase your favorite indoor plants. Includes drainage hole.',
        price: 35.75,
        image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=2072&auto=format&fit=crop',
        category: 'Home Goods',
        stock: 90,
    },
    {
        name: 'Plush Throw Blanket',
        description: 'Stay cozy with this ultra-soft and warm throw blanket, perfect for your couch or bed.',
        price: 55.00,
        image_url: 'https://images.unsplash.com/photo-1616627561952-6a6c2f9e9b5c?q=80&w=1887&auto=format&fit=crop',
        category: 'Home Goods',
        stock: 110,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Existing products cleared.');

        // Insert new products
        await Product.insertMany(products);
        console.log('New products with real images have been added!');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Disconnect from the database
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

seedDB();
