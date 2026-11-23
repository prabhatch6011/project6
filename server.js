const express = require('express');
const app = express();

// Middleware to read JSON data
app.use(express.json());

// In-Memory Database (Blog Posts)
let posts = [
  {
    id: 1,
    title: "Getting Started with Node.js",
    content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine.",
    author: "Prabhu Kumar",
    category: "Backend",
    createdDate: new Date().toISOString()
  },
  {
    id: 2,
    title: "Understanding Express.js Routing",
    content: "Express provides a robust set of features for web and mobile applications.",
    author: "Admin",
    category: "Web Development",
    createdDate: new Date().toISOString()
  }
];

// Home Route (Taaki http://localhost:3000/ kholne par error na aaye)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Unlox Week 06 Blog REST API!",
    endpoints: {
      getAllPosts: "GET /posts",
      getSinglePost: "GET /posts/:id",
      createPost: "POST /posts",
      updatePost: "PUT /posts/:id",
      deletePost: "DELETE /posts/:id"
    }
  });
});

// 1. GET /posts -> Retrieve all blog posts
app.get('/posts', (req, res) => {
  res.status(200).json({ success: true, count: posts.length, data: posts });
});

// 2. GET /posts/:id -> Retrieve a specific blog post by ID
app.get('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });
  res.status(200).json({ success: true, data: post });
});

// 3. POST /posts -> Create a new blog post
app.post('/posts', (req, res) => {
  const { title, content, author, category } = req.body;
  if (!title || !content || !author || !category) {
    return res.status(400).json({ success: false, message: "Please provide all fields." });
  }
  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title, content, author, category,
    createdDate: new Date().toISOString()
  };
  posts.push(newPost);
  res.status(201).json({ success: true, message: "Blog post created successfully", data: newPost });
});

// 4. PUT /posts/:id -> Update an existing blog post
app.put('/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ success: false, message: "Blog post not found" });

  const { title, content, author, category } = req.body;
  if (title) post.title = title;
  if (content) post.content = content;
  if (author) post.author = author;
  if (category) post.category = category;

  res.status(200).json({ success: true, message: "Blog post updated successfully", data: post });
});

// 5. DELETE /posts/:id -> Delete a blog post by ID
app.delete('/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).json({ success: false, message: "Blog post not found" });

  const deletedPost = posts.splice(postIndex, 1);
  res.status(200).json({ success: true, message: "Blog post deleted successfully", data: deletedPost[0] });
});

// Start Server
app.listen(3000, () => {
  console.log(`Server is running smoothly on http://localhost:3000`);
});