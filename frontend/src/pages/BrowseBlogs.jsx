import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BackButton from "../components/BackButton";
import Posts from "../components/Posts";
import Pagination from "../components/Pagination";

function BrowseBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // API endpoint for our backend
        const API_URL = "http://localhost:3000/api/blogs";

        const response = await axios.get(API_URL);

        setPosts(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  console.log(posts);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="h-screen grid grid-cols-[0.25fr_1fr] grid-rows-[64px_1fr]">
      <Navbar className="col-span-full" />
      <Sidebar />
      <div className="mt-7 ml-10">
        <BackButton className="mb-10" route="/" />
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            Error loading blogs: {error}
          </div>
        )}
        <Posts posts={currentPosts} loading={loading} />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}

export default BrowseBlogs;
