import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Header from '../../components/Header';
import ArticleContent from '../../components/ArticleContent';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Orbis, Comments, User, useOrbis } from '@orbisclub/components';

export default function Post({ post, post_id }) {
  const { orbis, user } = useOrbis();
  return (
    <>
      <Head>
        {/** Title */}
        <title key="title">{post.content?.title}</title>
        <meta
          property="og:title"
          content={post.content?.title}
          key="og_title"
        />

        {/** Description */}
        <meta
          name="description"
          content={post.content?.data?.abstract}
          key="description"
        ></meta>
        <meta
          property="og:description"
          content={post.content?.data?.abstract}
          key="og_description"
        />
        <link rel="icon" href="/favicon.png" />

        {post.content?.media && post.content?.media.length > 0 && (
          <>
            {/**<meta property="og:image" content={"https://orbis.club/api/og-ipfs-image?hash=" + encodeURIComponent(seo.title_og_image)} />*/}
            <meta
              property="og:image"
              content={
                post.content.media[0].url.replace(
                  'ipfs://',
                  post.content.media[0].gateway
                ) + '?format=share-img'
              }
            />
            <meta name="twitter:card" content="summary_large_image" />
          </>
        )}
      </Head>
      <div className="antialiased flex flex-col min-h-screen bg-main">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          <section className="py-8">
            {' '}
            {/* Added padding-top and padding-bottom */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Page Content */}
                <div className="flex-grow">
                  <ArticleContent post={post} />
                </div>

                {/* Sidebar */}
                <div className="md:w-1/3">
                  <Sidebar />
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}

/** Load content for Blog */
Post.getInitialProps = async (context) => {
  let orbis_server = new Orbis({
    useLit: false,
  });
  let { data, error } = await orbis_server.getPost(context.query.post_id);
  /** Return results */
  return {
    post_id: context.query.post_id,
    post: data ? data : null,
  };
};
