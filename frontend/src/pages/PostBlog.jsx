import React from "react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

function PostBlog() {
  return (
    <div>
      <Navbar />

      <BackButton className="mb-5 mt-7 ml-10" />
      <div className="flex flex-col justify-center items-center p-5 bg-gray-100">
        <h1 className="text-2xl font-semibold tracking-tight mb-8 text-gray-800 ">
          Create a Blog Post
        </h1>
        <form action="" className="flex flex-col text-gray-800">
          {/* TITLE OF BLOG */}
          <label htmlFor="title" className="text-xl mb-2 tracking-tight">
            Title
          </label>
          <input
            type="text"
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
            placeholder="Title..."
            name="title"
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
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
            placeholder="Write the description of the blog here..."
          ></textarea>

          {/* AUTHOR NAME */}
          <label htmlFor="author" className="text-xl mb-2 tracking-tight mt-6">
            Author Name
          </label>
          <input
            type="text"
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
            placeholder="Name..."
            name="author"
            required
          />

          {/* AUTHOR DESCRIPTION */}
          <label
            htmlFor="author-description"
            className="text-xl mb-2 tracking-tight mt-6"
          >
            Author Description
          </label>
          <textarea
            name="author-description"
            cols="30"
            rows="5"
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
            placeholder="Write the description of the author here..."
          ></textarea>

          {/* COVER IMAGE */}
          <label
            htmlFor="cover-img"
            className="text-xl mb-2 tracking-tight mt-6"
          >
            Cover Image
          </label>
          <input
            type="file"
            name="cover-img"
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 max-w-sm w-96 ring-1 ring-gray-200 focus-within:ring-gray-500 file:bg-primary file:text-white file:p-2 file:mr-3 hover:file:bg-primary-400 cursor-pointer file:cursor-pointer"
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
            rows="5"
            className="rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500"
            placeholder="Write the caption of the cover image..."
          ></textarea>

          {/* CATEGORY */}
          <label
            htmlFor="category"
            className="text-xl mb-2 tracking-tight mt-6"
          >
            Categories
          </label>
          <select name="category rounded-lg text-lg outline-none bg-white placeholder:text-gray-500 pl-4 max-w-sm w-96 py-2 ring-1 ring-gray-200 focus-within:ring-gray-500">
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

          {/* BLOG CONTENT */}
          <div id="editor"></div>

          {/* POST BLOG */}

          <button
            type="submit"
            className="w-96 py-2 bg-primary text-xl text-white font-bold rounded-md cursor-pointer hover:bg-primary-400 mt-10 mb-10"
          >
            Post Blog
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostBlog;
