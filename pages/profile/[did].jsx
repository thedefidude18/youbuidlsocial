import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useOrbis } from "@orbisclub/components";
import UserProfile from '../../components/UserProfile';

export default function ProfilePage() {
  const router = useRouter();
  const { did } = router.query;
  const { orbis } = useOrbis();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (did) {
      loadProfile();
    }

    async function loadProfile() {
      setLoading(true);
      setError(null);
      try {
        // Get profile details
        const { data: profileData, error: profileError } = await orbis.getProfile(did);
        if (profileError) throw new Error(profileError);

        // Get user's posts
        const { data: postsData } = await orbis.getPosts({ did: did });

        // Get social connections using the correct API endpoints
        const [followersRes, followingRes] = await Promise.all([
          orbis.api.from("orbis_connections")
            .select()
            .eq('following_profile', did)
            .eq('active', true),
          orbis.api.from("orbis_connections")
            .select()
            .eq('did_profile', did)
            .eq('active', true)
        ]);

        // Get credentials
        const { data: credentials } = await orbis.api.rpc("get_verifiable_credentials", {
          q_subject: did,
          q_min_weight: 10
        });

        // Combine all data
        const enrichedProfile = {
          ...profileData,
          posts: postsData || [],
          followers: followersRes.data || [],
          following: followingRes.data || [],
          credentials: credentials || []
        };

        if (!profileData) {
          throw new Error('Profile not found');
        }

        console.log("Loaded profile data:", enrichedProfile);
        setUserDetails(enrichedProfile);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(typeof err === 'string' ? err : err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
  }, [did, orbis]);

  if (error) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Error loading profile</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{userDetails?.profile?.username || 'User Profile'} | YouBuidl</title>
        <meta name="description" content={userDetails?.profile?.description || 'User profile on YouBuidl'} />
      </Head>

      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-color)]"></div>
          </div>
        ) : (
          userDetails && <UserProfile details={userDetails} initialData={userDetails} />
        )}
      </div>
    </>
  );
}
