import { useState } from "react";
import Landing from "./pages/Landing";
import BrowseBlogs from "./pages/BrowseBlogs";
import PostBlog from "./pages/PostBlog";
import BlogPost from "./pages/BlogPost";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* <Landing /> */}
      {/* <BrowseBlogs /> */}
      <PostBlog />
      {/* <BlogPost /> */}
    </div>
  );
}

export default App;
