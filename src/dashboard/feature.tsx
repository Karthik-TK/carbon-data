export const Feature = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="df31b9f6-a505-42f8-af91-d2b7c3218e5c"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#df31b9f6-a505-42f8-af91-d2b7c3218e5c)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative"></span>
          </span>{" "}
          A Carbon Emissions Data management tool
        </h2>
        <p className="text-base text-gray-700 md:text-lg">
          Simple and Easy Tool to access carbon emissions data
        </p>
      </div>
      <div className="grid gap-8 row-gap-8 lg:grid-cols-1">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-indigo-50 mx-auto sm:w-20 sm:h-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="max-w-md mb-3 text-sm text-gray-900 sm:mx-auto"></p>
          <a
            href="/form"
            aria-label=""
            className="inline-flex items-center font-semibold transition-colors duration-200 text-purple-accent-400 hover:text-purple-800"
          >
            <h6 className="mb-2 font-semibold leading-5">Upload Form</h6>
          </a>
        </div>
      </div>
    </div>
  );
};
