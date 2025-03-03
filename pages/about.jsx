import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About | YouBuidl</title>
        <meta name="description" content="Learn about YouBuidl's mission to support and grow the public goods ecosystem" />
      </Head>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">About YouBuidl</h1>
          
          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              YouBuidl is a community-driven platform dedicated to fostering the development and sustainability of public goods in the Web3 ecosystem. We believe in the power of collective action to create lasting positive impact through technology.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Connect</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  We bring together builders, funders, and supporters of public goods, creating a vibrant ecosystem of collaboration and innovation.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Fund</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Through our platform, we facilitate direct funding and support for public goods projects that benefit the wider Web3 community.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Build</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  We provide tools, resources, and infrastructure to help builders create sustainable public goods.
                </p>
              </div>
              <div className="bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Grow</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Our community-driven approach ensures continuous growth and evolution of the public goods ecosystem.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Built on Open Social Protocol</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              YouBuidl is powered by Orbis, an open social protocol that ensures data ownership remains with users while maintaining a decentralized infrastructure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-semibold mb-6">Join Our Community</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Whether you're a builder, funder, or supporter of public goods, there's a place for you in our community.
            </p>
            <div className="flex gap-6">
              <Link 
                href="/create" 
                className="inline-block px-8 py-4 text-lg bg-[var(--brand-color)] text-white rounded-lg hover:bg-[var(--brand-color-hover)] transition-colors"
              >
                Start Building
              </Link>
              <Link 
                href="/projects" 
                className="inline-block px-8 py-4 text-lg bg-white dark:bg-dark-secondary text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-tertiary transition-colors"
              >
                Explore Projects
              </Link>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
