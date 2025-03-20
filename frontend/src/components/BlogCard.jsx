import React from "react";
import programmingImg from "../assets/programming-img.jpg";
import avatar from "../assets/avatar.jpg";

function BlogCard({
  dividerDown = true,
  postTitle = "Programming is Hard But Designing is Harder",
  postDescription = "This blog describes that designing is much harder than programming as it needs much thought and inspiration so through continuous studying",
}) {
  // console.log(post);

  return (
    <div className="mr-10 ">
      <a className="grid grid-cols-[300px_1fr] gap-5 cursor-pointer ">
        {/* Image */}
        <img
          src={programmingImg}
          alt="An image of a screen displaying codes"
          className="rounded-lg min-w-[]"
        />
        <div className="flex flex-col pr-10 gap-7">
          {/* HEADER AND DESCRIPTION */}
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {postTitle}
            </h1>
            <p className="text-gray-500 leading-[1.6]">{postDescription}</p>
          </div>

          {/* AUTHOR AND DATE */}
          <div className="flex items-center justify-between">
            {/* AUTHOR IMAGE AND NAME */}
            <div className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Profile image of a girl"
                className="size-10 rounded-full"
              />
              <p className="text-base font-semibold text-gray-800">
                Author Name
              </p>
            </div>
            {/* DATE */}
            <p className="text-gray-500">FEB 25, 2025</p>
          </div>
        </div>
      </a>
      {dividerDown ? (
        <hr className="text-gray-200 mx-5 rounded-2xl my-10" />
      ) : null}
    </div>
  );
}

export default BlogCard;
