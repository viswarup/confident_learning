import React from 'react';
import { BlogPost } from '../components/BlogPost';

const blogPosts = [
  {
    title: 'The Future of AI in Education',
    excerpt: 'Explore how artificial intelligence is transforming the educational landscape and creating new opportunities for learners worldwide.',
    author: 'Dr. Sarah Chen',
    date: 'March 1, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485'
  },
  {
    title: 'Getting Started with Machine Learning',
    excerpt: 'A comprehensive guide for beginners looking to start their journey in machine learning and artificial intelligence.',
    author: 'Prof. Michael Johnson',
    date: 'February 28, 2024',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995'
  },
  {
    title: 'Ethics in AI Development',
    excerpt: 'Understanding the importance of ethical considerations in artificial intelligence development and implementation.',
    author: 'Dr. Emily Rodriguez',
    date: 'February 25, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349'
  }
];

export function Blog() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AILearn Blog</h1>
          <p className="text-xl text-gray-600">Latest insights, tutorials, and updates from the AI education world</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}