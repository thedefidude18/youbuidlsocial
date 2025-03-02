import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useOrbis, User } from '@orbisclub/components';
import { LoadingCircle } from './Icons';
import ReactTimeAgo from 'react-time-ago';
import { getIpfsLink } from '../utils';
import { FaEthereum, FaHeart, FaComment, FaUsers, FaTrophy } from 'react-icons/fa';
import DonateButton from './DonateButton';
import { CATEGORIES } from '../config/categories';
import { SkeletonSidebarUser, SkeletonSidebarPost } from './SkeletonSidebar';

function Sidebar() {
  return (
    <aside className="md:w-64 lg:w-80 md:shrink-0"> {/* Removed py-6 padding */}
      <div className="space-y-4">
        <div className="space-y-4">
          <TopUsers />
          <RecentDiscussions />
        </div>
      </div>
    </aside>
  );
}

const TopProjects = () => {
  const { orbis } = useOrbis();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      // Get all posts sorted by likes
      const { data } = await orbis.getPosts({
        context: global.orbis_context,
        only_master: true,
        order_by: 'count_likes'
      });

      if (data) {
        // Filter posts that belong to project-related categories
        const projectPosts = data.filter(post => {
          const category = post.content?.context;
          return category && (
            category === 'projects' ||
            category === 'public-goods' ||
            category === 'dapps' ||
            category === 'infrastructure' ||
            category === 'defi'
          );
        });

        // Get top 3 project posts
        const topProjects = projectPosts.slice(0, 3);

        // Add donation information
        const projectsWithDonations = await Promise.all(topProjects.map(async (project) => {
          const donations = await loadProjectDonations(project.stream_id);
          return { ...project, donations };
        }));

        setProjects(projectsWithDonations);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectDonations(streamId) {
    try {
      const { data: donations } = await orbis.getPosts({
        context: streamId,
        tag: 'donation'
      });

      return donations?.reduce((acc, donation) => {
        if (donation.content?.data?.type === 'donation') {
          const amount = parseFloat(donation.content.data.amount) || 0;
          const token = donation.content.data.token || 'ETH';
          acc[token] = (acc[token] || 0) + amount;
        }
        return acc;
      }, { ETH: 0 }) || { ETH: 0 };
    } catch (error) {
      console.error('Error loading donations:', error);
      return { ETH: 0 };
    }
  }

  const formatDonation = (amount) => parseFloat(amount).toFixed(4);

  // Get category label from CATEGORIES object
  const getCategoryLabel = (categoryId) => {
    return CATEGORIES[categoryId]?.label || categoryId;
  };

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-primary mb-4">
        Top Projects
      </h3>
      
      {loading ? (
        <div className="flex justify-center p-4">
          <LoadingCircle />
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.stream_id} className="group">
              <Link href={'/post/' + project.stream_id}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-tertiary">
                    {project.content?.media?.[0] ? (
                      <img
                        src={getIpfsLink(project.content.media[0])}
                        alt={project.content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaEthereum className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-dark-primary truncate group-hover:text-[var(--brand-color)]">
                      {project.content.title}
                    </p>
                    
                    <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-dark-secondary">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getCategoryLabel(project.content.context)}
                      </span>
                      <span className="flex items-center">
                        <FaHeart className="w-3 h-3 mr-1" />
                        {project.count_likes || 0}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <FaComment className="w-3 h-3 mr-1" />
                        {project.count_replies || 0}
                      </span>
                      {Object.entries(project.donations).map(([token, amount]) => 
                        amount > 0 && (
                          <React.Fragment key={token}>
                            <span>•</span>
                            <span className="flex items-center text-green-600">
                              <FaEthereum className="w-3 h-3 mr-1" />
                              {formatDonation(amount)} {token}
                            </span>
                          </React.Fragment>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="mt-2">
                <DonateButton post={project} />
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-dark-secondary">
                No projects found
              </p>
              <Link 
                href="/create" 
                className="text-sm text-[var(--brand-color)] hover:underline mt-2 inline-block"
              >
                Create the first project →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TopUsers = () => {
  const { orbis, user } = useOrbis();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [followingMap, setFollowingMap] = useState({});
  const [followLoading, setFollowLoading] = useState({});

  useEffect(() => {
    loadTopUsers();
  }, []);

  useEffect(() => {
    if (user?.did) {
      loadFollowingStatus();
    }
  }, [user?.did]);

  async function loadFollowingStatus() {
    if (!user?.did) return;

    try {
      const { data, error } = await orbis.getConnections({
        did: user.did,
        type: 'follow'
      });

      if (error) {
        console.error('Error from Orbis:', error);
        return;
      }

      if (Array.isArray(data)) {
        const following = {};
        data.forEach(connection => {
          if (connection?.target) {
            following[connection.target] = connection.active;
          }
        });
        setFollowingMap(following);
      }
    } catch (error) {
      console.error('Error loading following status:', error);
    }
  }

  async function handleFollow(targetDid) {
    if (!user?.did) {
      alert('Please connect your wallet to follow users');
      return;
    }

    setFollowLoading(prev => ({ ...prev, [targetDid]: true }));

    try {
      const isFollowing = followingMap[targetDid];
      const res = await orbis.connect({
        type: 'follow',
        target: targetDid,
        active: !isFollowing
      });

      if (res.status === 200) {
        setFollowingMap(prev => ({
          ...prev,
          [targetDid]: !isFollowing
        }));
      } else {
        throw new Error(res.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      alert('Failed to update follow status. Please try again.');
    } finally {
      setFollowLoading(prev => ({ ...prev, [targetDid]: false }));
    }
  }

  async function loadTopUsers() {
    if (!user?.did) return;
    setLoading(true);
    try {
      const { data: posts } = await orbis.getPosts({
        context: global.orbis_context
      });

      const userStats = new Map();

      // Process posts to gather user statistics
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
            points: post.creator_details?.profile?.metadata?.points || 0
          });
        }

        const stats = userStats.get(userId);
        stats.posts++;
        stats.likes += post.count_likes || 0;
        stats.comments += post.count_replies || 0;
      }

      // Calculate engagement score and sort users
      const topUsers = Array.from(userStats.values())
        .map(user => ({
          ...user,
          score: calculateEngagementScore(user)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3); // Changed from 5 to 3

      setUsers(topUsers);
    } catch (error) {
      console.error('Error loading top users:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateEngagementScore(user) {
    return (
      user.points * 10 +
      user.posts * 50 +
      user.likes * 5 +
      user.comments * 10
    );
  }

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-primary mb-4">
        Top Builders
      </h3>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonSidebarUser key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div 
              key={user.did}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-tertiary transition-colors"
            >
              <Link 
                href={`/profile/${user.did}`}
                className="flex items-center space-x-3 flex-1 min-w-0"
              >
                <User details={user.details} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-primary truncate">
                    {user.details?.profile?.username || ''}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-dark-secondary">
                    <span className="flex items-center">
                      <FaTrophy className="w-3 h-3 mr-1 text-yellow-500" />
                      {user.points}
                    </span>              
                    <span>•</span>
                    <span className="flex items-center">
                      <FaComment className="w-3 h-3 mr-1" />
                      {user.comments}
                    </span>
                  </div>
                </div>
              </Link>

              {user.did !== user?.did && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleFollow(user.did);
                  }}
                  disabled={followLoading[user.did]}
                  className={`ml-2 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    followingMap[user.did]
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-tertiary dark:text-dark-secondary'
                      : 'bg-[var(--brand-color)] text-white hover:bg-[var(--brand-color-hover)]'
                  }`}
                >
                  {followLoading[user.did] ? (
                    <LoadingCircle className="w-4 h-4" />
                  ) : followingMap[user.did] ? (
                    'Following'
                  ) : (
                    'Follow'
                  )}
                </button>
              )}
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-dark-secondary">
                No users found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RecentDiscussions = () => {
  const { orbis } = useOrbis();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const { data } = await orbis.getPosts({
        context: global.orbis_context,
        only_master: true,
        order_by: 'last_reply_timestamp'
      }, 0, 5);
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading discussions:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-dark-secondary rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-primary mb-4">
        Recent Discussions
      </h3>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonSidebarPost key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link 
              key={post.stream_id} 
              href={'/post/' + post.stream_id}
              className="block group"
            >
              <div className="flex items-start space-x-3">
                <User details={post.creator_details} height={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-primary truncate group-hover:text-[var(--brand-color)]">
                    {post.content.title}
                  </p>
                  <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-dark-secondary">
                    <ReactTimeAgo date={post.timestamp * 1000} locale="en-US" />
                    <span>•</span>
                    <span className="flex items-center">
                      <FaComment className="w-3 h-3 mr-1" />
                      {post.count_replies || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-dark-secondary">
                No discussions yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// UpcomingEvents component removed

export default Sidebar;
