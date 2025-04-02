import { Database } from './lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Module = Database['public']['Tables']['modules']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type Progress = Database['public']['Tables']['progress']['Row'];
export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type Submission = Database['public']['Tables']['submissions']['Row'];

export interface CourseWithProgress extends Course {
  modules: (Module & {
    lessons: (Lesson & {
      completed?: boolean;
    })[];
  })[];
  enrollment?: Enrollment;
  totalLessons: number;
  completedLessons: number;
}

export interface AssignmentWithSubmission extends Assignment {
  submission?: Submission;
}