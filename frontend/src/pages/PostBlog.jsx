import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

function PostBlog() {
  const [formData, setFormData] = useState({
    title: "",
    "blog-description": "",
    "img-caption": "",
    category: "",
  });
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Initialize Quill editor
  useEffect(() => {
    if (!quillRef.current) {
      return;
    }

    // Check if Quill is already initialized by looking for existing toolbar
    const existingToolbar = quillRef.current.querySelector(".ql-toolbar");
    if (existingToolbar || quillInstance.current) {
      return;
    }

    // Clear any existing content
    quillRef.current.innerHTML = "";

    // Create Quill instance
    try {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        placeholder: "Write your blog content here...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      // Listen for text changes
      const handleTextChange = () => {
        if (quillInstance.current) {
          setContent(quillInstance.current.root.innerHTML);
        }
      };

      quillInstance.current.on("text-change", handleTextChange);

      // Store the handler for cleanup
      quillRef.current._textChangeHandler = handleTextChange;
    } catch (error) {
      console.error("Error initializing Quill:", error);
    }

    // Cleanup function
    return () => {
      if (quillInstance.current && quillRef.current?._textChangeHandler) {
        quillInstance.current.off(
          "text-change",
          quillRef.current._textChangeHandler
        );
        quillInstance.current = null;
      }
      if (quillRef.current) {
        delete quillRef.current._textChangeHandler;
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validate content
    if (!content.trim() || content === "<p><br></p>") {
      setError("Please add some content to your blog post");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to create a blog post");
        navigate("/login");
        return;
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append content
      formDataToSend.append("content", content);

      // Append image if selected
      if (coverImage) {
        formDataToSend.append("cover-img", coverImage);
      }

      // API endpoint
      const API_URL = "http://localhost:3000/api/post-blog";

      // Send POST request with authentication header
      const response = await axios.post(API_URL, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Blog post created successfully!");
      console.log("Blog created:", response.data);

      // Reset form
      setFormData({
        title: "",
        "blog-description": "",
        "img-caption": "",
        category: "",
      });
      setContent("");
      setCoverImage(null);

      // Clear Quill editor
      if (quillInstance.current) {
        quillInstance.current.setContents([]);
        quillInstance.current.root.innerHTML = "<p><br></p>";
      }

      // Redirect to blog browse page after a delay
      setTimeout(() => {
        navigate("/browse-blogs");
      }, 2000);
    } catch (err) {
      console.error("Error creating blog:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to create blog post");
        if (err.response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          navigate("/login");
        }
      } else if (err.request) {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <BackButton className="mb-5 mt-7 ml-10" route="/" />
      <div className="flex flex-col justify-center items-center p-5 bg-gray-100">
        <h1 className="text-2xl font-semibold tracking-tight mb-8 text-gray-800">
          Create a Blog Post
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm max-w-4xl w-full">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm max-w-4xl w-full">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-gray-800 max-w-4xl w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col">
              {/* TITLE OF BLOG */}
              <label htmlFor="title" className="text-xl mb-2 tracking-tight">
                Title
              </label>
              <input
                type="text"
                className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 w-full py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
                placeholder="Title..."
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              {/* BLOG DESCRIPTION */}
              <label
                htmlFor="blog-description"
                className="text-xl mb-2 tracking-tight mt-6"
              >
                Blog Description
              </label>
              <textarea
                name="blog-description"
                cols="30"
                rows="5"
                className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 w-full py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
                placeholder="Write the description of the blog here..."
                value={formData["blog-description"]}
                onChange={handleInputChange}
                required
              />

              {/* CATEGORY */}
              <label
                htmlFor="category"
                className="text-xl mb-2 tracking-tight mt-6"
              >
                Categories
              </label>
              <select
                name="category"
                className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 w-full py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="design">Design</option>
                <option value="software">Software Engineering</option>
                <option value="politics">Politics</option>
                <option value="cyber-security">Cyber Security</option>
                <option value="architecture">Architectural Engineering</option>
                <option value="civil-engineering">Civil Engineering</option>
                <option value="web-development">Web Development</option>
              </select>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col">
              {/* COVER IMAGE */}
              <label
                htmlFor="cover-img"
                className="text-xl mb-2 tracking-tight"
              >
                Cover Image
              </label>
              <input
                type="file"
                name="cover-img"
                accept="image/*"
                onChange={handleImageChange}
                className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 w-full ring-1 ring-gray-200 focus-within:ring-gray-500 file:bg-primary file:text-white file:p-2 file:mr-3 hover:file:bg-primary-400 cursor-pointer file:cursor-pointer"
              />

              {/* IMAGE CAPTION */}
              <label
                htmlFor="img-caption"
                className="text-xl mb-2 tracking-tight mt-6"
              >
                Image Caption
              </label>
              <textarea
                name="img-caption"
                cols="30"
                rows="3"
                className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 w-full py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
                placeholder="Write the caption of the cover image..."
                value={formData["img-caption"]}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* BLOG CONTENT - FULL WIDTH */}
          <label htmlFor="content" className="text-xl mb-2 tracking-tight mt-8">
            Blog Content
          </label>
          <div className="bg-white rounded-lg ring-1 ring-gray-200 focus-within:ring-gray-500">
            <div
              ref={quillRef}
              style={{ minHeight: "300px" }}
              className="quill-editor-container"
            />
          </div>

          {/* POST BLOG */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 bg-primary text-xl text-white font-bold rounded-md cursor-pointer hover:bg-primary-400 mt-10 mb-10 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating Post..." : "Post Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostBlog;
