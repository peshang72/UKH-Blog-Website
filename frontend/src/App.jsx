import { useState } from "react";
import Landing from "./pages/Landing";
import BrowseBlogs from "./pages/BrowseBlogs";
import PostBlog from "./pages/PostBlog";
import BlogPost from "./pages/BlogPost";
import "./index.css";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/browse-blogs" element={<BrowseBlogs />} />
        <Route path="/blog-post" element={<BlogPost />} />
        <Route path="/post-blog" element={<PostBlog />} />
      </Routes>
    </div>
  );
}

export default App;
