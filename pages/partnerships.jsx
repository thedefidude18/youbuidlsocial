import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import LeftSidebar from '../components/LeftSidebar';
import Sidebar from '../components/Sidebar';
import Link from 'next/link';

export default function Partnerships() {
  return (
    <>
      <Head>
        <title>Partnerships | YouBuidl</title>
        <meta name="description" content="Partner with YouBuidl to support and grow the public goods ecosystem" />
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
                <h1 className="text-3xl font-bold mb-6">Partner With Us</h1>
                
                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Why Partner with YouBuidl?</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Join us in shaping the future of public goods in the Web3 ecosystem. Our partnerships program is designed to create meaningful collaborations that drive innovation and sustainable growth in the space.
                  </p>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Partnership Opportunities</h2>
                  <div className="grid gap-6">
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Technical Integration</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Integrate your protocol or tools with YouBuidl to expand reach and provide value to our community of builders and supporters.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Funding Collaboration</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Partner with us to create funding programs that support public goods projects and drive innovation in specific areas of Web3.
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-secondary p-6 rounded-lg">
                      <h3 className="text-xl font-medium mb-3">Community Building</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Co-create events, hackathons, and educational initiatives that grow and strengthen the public goods ecosystem.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Benefits of Partnership</h2>
                  <ul className="list-disc pl-6 space-y-3 text-gray-600 dark:text-gray-300">
                    <li>Access to a growing community of Web3 builders and supporters</li>
                    <li>Opportunities to shape the future of public goods</li>
                    <li>Co-marketing and visibility opportunities</li>
                    <li>Early access to new features and initiatives</li>
                    <li>Direct impact on the development of sustainable public goods</li>
                  </ul>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Current Partners</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Add partner logos/cards here */}
                    <div className="h-32 bg-gray-50 dark:bg-dark-secondary rounded-lg flex items-center justify-center">
                      Partner Logo
                    </div>
                  </div>
                </section>

                <section className="mb-10">
                  <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Ready to explore partnership opportunities? We'd love to hear from you and discuss how we can collaborate to support public goods.
                  </p>
                  <Link 
                    href="mailto:partnerships@youbuidl.com" 
                    className="inline-block px-6 py-3 bg-[var(--brand-color)] text-white rounded-lg hover:bg-[var(--brand-color-hover)] transition-colors"
                  >
                    Contact Us
                  </Link>
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