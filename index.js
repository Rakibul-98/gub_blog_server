const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const Blog = require('./models/Blog');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Welcome to the Blog API');
});

// create blog
app.post('/create-blog', async (req, res) => {
    const { title, imageUrl, description, content, author } = req.body;

    if (!title || !imageUrl || !description || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBlog = new Blog({ title, imageUrl, description, content, author });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(500).json({ message: 'Error saving blog' });
    }
});

// get all blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ blogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch blogs" });
    }
});

app.get('/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ blog });
    } catch (err) {
        console.error(err);

        // Handle invalid ObjectId format
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: "Invalid blog ID format" });
        }

        res.status(500).json({ message: "Failed to fetch blog" });
    }
});

// signup user
app.post('/users/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields (name, email, password) are required' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// login user
app.post("/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: { name: user.name, email: user.email },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port the ${PORT}`);
});