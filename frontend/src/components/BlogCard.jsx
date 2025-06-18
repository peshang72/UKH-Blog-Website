import React from "react";
import programmingImg from "../assets/programming-img.jpg";
import avatar from "../assets/avatar.jpg";
import { Link } from "react-router-dom";

function BlogCard({
  blog = null,
  dividerDown = true,
  postTitle = "Programming is Hard But Designing is Harder",
  postDescription = "This blog describes that designing is much harder than programming as it needs much thought and inspiration so through continuous studying",
}) {
  // Function to strip HTML tags and get plain text
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Get preview text from content or description
  const getPreviewText = () => {
    if (blog?.content) {
      const plainText = stripHtml(blog.content);
      return plainText.length > 200
        ? plainText.substring(0, 200) + "..."
        : plainText;
    }
    return blog?.blogDescription || postDescription;
  };

  // Use blog data if provided, otherwise use default values
  const title = blog?.title || postTitle;
  const description = getPreviewText();
  const authorName =
    blog?.author?.fullName ||
    (blog?.author?.firstName && blog?.author?.lastName
      ? `${blog.author.firstName} ${blog.author.lastName}`
      : "Author Name");
  const category = blog?.category || "General";
  const createdAt = blog?.createdAt
    ? new Date(blog.createdAt)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toUpperCase()
    : "FEB 25, 2025";

  // Use cover image if available, otherwise use default
  const coverImageSrc =
    blog?.coverImage && blog.coverImage.data
      ? `data:${blog.coverImage.contentType};base64,${blog.coverImage.data}`
      : programmingImg;

  return (
    <div className="mr-10">
      <Link
        className="grid grid-cols-[300px_1fr] gap-5 cursor-pointer"
        to={`/blog-post/${blog?._id || ""}`}
      >
        {/* Image */}
        <img
          src={coverImageSrc}
          alt={blog?.imgCaption || "Blog cover image"}
          className="rounded-lg min-w-[] object-cover h-48"
        />
        <div className="flex flex-col pr-10 gap-7">
          {/* HEADER AND DESCRIPTION */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary text-white py-1 px-3 text-xs font-bold tracking-wide rounded uppercase">
                {category}
              </span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-500 leading-[1.6] line-clamp-3">
              {description}
            </p>
          </div>

          {/* AUTHOR AND DATE */}
          <div className="flex items-center justify-between">
            {/* AUTHOR IMAGE AND NAME */}
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Profile image"
                className="size-10 rounded-full"
              />
              <p className="text-base font-semibold text-gray-800">
                {authorName}
              </p>
            </div>
            {/* DATE */}
            <p className="text-gray-500">{createdAt}</p>
          </div>
        </div>
      </Link>
      {dividerDown ? (
        <hr className="text-gray-200 mx-5 rounded-2xl my-10" />
      ) : null}
    </div>
  );
}

export default BlogCard;
