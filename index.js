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

// Create blog
app.post('/create-blog', async (req, res) => {
    const { title, imageUrl, description, content, author, authorEmail, category } = req.body;

    if (!title || !imageUrl || !description || !content) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newBlog = new Blog({ title, imageUrl, description, content, author, authorEmail, category });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(500).json({ message: 'Error saving blog' });
    }
});

// Get all blogs
app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json({ blogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch blogs" });
    }
});

// Get a specific blog by ID
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

// Get blogs of a specific user
app.get('/blogs/user/:userEmail', async (req, res) => {
    const { userEmail } = req.params;

    try {
        const blogs = await Blog.find({ authorEmail: userEmail });

        if (blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found for this user" });
        }

        res.status(200).json({ blogs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch blogs for this user" });
    }
});

// Update a specific blog by ID
app.put("/update/:id", async (req, res) => {
    console.log("Update blog request received:", req.body);
    console.log("Blog ID:", req.params.id);
    try {
        const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated) return res.status(404).json({ message: "Blog not found" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Failed to update blog" });
    }
});

// Delete a specific blog by ID
app.delete('/blogs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await Blog.findByIdAndDelete(id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete blog" });
    }
});

// Signup user
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

// Login user
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
            user: { name: user.name, email: user.email, id: user._id },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});