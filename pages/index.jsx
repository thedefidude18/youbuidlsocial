import React, { useRef } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Feed from '../components/Feed';
import { useOrbis } from '@orbisclub/components';
import Editor from '../components/Editor';

export default function Home() {
  const { user, setConnectModalVis } = useOrbis();
  const refreshFeedRef = useRef(null);

  const handlePostCreated = async () => {
    if (refreshFeedRef.current) {
      await refreshFeedRef.current();
    }
  };

  return (
    <>
      <Head>
        <title>YouBuidl | Connect, fund and explore Public Goods.</title>
        <meta name="description" content="Welcome to youbuidl" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="min-h-screen bg-[var(--bg-color)]">
        <main className="w-full max-w-2xl">
          {/* Editor Section */}
          <div className="mb-3 w-full"> {/* Changed from mb-8 to mb-4 */}
            {user ? (
              <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-6">
                <Editor onPostCreated={handlePostCreated} />
              </div>
            ) : (
              <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Connect your wallet to start sharing and engaging with the community.
                </p>
                <button 
                  className="px-8 py-3 bg-[var(--brand-color)] hover:bg-[var(--brand-color-hover)] text-white rounded-lg transition-colors"
                  onClick={() => setConnectModalVis(true)}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Feed Section */}
          <div className="w-full">
            <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm">
              <Feed refreshRef={refreshFeedRef} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
