import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface BlogPostProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

export function BlogPost({ title, excerpt, author, date, readTime, image }: BlogPostProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 hover:text-indigo-600">{title}</h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{author}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}