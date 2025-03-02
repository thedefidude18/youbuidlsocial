import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About | YouBuidl</title>
        <meta name="description" content="Learn about YouBuidl's mission to support and grow the public goods ecosystem" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white dark:bg-dark-primary">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>
        
        <div className="flex pt-16 h-screen">
          <div className="hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-dark-primary border-r border-gray-100 dark:border-dark-border">
            <LeftSidebar />
          </div>

          <div className="flex-1 md:ml-64 md:mr-80 overflow-y-auto">
            <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-6">About YouBuidl</h1>
                
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    YouBuidl is a community-driven platform dedicated to fostering the development and sustainability of public goods in the Web3 ecosystem. We believe in the power of collective action to create lasting positive impact through technology.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Connect</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We bring together builders, funders, and supporters of public goods, creating a vibrant ecosystem of collaboration and innovation.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Fund</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Through our platform, we facilitate direct funding and support for public goods projects that benefit the wider Web3 community.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Build</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        We provide tools, resources, and infrastructure to help builders create sustainable public goods.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Grow</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Our community-driven approach ensures continuous growth and evolution of the public goods ecosystem.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Built on Open Social Protocol</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    YouBuidl is powered by Orbis, an open social protocol that ensures data ownership remains with users while maintaining a decentralized infrastructure. This approach eliminates reliance on centralized entities for data storage and management.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Whether you're a builder, funder, or supporter of public goods, there's a place for you in our community. Get involved today and help shape the future of Web3.
                  </p>
                  <div className="flex gap-4">
                    <Link 
                      href="/create" 
                      className="inline-block px-6 py-3 bg-[var(--brand-color)] text-white rounded-lg hover:bg-[var(--brand-color-hover)] transition-colors"
                    >
                      Start Building
                    </Link>
                    <Link 
                      href="/projects" 
                      className="inline-block px-6 py-3 bg-gray-100 dark:bg-dark-secondary text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-tertiary transition-colors"
                    >
                      Explore Projects
                    </Link>
                  </div>
                </section>
              </div>
            </main>
          </div>

          <div className="hidden md:block fixed right-0 top-16 bottom-0 w-80 bg-white dark:bg-dark-primary border-l border-gray-100 dark:border-dark-border">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}