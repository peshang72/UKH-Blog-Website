import React from "react";
import logo from "../assets/logo.png";
import campusImg from "../../public/campusImg.png";
import ButtonPrimary from "../components/ButtonPrimary/";
import ButtonSecondary from "../components/ButtonSecondary/";

function Landing() {
  console.log(campusImg);
  return (
    <main className="bg-[url(public/campusImg.png)] bg-cover h-screen text-white text-center">
      <input
        type="text"
        placeholder="Search "
        className="text-lg w-1/2 outline-0 bg-white text-black rounded-full px-6 py-3 mt-8"
      />
      <div className="absolute top-1/2 left-1/2 -translate-1/2 flex flex-col items-center gap-10">
        <img src={logo} alt="" className="w-1/6" />
        <h1 className="text-6xl font-semibold leading-[1.05]">
          The Voice of the{" "}
          <span className="bg-gradient-to-r from-primary to-primary-300 inline-block text-transparent bg-clip-text">
            UKH
          </span>{" "}
          Community
        </h1>
        <p className="text-lg text-gray-300">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis
          animi velit voluptatem
        </p>

        <div className="flex justify-between gap-5">
          <ButtonPrimary>Browse Blogs</ButtonPrimary>
          <ButtonSecondary bgColor="white" bgHover="white" textColor="primary">
            Create Posts
          </ButtonSecondary>
        </div>
      </div>
    </main>
  );
}

export default Landing;
