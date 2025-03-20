import React from "react";
import BlogCard from "./BlogCard";

function Posts({ posts, loading }) {
  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      {posts.map((post) => (
        // Use parentheses () instead of curly braces {} for implicit return
        <div>
          <BlogCard post={post} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
