import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
function BrowseBlogs() {
  return (
    <div className="h-screen grid grid-cols-[0.33fr_1fr] grid-rows-[64px_1fr]">
      <Navbar className="col-span-full" />
      <Sidebar />
      <div className="bg-red-500"></div>
    </div>
  );
}

export default BrowseBlogs;
