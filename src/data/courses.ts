import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of AI, including machine learning basics, neural networks, and practical applications in today\'s world.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    price: '$49',
    level: 'Beginner',
    duration: '6 weeks',
    instructor: 'Dr. Sarah Chen',
    enrolledStudents: 1234,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Master the core concepts of machine learning, including supervised and unsupervised learning, model evaluation, and deployment.',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    price: '$69',
    level: 'Intermediate',
    duration: '8 weeks',
    instructor: 'Prof. Michael Johnson',
    enrolledStudents: 892,
    rating: 4.7
  },
  {
    id: '3',
    title: 'Deep Learning Advanced',
    description: 'Dive deep into neural networks, convolutional networks, and transformers. Build real-world AI applications.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
    price: '$89',
    level: 'Advanced',
    duration: '10 weeks',
    instructor: 'Dr. Emily Rodriguez',
    enrolledStudents: 645,
    rating: 4.9
  },
  {
    id: '4',
    title: 'Natural Language Processing',
    description: 'Learn to process and analyze text data, build chatbots, and implement language models using modern NLP techniques.',
    image: 'https://images.unsplash.com/photo-1655720828018-edd2daec9349',
    price: '$79',
    level: 'Intermediate',
    duration: '8 weeks',
    instructor: 'Prof. David Lee',
    enrolledStudents: 756,
    rating: 4.6
  }
];