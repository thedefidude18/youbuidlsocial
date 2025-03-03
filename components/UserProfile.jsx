import React, { useState, useEffect } from 'react';
import { useOrbis } from "@orbisclub/components";
import { shortAddress, getTimestamp } from "../utils";
import { useDidToAddress } from "../hooks/useDidToAddress";
import TimeAgoReact from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { LoadingCircle, EditIcon } from "./Icons";
import UserCredentials from "./UserCredentials";
import { FaGithub, FaTwitter, FaGlobe, FaEthereum, FaHeart, FaComment, FaShare, FaTag, FaEllipsisH, FaTrophy } from 'react-icons/fa';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import Link from 'next/link';
import { POINTS_RULES } from '../config/points';

// Initialize TimeAgo once
if (!TimeAgo.getDefaultLocale()) {
  TimeAgo.addDefaultLocale(en);
}

export default function UserProfile({ details, initialData }) {
  const { orbis, user } = useOrbis();
  const [profileImage, setProfileImage] = useState(details?.profile?.pfp || '/default-avatar.png');
  const [coverImage, setCoverImage] = useState(details?.profile?.cover || '/default-cover.jpg');
  const [nfts, setNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [donationStats, setDonationStats] = useState({
    totalReceived: 0,
    totalDonors: 0,
    recentDonations: []
  });
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(false);

  const isOwnProfile = user?.did === details?.did;
  const { address } = useDidToAddress(details?.did);

  useEffect(() => {
    if (address) {
      loadNfts();
      loadDonationStats();
    }
  }, [address]);

  useEffect(() => {
    if (details?.did) {
      loadUserPoints();
    }
  }, [details]);

  async function loadUserPoints() {
    try {
      const { data: profile } = await orbis.getProfile(details.did);
      const points = profile?.details?.profile?.metadata?.points || 0;
      setUserPoints(points);
    } catch (error) {
      console.error('Error loading user points:', error);
    }
  }

  async function loadNfts() {
    try {
      const response = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}/getNFTs?owner=${address}`);
      const data = await response.json();
      setNfts(data.ownedNfts || []);
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
  }

  async function loadDonationStats() {
    try {
      const response = await fetch(`/api/donations/user/${address}`);
      const stats = await response.json();
      setDonationStats(stats);
    } catch (error) {
      console.error("Error loading donation stats:", error);
    }
  }

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // Implement image upload logic here
      const imageUrl = ''; // Replace with actual upload logic
      if (type === 'profile') {
        setProfileImage(imageUrl);
      } else {
        setCoverImage(imageUrl);
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Profile Section */}
      <div className="px-4 relative">
        <div className="relative">
          <div className="relative inline-block">
            <img
              src={profileImage}
              alt={details?.profile?.username || 'Profile'}
              className="w-[144px] h-[144px] rounded-full border-4 border-white object-cover bg-white"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            {isOwnProfile && (
              <label className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                />
                <EditIcon className="w-4 h-4" />
              </label>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold">{details?.profile?.username || 'Anonymous'}</h1>
              <p className="text-gray-500">@{shortAddress(details?.did)}</p>
            </div>
            {isOwnProfile ? (
              <button className="px-4 py-2 border border-gray-200 rounded-full font-medium hover:bg-gray-50">
                Edit profile
              </button>
            ) : (
              <button className="px-4 py-2 bg-black text-white rounded-full font-medium hover:bg-gray-800">
                Follow
              </button>
            )}
          </div>

          {details?.profile?.description && (
            <p className="mt-3 text-gray-800">{details.profile.description}</p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
            {details?.profile?.website && (
              <a href={details.profile.website} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 hover:text-blue-500">
                <FaGlobe /> <span>{details.profile.website}</span>
              </a>
            )}
            {details?.profile?.github && (
              <a href={`https://github.com/${details.profile.github}`} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 hover:text-blue-500">
                <FaGithub /> <span>{details.profile.github}</span>
              </a>
            )}
            {details?.profile?.twitter && (
              <a href={`https://twitter.com/${details.profile.twitter}`} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 hover:text-blue-500">
                <FaTwitter /> <span>@{details.profile.twitter}</span>
              </a>
            )}
          </div>

          <div className="flex gap-6 mt-4 text-sm">
            <div>
              <span className="font-bold">{donationStats.totalDonors}</span>
              <span className="text-gray-500"> supporters</span>
            </div>
            <div>
              <span className="font-bold">{userPoints}</span>
              <span className="text-gray-500"> points</span>
            </div>
            <div>
              <span className="font-bold">{donationStats.totalReceived}</span>
              <span className="text-gray-500"> ETH received</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mt-4">
        <div className="flex">
          {['Posts', 'Credentials', 'NFTs'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-8 py-4 text-sm font-medium transition-colors relative
                ${activeTab === tab.toLowerCase()
                  ? 'text-black font-bold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'posts' && (
          <div className="divide-y">
            {initialData?.posts?.map((post) => (
              <Link href={`/post/${post.stream_id}`} key={post.stream_id}>
                <div className="py-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {post.content?.title || 'Untitled Post'}
                  </h4>
                  <div className="text-gray-600 text-sm line-clamp-2">
                    {post.content?.body ? 
                      parse(DOMPurify.sanitize(marked(post.content.body))) : 
                      'No content'
                    }
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {post.timestamp && !isNaN(post.timestamp) ? (
                      <TimeAgoReact date={new Date(post.timestamp * 1000)} />
                    ) : (
                      'Unknown time'
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {(!initialData?.posts || initialData.posts.length === 0) && (
              <div className="py-12 text-center text-gray-500">
                No posts yet
              </div>
            )}
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="py-4">
            {details ? (
              <UserCredentials details={details} />
            ) : (
              <div className="py-12 text-center text-gray-500">No credentials found</div>
            )}
          </div>
        )}

        {activeTab === 'nfts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4">
            {nfts.map((nft, index) => (
              <div key={index} className="rounded-xl overflow-hidden border hover:shadow-md transition-shadow">
                <img
                  src={nft.media[0]?.gateway || '/default-nft.png'}
                  alt={nft.title}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{nft.title}</h4>
                </div>
              </div>
            ))}
            {nfts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No NFTs found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
