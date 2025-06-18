import Blog from "../model/blog.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const postBlog = [
  upload.single("cover-img"),
  async (req, res) => {
    try {
      const {
        title,
        "blog-description": blogDescription,
        "author-description": authorDescription,
        "img-caption": imgCaption,
        category,
      } = req.body;

      const coverImage = req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          }
        : null;

      const newBlog = new Blog({
        title,
        blogDescription,
        author: req.user._id, // Use authenticated user's ID
        authorDescription,
        category,
        imgCaption,
        coverImage,
      });

      await newBlog.save();
      res.status(201).json({
        message: "Blog created successfully",
        blog: newBlog,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating blog", error: error.message });
    }
  },
];

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      "author",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blog",
      error: error.message,
    });
  }
};

// Update blog (author or admin only)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("author", "username email");

    res.json({
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating blog",
      error: error.message,
    });
  }
};

// Delete blog (author or admin only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
