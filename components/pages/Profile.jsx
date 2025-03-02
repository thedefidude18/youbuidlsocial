import React, { useState, useEffect } from 'react';
import { useOrbis } from "@orbisclub/components";
import UserProfile from '../UserProfile';
import { useRouter } from 'next/router';

export default function Profile() {
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
        const { data: profileData, error: profileError } = await orbis.getProfile(did);
        if (profileError) throw new Error(profileError);
        
        setUserDetails(profileData);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [did, orbis]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <UserProfile details={userDetails} />
    </div>
  );
}