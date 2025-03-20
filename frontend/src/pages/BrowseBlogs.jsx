import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BackButton from "../components/BackButton";
import Posts from "../components/Posts";
import Pagination from "../components/Pagination";

function BrowseBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Start with true since we load immediately
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Made constant since we're not changing it
  // const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        // Handle HTTP errors (fetch doesn't throw on 4xx/5xx responses)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
        // setError(null); // Clear any previous errors
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false); // Runs regardless of success/failure
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
        <BackButton className="mb-10" />
        <Posts posts={currentPosts} loading={loading} />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
        />
      </div>
    </div>
  );
}

export default BrowseBlogs;
