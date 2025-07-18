# 🛠️ Inkspire Blog Server

[![Node.js](https://img.shields.io/badge/Node.js-20.11.1-green)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18.2-%23000000)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0.13-brightgreen)](https://www.mongodb.com/)

A RESTful **API backend** built with **Express.js** and **MongoDB**. This server handles all blog operations, including fetching posts, filtering by category, and serving individual blog content.

➡ **Frontend Client:** [gub\_blog\_client](https://github.com/Rakibul-98/gub_blog_client)


## 🚀 Features

- **Get All Blogs** – Serve a list of blog posts with optional filters
- **Get Single Blog** – Fetch full details of a specific blog post by ID
- **Create New Blog** – Easily add blogs via POST requests (for future admin use)
- **Cross-Origin Support** – Fully CORS-enabled for frontend integration
- **Modular Structure** – Clean controller-service-repo architecture
- **MongoDB Atlas Integration** – Uses cloud database for storage


## 📦 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Rakibul-98/gub_blog_server.git
   cd gub_blog_server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create your `.env` file:**

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the server in development:**

   ```bash
   npm run dev
   ```

5. **Access the API:**

   * Base URL: `http://localhost:5000/api`
   * Example Endpoint: `GET /api/blogs`



## 📡 API Endpoints

### `GET /api/blogs`

Get all blog posts. Supports query params:

```bash
/api/blogs?category=technology
```

### `GET /api/blogs/:id`

Fetch a single blog post by its MongoDB `_id`.

### `POST /api/blogs`

Create a new blog post. *(Requires future authentication)*

**Example Body:**

```json
{
  "title": "The Future of AI",
  "content": "Generative AI is reshaping the world...",
  "category": "technology",
  "author": "Rakibul Hasan",
  "thumbnail": "https://example.com/image.jpg"
}
```


## 🌟 Future Enhancements

* 🔒 Authentication with JWT and Admin Roles
* 📂 Upload feature for images
* 📈 Analytics (views, reads, etc.)
* 🧪 Unit & Integration Testing with Jest


## ☁️ Deployment

Easily deployable to platforms like:

* 🟩 **Railway**
* 🟨 **Render**
* 🟦 **Vercel Serverless Functions**
* 🐳 **Docker**


## 📬 Contact

**Md Rakibul Hasan**

* 🌐 Portfolio: [https://portfolio-rakibul.netlify.app](https://portfolio-rakibul.netlify.app)
* 📧 Email: [rakibul.rupom2001@gmail.com](mailto:rakibul.rupom2001@gmail.com)

