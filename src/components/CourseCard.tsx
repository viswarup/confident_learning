import React from 'react';
import { Star, Clock, Users } from 'lucide-react';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-md">
      <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
            {course.level}
          </span>
          <span className="text-indigo-600 font-semibold">{course.price}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{course.enrolledStudents} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div className="px-6 pb-6">
        <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
          Enroll Now
        </button>
      </div>
    </div>
  );
}