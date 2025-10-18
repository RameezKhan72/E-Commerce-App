const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = 'e-commerce-super-secret-key-that-is-long';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- User Routes ---
router.post('/users/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });
        user = new User({ name, email, password });
        await user.save();
        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token });
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).send('Server error');
    }
});
router.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const payload = { user: { id: user.id } };
        jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/users/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error('Profile Fetch Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.put('/users/profile/name', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.name = name;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/users/profile/picture', [authMiddleware, upload.single('profileImage')], async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        if (req.file) {
            user.profileImageUrl = `/uploads/${req.file.filename}`;
        }
        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
router.put('/users/profile/address', authMiddleware, async (req, res) => {
    try {
        const { street, city, postalCode, country } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });
        user.address = { street, city, postalCode, country };
        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Update Address Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.put('/users/profile/phone', authMiddleware, async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        user.phone = phone;
        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Update Phone Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- Product Routes ---
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        console.error('Get Products Error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(`Get Product ${req.params.id} Error:`, err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- NEW: Route to create a product review ---
router.post('/products/:id/reviews', authMiddleware, async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user.id.toString()
        );
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }
        const review = {
            name: user.name,
            rating: Number(rating),
            comment,
            user: req.user.id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        await product.save();
        res.status(201).json({ message: 'Review added' });
    } catch (err) {
        console.error('Add Review Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- Cart Routes ---
router.get('/cart', authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (err) {
        console.error('Get Cart Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.post('/cart', authMiddleware, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        } else {
            cart = new Cart({ user: req.user.id, items: [{ product: productId, quantity }] });
        }
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.status(201).json(populatedCart);
    } catch (err) {
        console.error('Add to Cart Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.put('/cart/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                cart.items.splice(itemIndex, 1);
            } else {
                cart.items[itemIndex].quantity = quantity;
            }
        } else {
            return res.status(404).json({ msg: 'Item not found in cart' });
        }
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);
    } catch (err) {
        console.error('Update Cart Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.delete('/cart/:productId', authMiddleware, async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        const populatedCart = await cart.populate('items.product');
        res.json(populatedCart);
    } catch (err) {
        console.error('Remove from Cart Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// --- Order Routes ---
router.post('/orders', authMiddleware, async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({ msg: 'Please provide a complete shipping address.' });
        }
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cannot create order from an empty cart' });
        }
        const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        const newOrder = new Order({
            user: req.user.id,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
        });
        const order = await newOrder.save();
        cart.items = [];
        await cart.save();
        res.status(201).json(order);
    } catch (err) {
        console.error('Create Order Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/orders', authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 }).populate('items.product', 'name image_url');
        res.json(orders);
    } catch (err) {
        console.error('Get Orders Error:', err.message);
        res.status(500).send('Server Error');
    }
});
router.get('/orders/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error('Get Order by ID Error:', err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;

