import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useOrbis, User, UserPopup } from "@orbisclub/components";
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import Sidebar from '../components/Sidebar';
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
    <>
      <Head>
        <title>Leaderboard | YouBuidl</title>
        <meta name="description" content="See the top contributors and builders in the YouBuidl community" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white dark:bg-dark-primary">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        
        {/* Main Content Area - starts below fixed header */}
        <div className="flex pt-16 h-screen">
          {/* Left Sidebar - fixed */}
          <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-dark-primary border-r border-gray-100 dark:border-dark-border">
            <LeftSidebar />
          </div>

          {/* Main Scrollable Content */}
          <div className="flex-1 md:ml-64 md:mr-80 overflow-y-auto">
            <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-dark-primary mb-2">
                  Community Leaderboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-dark-secondary">
                  Recognizing our top contributors and builders
                </p>
              </div>

              {/* Timeframe Filters */}
              <div className="mb-6">
                <div className="flex space-x-2">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe.id}
                      onClick={() => setSelectedTimeframe(timeframe.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTimeframe === timeframe.id
                          ? 'bg-[var(--brand-color)] text-white'
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-color)]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div
                      key={user.did}
                      className="bg-white dark:bg-dark-secondary rounded-lg border border-gray-200 dark:border-dark-border p-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Rank & Avatar */}
                        <div className="flex items-center gap-4 min-w-[200px]">
                          <div className="flex-shrink-0">
                            {index < 3 ? (
                              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                'bg-orange-100 text-orange-600'
                              }`}>
                                <FaTrophy className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-dark-tertiary text-gray-500 dark:text-dark-secondary font-medium">
                                #{index + 1}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => setShowUserPopup(user.did)}
                            className="flex items-center text-gray-900 dark:text-dark-primary hover:underline"
                          >
                            <User details={user.details} />
                          </button>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 w-full sm:w-auto">
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-sm text-gray-500 dark:text-dark-secondary">
                            <span className="flex items-center gap-2">
                              <FaTrophy className="w-4 h-4 text-yellow-500" />
                              <span>{user.points}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <FaHeart className="w-4 h-4 text-red-500" />
                              <span>{user.likes}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <FaComment className="w-4 h-4 text-blue-500" />
                              <span>{user.comments}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <FaUsers className="w-4 h-4 text-green-500" />
                              <span>{user.followers}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <FaEthereum className="w-4 h-4 text-purple-500" />
                              <span>{user.donations}</span>
                            </span>
                          </div>
                        </div>

                        {/* Total Score */}
                        <div className="text-xl font-bold text-gray-900 dark:text-dark-primary ml-auto">
                          {calculateScore(user)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>

          {/* Right Sidebar - fixed */}
          <div className="hidden md:block fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-dark-primary border-l border-gray-100 dark:border-dark-border">
            <Sidebar />
          </div>
        </div>
      </div>

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
    </>
  );
}
