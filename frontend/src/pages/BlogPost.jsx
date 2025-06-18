import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import programmingImg from "../assets/programming-img.jpg";
import avatar from "../assets/avatar.jpg";
import BlogCard from "../components/BlogCard";

function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const API_URL = `http://localhost:3000/api/blogs/${id}`;
        const response = await axios.get(API_URL);
        setBlog(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch blog");
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedBlogs = async () => {
      try {
        const API_URL = "http://localhost:3000/api/blogs";
        const response = await axios.get(API_URL);
        // Get 3 random blogs excluding the current one
        const filtered = response.data.filter((b) => b._id !== id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelatedBlogs(shuffled.slice(0, 3));
      } catch (err) {
        console.error("Error fetching related blogs:", err);
      }
    };

    if (id) {
      fetchBlog();
      fetchRelatedBlogs();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="">
        <Navbar />
        <main className="mt-7 ml-10">
          <BackButton route="/browse-blogs" />
          <div className="flex justify-center items-center py-20">
            <div className="text-2xl text-gray-600">Loading blog...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="">
        <Navbar />
        <main className="mt-7 ml-10">
          <BackButton route="/browse-blogs" />
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-2xl text-red-600 mb-4">
                {error || "Blog not found"}
              </div>
              <p className="text-gray-600">
                The blog you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Use default image for now
  const coverImageSrc = programmingImg;

  const authorName =
    blog.author?.fullName ||
    (blog.author?.firstName && blog.author?.lastName
      ? `${blog.author.firstName} ${blog.author.lastName}`
      : "Unknown Author");

  const createdAt = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="">
      <Navbar />
      <main className="mt-7 ml-10">
        <BackButton route="/browse-blogs" />
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl px-4">
            <h1 className="text-4xl font-semibold tracking-tight mb-3">
              {blog.title}
            </h1>
            <span className="bg-primary text-white py-2 px-4 text-xs font-bold tracking-wide uppercase">
              {blog.category}
            </span>
            <p className="mt-4 text-gray-600 text-lg">{blog.blogDescription}</p>
            <div className="flex gap-4 mt-6">
              <img
                src={avatar}
                alt="Profile image"
                className="size-11 rounded-full"
              />
              <div className="flex flex-col gap-0">
                <p className="font-semibold">{authorName}</p>
                <p className="text-gray-400">{createdAt}</p>
              </div>
            </div>

            {/* Always show a cover image for better visual appeal */}
            <img
              src={coverImageSrc}
              alt={blog.imgCaption || "Blog cover image"}
              className="w-full mt-6 rounded-lg"
            />
            {blog.imgCaption && (
              <p className="text-gray-500 text-sm mt-2 italic">
                {blog.imgCaption}
              </p>
            )}

            <div className="mt-8">
              {/* Display the rich content */}
              <div
                className="ql-editor prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blog.content }}
                style={{ padding: 0 }}
              />

              <hr className="text-gray-300 mx-5 rounded-2xl my-10" />

              {relatedBlogs.length > 0 && (
                <aside>
                  <h3 className="text-2xl font-semibold tracking-tight mb-8">
                    Related Posts
                  </h3>
                  {relatedBlogs.map((relatedBlog) => (
                    <BlogCard key={relatedBlog._id} blog={relatedBlog} />
                  ))}
                </aside>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlogPost;
