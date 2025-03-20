import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: String,
  blogDescription: String,
  author: String,
  authorDescription: String,
  category: String,
  imgCaption: String,
  coverImage: {
    data: Buffer,
    contentType: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
