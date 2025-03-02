import React, { useRef } from 'react';
import Feed from '../Feed';
import { useOrbis } from '@orbisclub/components';
import Editor from '../Editor';

export default function Home() {
  const { user, setConnectModalVis } = useOrbis();
  const refreshFeedRef = useRef(null);

  const handlePostCreated = async () => {
    if (refreshFeedRef.current) {
      await refreshFeedRef.current();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        {user ? (
          <Editor onPostCreated={handlePostCreated} />
        ) : (
          <div className="w-full text-center bg-slate-50 rounded border border-primary p-6">
            <p className="text-base text-secondary mb-2">
              You must be connected to share a post on youbuidl.
            </p>
            <button 
              className="btn-sm py-1.5 bg-main bg-main-hover" 
              onClick={() => setConnectModalVis(true)}
            >
              Connect
            </button>
          </div>
        )}
        <Feed ref={refreshFeedRef} />
      </div>
    </div>
  );
}