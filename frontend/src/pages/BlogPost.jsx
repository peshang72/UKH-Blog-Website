import React from "react";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";
import programmingImg from "../assets/programming-img.jpg";
import avatar from "../assets/avatar.jpg";
import BlogCard from "../components/BlogCard";

function BlogPost() {
  return (
    <div className="">
      <Navbar route={"/"} />
      <main className="mt-7 ml-10">
        <BackButton route="/browse-blogs" />
        <div className="flex flex-col items-center">
          <div className="w-1/2">
            <h1 className="text-4xl font-semibold tracking-tight mb-3">
              Programming is Hard But Designing is Harder
            </h1>
            <span className="bg-primary text-white py-2 px-4 text-xs font-bold tracking-wide">
              DESIGN
            </span>
            <p className="mt-4 text-gray-600">
              This blog describes that designing is much harder than programming
              as it needs much thought and inspiration so through continuous
              studying
            </p>
            <div className="flex gap-4">
              <img
                src={avatar}
                alt="Profile image of a girl"
                className="size-11 rounded-full "
              />
              <div className="flex flex-col gap-0">
                <p className="font-semibold">Author Name</p>
                <p className="text-gray-400">FEB 19, 2025</p>
              </div>
            </div>
            <img
              src={programmingImg}
              alt="An image of a screen displaying codes"
              className="min-w-[] mt-4"
            />
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur. Cursus sed montes
              tristique elit aliquet adipiscing quis nunc maecenas.
            </p>

            <div className="flex flex-col gap-5 text-gray-800 mt-5">
              <p>
                Lorem ipsum dolor sit amet consectetur. Eget sed ut ut commodo
                mauris. A at in blandit rhoncus nulla in nibh. Lectus et eget
                ultrices lacus et. Elementum vitae diam enim vitae eget
                volutpat.
              </p>
              <ul className="list-disc ml-8">
                <li>Ipsum is better than Lorem</li>
                <li>
                  <u>Lorem is better than Ipsum</u>
                </li>
                <li>Both are good</li>
                <li>None of the Above</li>
              </ul>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eget sed ut ut commodo
                mauris. A at in blandit rhoncus nulla in nibh. Lectus et eget
                ultrices lacus et. Elementum vitae diam enim vitae eget
                volutpat.
              </p>
              <h2>Dolor is the best though</h2>
              <p>
                Lorem ipsum dolor sit amet consectetur. Eget sed ut ut commodo
                mauris. A at in blandit rhoncus nulla in nibh. Lectus et eget
                ultrices lacus et. Elementum vitae diam enim vitae eget
                volutpat.
              </p>
              <ol className="list-decimal">
                <li>
                  Dolor is <strong>money</strong> so it is the best
                </li>
                <li>
                  <strong>Money</strong> runs the world after all....
                </li>
                <li>
                  However <strong>money</strong> can not buy happiness!!
                </li>
              </ol>
              <code className="bg-[#111827] text-white p-3">
                {" "}
                print("Hello World!"){" "}
              </code>
              <p>
                One of the best games that I played is{" "}
                <a
                  href="https://toxiquil.itch.io/ratslayer"
                  className="text-sky-600 font-bold underline"
                >
                  RatSlayer
                </a>
              </p>

              <hr className="text-gray-300 mx-5 rounded-2xl my-10" />

              <aside>
                <h3 className="text-2xl font-semibold tracking-tight mb-8">
                  Related Posts
                </h3>
                <BlogCard />
                <BlogCard />
                <BlogCard />
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BlogPost;
