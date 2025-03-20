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
          <BlogCard postTitle={post.title} postBody={post.description} />
        </div>
      ))}
    </div>
  );
}

export default Posts;
