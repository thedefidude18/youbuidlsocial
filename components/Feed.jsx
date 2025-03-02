import React, { useState, useEffect } from 'react';
import { useOrbis } from '@orbisclub/components';
import PostItem from './PostItem';
import { LoadingCircle } from './Icons';
import SkeletonPost from './SkeletonPost';

const Feed = ({ onRefresh }) => {
  const { orbis } = useOrbis();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feed data
  const fetchFeedData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await orbis.getPosts(
        {
          context: global.orbis_context,
          only_master: true,
          include_child_contexts: true,
          order_by: 'last_reply_timestamp',
        },
        0,
        10
      ); // Fetch up to 10 posts

      if (error) {
        setError('Failed to fetch feed data. Please try again.');
      } else {
        setPosts(data);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch feed data on component mount
  useEffect(() => {
    fetchFeedData();
  }, []);

  // Pass the refresh function to the parent component
  useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchFeedData);
    }
  }, [onRefresh]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <>
          <SkeletonPost />
          <SkeletonPost />
          <SkeletonPost />
        </>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        posts.map((post) => (
          <div key={post.stream_id} className="card p-4 hover:border-gray-300 transition-colors">
            <PostItem post={post} />
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
