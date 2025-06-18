import React from "react";
import BlogCard from "./BlogCard";

function Posts({ posts, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-2xl text-gray-600">Loading blogs...</div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-2xl text-gray-600">No blogs found.</div>
      </div>
    );
  }

  return (
    <div>
      {posts.map((blog, index) => (
        <div key={blog._id || index}>
          <BlogCard blog={blog} dividerDown={index < posts.length - 1} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
