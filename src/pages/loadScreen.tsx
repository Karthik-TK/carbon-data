import React from "react";

const LoadScreen = () => {
  return (
    <div className="absolute flex justify-center items-center w-full h-full top-0 left-0 backdrop-filter backdrop-blur-sm bg-gray-100 bg-opacity-5 transition-color z-60 cursor-progress">
      <div className="block text-center">
        <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
          <svg
            fill="none"
            className="w-8 h-8 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>

          <div className="text-xl text-black">Loading ...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadScreen;
