import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { SearchProvider } from "../contexts/SearchContext";
import MediaQuery from "../tools/mediaQuery";

const Layout = ({ children }) => {
  const isNotDesktop = MediaQuery.isNotDesktop();

  const DesktopHeader = () => (
    <div className="flex justify-between items-center w-almost_full m-almost_full">
      <Link to="/" className="flex">
        <img
          src="/images/leap_logo.png"
          alt="Leap Logo - Home"
          className="h-16 w-auto"
        />
      </Link>
      <SearchBar />
      <div className="flex justify-center items-center">
        <a
          href="https://leap-va.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary text-white"
        >
          Learn More about LEAP-VA
        </a>
        <Link to="/about" className="ml-4 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.25}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );

  const MobileHeader = () => (
    <div className="flex justify-between items-center w-full px-4 py-3 bg-white shadow-sm">
      <Link to="/" className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </Link>
      <Link to="/about" className="cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.25}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </Link>
    </div>
  );

  return (
    <SearchProvider>
      <div className="flex flex-col min-h-screen bg-base-100 text-lg">
        {isNotDesktop ? <MobileHeader /> : <DesktopHeader />}
        <main className="flex-grow w-almost_full mb-almost_full mx-auto bg-bg_grey">
          {children}
        </main>
      </div>
    </SearchProvider>
  );
};

export default Layout;