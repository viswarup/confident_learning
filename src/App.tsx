import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Brain, BookOpen, Users, Trophy, ChevronRight, Github, Twitter, Plus } from 'lucide-react';
import { CourseCard } from './components/CourseCard';
import { AddCourseForm } from './components/AddCourseForm';
import { AuthModal } from './components/AuthModal';
import { Blog } from './pages/Blog';
import { courses as initialCourses } from './data/courses';
import type { Course } from './types';

function App() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAddCourse = (newCourse: Omit<Course, 'id' | 'enrolledStudents' | 'rating'>) => {
    const course: Course = {
      ...newCourse,
      id: (courses.length + 1).toString(),
      enrolledStudents: 0,
      rating: 0
    };
    setCourses(prev => [...prev, course]);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <Link to="/" className="text-xl font-bold text-gray-900">AILearn</Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#courses" className="text-gray-600 hover:text-gray-900">Courses</a>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Sign In
            </button>
          </nav>
        </header>

        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    Master AI with Expert-Led
                    <span className="text-indigo-600"> Online Learning</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Transform your future with comprehensive AI education. Learn from industry experts and get hands-on experience with cutting-edge technology.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition flex items-center">
                      Start Learning
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition">
                      View Courses
                    </button>
                  </div>
                </div>
              </section>

              {/* Features */}
              <section id="features" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose AILearn?</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Expert-Led Courses</h3>
                      <p className="text-gray-600">Learn from industry professionals with real-world AI experience.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <Users className="w-12 h-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Community Learning</h3>
                      <p className="text-gray-600">Join a global community of AI enthusiasts and learners.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <Trophy className="w-12 h-12 text-indigo-600 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Certification</h3>
                      <p className="text-gray-600">Earn recognized certificates upon course completion.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Courses */}
              <section id="courses" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Courses</h2>
                    <button
                      onClick={() => setShowAddCourse(true)}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Course</span>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              </section>
            </>
          } />
        </Routes>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Brain className="w-8 h-8 text-indigo-400" />
                  <span className="text-xl font-bold">AILearn</span>
                </div>
                <p className="text-gray-400">Empowering the next generation of AI professionals.</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/" className="hover:text-white">Home</Link></li>
                  <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                  <li><a href="#courses" className="hover:text-white">Courses</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 AILearn. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {showAddCourse && (
          <AddCourseForm
            onAddCourse={handleAddCourse}
            onClose={() => setShowAddCourse(false)}
          />
        )}

        {showAuthModal && (
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;