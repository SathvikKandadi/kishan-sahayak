const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Assuming you have a User model defined
const Product = require('./models/Product');
const Order = require('./models/Order');
const ColdStorage = require('./models/ColdStorage');
const Volunteer = require('./models/Volunteer');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();
// Connect to MongoDB
const uri = `${process.env.URI}/kishanSahayak`;

console.log(uri);

mongoose.connect(uri, {useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected to kishanSahayak database'))
    .catch(err => console.log('MongoDB connection error:', err));


// Signup endpoint
app.post('/signup', async (req, res) => {
    const { email, username, password, role } = req.body;
    const newUser = new User({ email, username, password, role });
    try {
        const savedUser = await newUser.save();
        const userResponse = {
            _id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
            role: savedUser.role
        };
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            const userResponse = {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            };
            res.status(200).json(userResponse);
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add Product endpoint
app.post('/products', async (req, res) => {
    const { name, quantity, price, image, category , farmerId, farmerLocation, description } = req.body;
    const newProduct = new Product({ name, quantity, price, image, category , farmerId, farmerLocation, description });
    await newProduct.save();
    res.status(201).send('Product created');
});

// Get all Products endpoint
app.get('/products', async (req, res) => {
    const products = await Product.find().populate({
        path:'farmerId',
        select:'username'
    });
    res.status(200).json(products);
});

// Get Products by Farmer's Name endpoint
app.get('/products/farmer/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    const products = await Product.find({ farmerId });
    res.status(200).json(products);
});

// Add Cold Storage endpoint
app.post('/coldstorages', async (req, res) => {
    const { name, address, capacity, contact, image, description } = req.body;
    const newColdStorage = new ColdStorage({ name, address, capacity, contact, image, description });
    await newColdStorage.save();
    res.status(201).send('Cold storage created');
});

// Get all Cold Storages endpoint
app.get('/coldstorages', async (req, res) => {
    const coldStorages = await ColdStorage.find();
    res.status(200).json(coldStorages);
});

// Book Cold Storage endpoint (this is a placeholder, implement booking logic as needed)
app.post('/coldstorages/book/:id', async (req, res) => {
    const { id } = req.params;
    const coldStorage = await ColdStorage.findById(id);
    if (!coldStorage) {
        return res.status(404).send('Cold storage not found');
    }
    // Implement booking logic here (e.g., update availability)
    coldStorage.available = false; // Example: mark as booked
    await coldStorage.save();
    res.status(200).send('Cold storage booked');
});

// Order a product endpoint
app.post('/orders', async (req, res) => {
    const { customerId , farmerId , productId, quantity } = req.body;
    const product = await Product.findById(productId);
    
    if (!product) {
        return res.status(404).send('Product not found');
    }

    const totalPrice = product.price * quantity;
    const newOrder = new Order({ customerId, farmerId , productId, quantity, totalPrice });
    await newOrder.save();
    res.status(201).send('Order created');
});

// Get orders by customer endpoint
app.get('/orders/customer/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const orders = await Order.find({ customerId }).populate('productId');
    res.status(200).json(orders);
});

app.get('/orders/farmer/:farmerId', async (req, res) => {
    const { farmerId } = req.params;
    const orders = await Order.find({ farmerId }).populate('productId');
    res.status(200).json(orders);
});

// Add Volunteer endpoint
app.post('/volunteers', async (req, res) => {
    const { name, place, age, phoneNumber } = req.body;
    const newVolunteer = new Volunteer({ name, place, age, phoneNumber });
    await newVolunteer.save();
    res.status(201).send('Volunteer created');
});

app.get("/" , async(req,res) => {
    res.send('Hello');
})

app.listen(3000, '0.0.0.0', () => console.log('Server running on http://0.0.0.0:3000'));

// ... existing code ...
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
// });
