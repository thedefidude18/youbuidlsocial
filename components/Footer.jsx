import React from 'react';
import Link from 'next/link';
import { Logo, TwitterIcon, GithubIcon, OrbisLogo } from "./Icons";

function Footer() {
  return (
    <footer className="border-t border-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-8">
          {/* Top area */}
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between mb-4">
            <div className="shrink-0 mr-4">
              {/* Logo */}
              <Link className="inline-flex group mb-8 md:mb-0 text-primary" href="/">
                <img src="/logo-blue.svg" alt="Logo" className="h-8" />
              </Link>
            </div>
            {/* Right links */}
            <div className="text-sm font-medium md:order-1 mb-2 md:mb-0">
              <ul className="inline-flex flex-wrap text-sm space-x-6">
                <li>
                  <Link className="text-secondary hover:underline flex flex-row items-center" href="https://useorbis.com/" target="_blank">
                    Powered by <OrbisLogo className="ml-1 mr-1" /> Orbis
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom area */}
          <div className="text-center md:flex md:items-center md:justify-between">
            {/* Social links */}
            <ul className="inline-flex mb-4 md:order-1 md:ml-4 md:mb-0 space-x-2">
              <li>
                <Link
                  className="flex justify-center items-center text-brand text-brand-hover"
                  target="_blank"
                  href="https://twitter.com/givestation">
                  <TwitterIcon />
                </Link>
              </li>
              <li>
                <Link
                  className="flex justify-center items-center text-brand text-brand-hover"
                  target="_blank"
                  href="https://github.com/givestation/">
                  <GithubIcon />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;