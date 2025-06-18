import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  blogDescription: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  authorDescription: String,
  category: {
    type: String,
    required: true,
  },
  imgCaption: String,
  coverImage: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
