import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useOrbis, User, UserPopup } from "@orbisclub/components";
import Layout from '../components/Layout';
import { FaTrophy, FaHeart, FaComment, FaEthereum, FaUsers } from 'react-icons/fa';

export default function Leaderboard() {
  const { orbis } = useOrbis();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [showUserPopup, setShowUserPopup] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedTimeframe]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const { data: posts } = await orbis.getPosts({
        context: global.orbis_context
      });

      const userStats = new Map();

      for (const post of posts) {
        const userId = post.creator_details?.did;
        if (!userId) continue;

        if (!userStats.has(userId)) {
          userStats.set(userId, {
            did: userId,
            details: post.creator_details,
            posts: 0,
            likes: 0,
            comments: 0,
            donations: 0,
            points: post.creator_details?.profile?.metadata?.points || 0,
            followers: 0
          });
        }

        const stats = userStats.get(userId);
        stats.posts++;
        stats.likes += post.count_likes || 0;
        stats.comments += post.count_replies || 0;
      }

      for (const [userId, stats] of userStats) {
        const followersRes = await orbis.api.from("orbis_connections")
          .select()
          .eq('following_profile', userId)
          .eq('active', true);
        
        stats.followers = followersRes.data?.length || 0;
      }

      const rankedUsers = Array.from(userStats.values())
        .sort((a, b) => {
          const scoreA = calculateScore(a);
          const scoreB = calculateScore(b);
          return scoreB - scoreA;
        });

      setUsers(rankedUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateScore(user) {
    return (
      user.points * 10 +
      user.posts * 50 +
      user.likes * 5 +
      user.comments * 10 +
      user.followers * 20 +
      user.donations * 100
    );
  }

  const timeframes = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'This Month' },
    { id: 'week', label: 'This Week' }
  ];

  return (
    <Layout>
      <Head>
        <title>Leaderboard | YouBuidl</title>
        <meta name="description" content="See the top contributors and builders in the YouBuidl community" />
      </Head>

      <main className="w-full max-w-2xl py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">
            Community Leaderboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-dark-secondary">
            Recognizing our top contributors and builders
          </p>
        </div>

        {/* Timeframe Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.id}
                onClick={() => setSelectedTimeframe(timeframe.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${
                  selectedTimeframe === timeframe.id
                    ? 'bg-[#CDEB63] text-gray-900'
                    : 'bg-gray-100 dark:bg-dark-secondary text-gray-700 dark:text-dark-secondary hover:bg-gray-200 dark:hover:bg-dark-tertiary'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CDEB63]"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div
                key={user.did}
                className="bg-white dark:bg-dark-secondary rounded-lg border border-gray-200 dark:border-dark-border p-4"
              >
                <div className="flex flex-col gap-2 sm:gap-4">
                  {/* Top Row - Rank, Avatar, Name, Score */}
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {index < 3 ? (
                        <div className={`w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center rounded-full ${
                          index === 0 ? 'bg-[#CDEB63] text-gray-900' :
                          index === 1 ? 'bg-gray-100 text-gray-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <FaTrophy className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      ) : (
                        <div className="w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-600">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setShowUserPopup(user.did)}
                      className="flex items-center text-gray-900 dark:text-dark-primary hover:underline"
                    >
                      <User details={user.details} />
                    </button>

                    <div className="ml-auto text-lg sm:text-xl font-bold text-gray-900 dark:text-dark-primary">
                      {calculateScore(user)}
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="flex justify-end items-center text-sm text-gray-500 dark:text-dark-secondary gap-4 px-2">
                    <div className="flex items-center gap-1">
                      <FaComment className="w-3.5 h-3.5 text-blue-500" />
                      <span>{user.comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaUsers className="w-3.5 h-3.5 text-green-500" />
                      <span>{user.followers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaEthereum className="w-3.5 h-3.5 text-purple-500" />
                      <span>{user.donations}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* User Profile Popup */}
      {showUserPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="relative inline-block align-bottom bg-white dark:bg-dark-secondary rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <button
                onClick={() => setShowUserPopup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-dark-secondary dark:hover:text-dark-primary"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <UserPopup did={showUserPopup} />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
