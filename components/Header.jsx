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

  useOutsideClick(menuRef, () => setShowUserMenu(false));

  const ConnectButton = () => {
    if (connecting) {
      return (
        <button className="btn-sm py-1.5 bg-main rounded-full" disabled>
          <LoadingCircle />
        </button>
      );
    }

    if (user) {
      return (
        <div className="relative" ref={menuRef}>
          <button
            className="flex items-center"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User
              did={user.did}
              showAddress={false}
              showNetwork={false}
              onClick={() => setShowUserPopup(!showUserPopup)}
            />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-secondary rounded-lg shadow-lg py-1 z-50">
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
    <header className="py-2 px-4 md:px-8">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <img src="/logo.svg" alt="YouBuidl" className="h-8 w-auto" />
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
        <div className="flex items-center space-x-4">
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

          <ThemeToggle />
          <ConnectButton />
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
