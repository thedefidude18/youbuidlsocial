import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <main className="max-w-3xl mx-auto py-6 px-4 sm:px-6">
      <div className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-6">About YouBuidl</h1>
        
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            YouBuidl is a community-driven platform dedicated to fostering the development and sustainability of public goods in the Web3 ecosystem. We believe in the power of collective action to create lasting positive impact through technology.
          </p>
        </section>

        {/* Rest of the About content */}
        {/* ... */}
      </div>
    </main>
  );
}