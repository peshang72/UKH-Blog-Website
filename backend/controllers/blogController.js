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
        content,
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
        content,
        author: req.user._id, // Use authenticated user's ID
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

// Helper function to convert blog data for frontend
const convertBlogForResponse = (blog) => {
  const blogObj = blog.toObject();

  // Convert cover image buffer to base64 if it exists
  if (blogObj.coverImage && blogObj.coverImage.data) {
    blogObj.coverImage.data = blogObj.coverImage.data.toString("base64");
  }

  return blogObj;
};

// Get all approved blogs (public)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "approved" })
      .populate("author", "firstName lastName username email")
      .sort({ createdAt: -1 });

    // Convert blogs for frontend display
    const convertedBlogs = blogs.map(convertBlogForResponse);

    res.json(convertedBlogs);
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
      "firstName lastName username email"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Convert blog for frontend display
    const convertedBlog = convertBlogForResponse(blog);

    res.json(convertedBlog);
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
    }).populate("author", "firstName lastName username email");

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

// Admin functions
// Get all pending blogs (admin only)
export const getPendingBlogs = async (req, res) => {
  try {
    const pendingBlogs = await Blog.find({ status: "pending" })
      .populate("author", "firstName lastName username email")
      .sort({ createdAt: -1 });

    // Convert blogs for frontend display
    const convertedBlogs = pendingBlogs.map(convertBlogForResponse);

    res.json(convertedBlogs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending blogs",
      error: error.message,
    });
  }
};

// Approve blog (admin only)
export const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.status !== "pending") {
      return res.status(400).json({
        message: "Blog has already been reviewed",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        $unset: { rejectionReason: 1 }, // Remove rejection reason if it exists
      },
      { new: true }
    )
      .populate("author", "firstName lastName username email")
      .populate("reviewedBy", "firstName lastName username");

    res.json({
      message: "Blog approved successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving blog",
      error: error.message,
    });
  }
};

// Reject blog (admin only)
export const rejectBlog = async (req, res) => {
  try {
    const { reason } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.status !== "pending") {
      return res.status(400).json({
        message: "Blog has already been reviewed",
      });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
        rejectionReason: reason || "No reason provided",
      },
      { new: true }
    )
      .populate("author", "firstName lastName username email")
      .populate("reviewedBy", "firstName lastName username");

    res.json({
      message: "Blog rejected successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting blog",
      error: error.message,
    });
  }
};

// Get all blogs with status filter (admin only)
export const getAllBlogsAdmin = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const blogs = await Blog.find(filter)
      .populate("author", "firstName lastName username email")
      .populate("reviewedBy", "firstName lastName username")
      .sort({ createdAt: -1 });

    // Convert blogs for frontend display
    const convertedBlogs = blogs.map(convertBlogForResponse);

    res.json(convertedBlogs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching blogs",
      error: error.message,
    });
  }
};

// Get current user's blogs
export const getUserBlogs = async (req, res) => {
  try {
    const userBlogs = await Blog.find({ author: req.user._id })
      .populate("author", "firstName lastName username email")
      .populate("reviewedBy", "firstName lastName username")
      .sort({ createdAt: -1 });

    // Convert blogs for frontend display
    const convertedBlogs = userBlogs.map(convertBlogForResponse);

    res.json(convertedBlogs);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user blogs",
      error: error.message,
    });
  }
};

// Delete blog (admin only) - allows admin to delete any blog
export const deleteBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      message: "Blog deleted successfully",
      deletedBlog: {
        id: blog._id,
        title: blog.title,
        author: blog.author,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting blog",
      error: error.message,
    });
  }
};
