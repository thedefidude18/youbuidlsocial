import React, { useState, useEffect } from 'react';
import { useOrbis, User, UserPopup } from "@orbisclub/components";
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

      // Process posts to calculate user stats
      posts.forEach(post => {
        const userId = post.creator;
        if (!userStats.has(userId)) {
          userStats.set(userId, {
            did: userId,
            posts: 0,
            likes: 0,
            comments: 0,
            profile: post.creator_details
          });
        }

        const stats = userStats.get(userId);
        stats.posts += 1;
        stats.likes += post.count_likes || 0;
        stats.comments += post.count_replies || 0;
      });

      // Convert Map to array and sort by total engagement
      const sortedUsers = Array.from(userStats.values())
        .sort((a, b) => {
          const scoreA = a.posts + a.likes + a.comments;
          const scoreB = b.posts + b.likes + b.comments;
          return scoreB - scoreA;
        });

      setUsers(sortedUsers);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white dark:bg-dark-secondary rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <FaTrophy className="text-yellow-400 mr-2" />
            Community Leaderboard
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-3 text-left">Rank</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-center">
                    <FaUsers className="inline" title="Posts" />
                  </th>
                  <th className="px-4 py-3 text-center">
                    <FaHeart className="inline" title="Likes" />
                  </th>
                  <th className="px-4 py-3 text-center">
                    <FaComment className="inline" title="Comments" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.did} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">#{index + 1}</td>
                    <td className="px-4 py-3">
                      <User did={user.did} />
                    </td>
                    <td className="px-4 py-3 text-center">{user.posts}</td>
                    <td className="px-4 py-3 text-center">{user.likes}</td>
                    <td className="px-4 py-3 text-center">{user.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}