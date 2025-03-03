import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SearchIcon, MenuVerticalIcon, LoadingCircle } from "./Icons";
import useOutsideClick from "../hooks/useOutsideClick";
import { useOrbis, User, UserPopup } from "@orbisclub/components";
import LeftSidebar from './LeftSidebar';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { orbis, user, connecting, setConnectModalVis } = useOrbis();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useOutsideClick(menuRef, () => {
    setShowUserMenu(false);
    setShowUserPopup(false);
  });

  const goToProfile = () => {
    if (user?.did) {
      router.push(`/profile/${user.did}`);
      setShowUserMenu(false);
    }
  };

  const logout = async () => {
    try {
      await orbis.logout();
      setShowUserMenu(false);
      setShowUserPopup(false); // Make sure to close the popup
      router.push('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const ConnectButton = () => {
    if (connecting) {
      return (
        <button className="btn-sm py-1.5 bg-main rounded-full" disabled>
          <LoadingCircle />
        </button>
      );
    }

    if (user && user.did) { // Add check for user.did
      return (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 hover:opacity-80"
          >
            <User details={user} />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-secondary rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  setShowUserPopup(true);
                  setShowUserMenu(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </button>
              <button
                onClick={goToProfile}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          )}

          {showUserPopup && user.did && ( // Add check for user.did
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="relative inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <button
                    onClick={() => setShowUserPopup(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-dark-secondary dark:hover:text-dark-primary"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="w-full">
                    <UserPopup did={user.did} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <button
        className="btn-sm py-1.5 bg-[var(--brand-color)] hover:bg-[var(--brand-color-hover)] text-white rounded-full"
        onClick={() => setConnectModalVis(true)}
      >
        Connect
      </button>
    );
  };

  return (
    <header className="py-2 px-4 md:px-8 bg-white dark:bg-dark-primary border-b border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <img 
              src="/logo-blue.svg"  // Using logo-blue.svg which should be in your public folder
              alt="YouBuidl" 
              className="h-8 w-auto dark:brightness-0 dark:invert" 
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/home" 
            className="text-gray-700 dark:text-dark-primary hover:text-gray-900 dark:hover:text-white font-medium"
          >
            Home
          </Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center">
          {/* Desktop-only items */}
          <div className="hidden md:flex items-center space-x-4 mr-4">
            {/* Total Donation Button */}
            <button className="flex items-center px-4 py-1.5 bg-[#27282C] dark:bg-dark-secondary rounded-full">
              <span className="text-sm font-medium text-gray-200 dark:text-dark-primary">
                Total Donation - $3,056
              </span>
            </button>

            {/* GitHub Fork Button */}
            <iframe 
              src="https://ghbtns.com/github-btn.html?user=givestation&repo=youbuidl-quadraticfunding&type=fork&count=true" 
              frameBorder="0" 
              scrolling="0" 
              width="100" 
              height="20"
              title="GitHub"
            ></iframe>
          </div>

          {/* Always visible items */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

// SearchBar component with dark mode support
function SearchBar() {
  const [search, setSearch] = useState("");
  
  return (
    <div className="relative flex-1 max-w-lg">
      <div className="relative">
        <input
          type="text"
          className="w-full bg-gray-100 dark:bg-dark-secondary border-none rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-dark-primary placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
    </div>
  );
}

export default Header;
