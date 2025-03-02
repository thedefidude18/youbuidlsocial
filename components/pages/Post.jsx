import React from 'react';
import { useRouter } from 'next/router';
import { useOrbis } from "@orbisclub/components";
import ArticleContent from '../ArticleContent';

export default function Post() {
  const router = useRouter();
  const { post_id } = router.query;
  const [post, setPost] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { orbis } = useOrbis();

  React.useEffect(() => {
    if (post_id) {
      loadPost();
    }

    async function loadPost() {
      const { data, error } = await orbis.getPost(post_id);
      if (error) {
        console.error("Error loading post:", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    }
  }, [post_id, orbis]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ArticleContent post={post} />
    </div>
  );
}