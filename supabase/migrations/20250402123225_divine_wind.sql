/*
  # Course Management System Schema

  1. New Tables
    - `profiles`: User profile information
    - `courses`: Course information and metadata
    - `modules`: Course sections/modules
    - `lessons`: Individual lessons within modules
    - `enrollments`: Student course enrollments
    - `progress`: Lesson completion tracking
    - `assignments`: Course assignments
    - `submissions`: Assignment submissions

  2. Security
    - RLS enabled on all tables
    - Role-based access control
    - Granular permissions for students and instructors
*/

-- Create custom types if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('student', 'instructor');
  END IF;
END $$;

-- Drop existing policies
DO $$ 
BEGIN
  -- Drop policies for profiles
  DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Drop policies for courses
  DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON courses;
  DROP POLICY IF EXISTS "Instructors can manage their courses" ON courses;
  
  -- Drop policies for modules
  DROP POLICY IF EXISTS "Modules are viewable by enrolled students and instructors" ON modules;
  DROP POLICY IF EXISTS "Instructors can manage their modules" ON modules;
  
  -- Drop policies for lessons
  DROP POLICY IF EXISTS "Lessons are viewable by enrolled students and instructors" ON lessons;
  DROP POLICY IF EXISTS "Instructors can manage their lessons" ON lessons;
  
  -- Drop policies for enrollments
  DROP POLICY IF EXISTS "Students can view their enrollments" ON enrollments;
  DROP POLICY IF EXISTS "Students can enroll in courses" ON enrollments;
  
  -- Drop policies for progress
  DROP POLICY IF EXISTS "Students can view and update their progress" ON progress;
  
  -- Drop policies for assignments
  DROP POLICY IF EXISTS "Assignments are viewable by enrolled students and instructors" ON assignments;
  DROP POLICY IF EXISTS "Instructors can manage their assignments" ON assignments;
  
  -- Drop policies for submissions
  DROP POLICY IF EXISTS "Students can view and create their submissions" ON submissions;
  DROP POLICY IF EXISTS "Instructors can view and grade submissions" ON submissions;
EXCEPTION
  WHEN undefined_table THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'student',
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id uuid REFERENCES profiles(id) NOT NULL,
  title text NOT NULL,
  description text,
  thumbnail_url text,
  price decimal(10,2) DEFAULT 0,
  level text NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add is_published column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE courses ADD COLUMN is_published boolean DEFAULT false;
  END IF;
END $$;

-- Modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  content_type text NOT NULL, -- 'video', 'document', 'text'
  content text NOT NULL, -- URL for video/document, or markdown for text
  order_index integer NOT NULL,
  duration interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES profiles(id) NOT NULL,
  course_id uuid REFERENCES courses(id) NOT NULL,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(student_id, course_id)
);

-- Progress table
CREATE TABLE IF NOT EXISTS progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid REFERENCES enrollments(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES lessons(id) NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  due_date timestamptz,
  total_points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  score integer,
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  UNIQUE(assignment_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies safely
DO $$ 
BEGIN
  -- Profiles Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles are viewable by everyone' AND tablename = 'profiles') THEN
    CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update own profile' AND tablename = 'profiles') THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING (auth.uid() = id);
  END IF;

  -- Courses Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Published courses are viewable by everyone' AND tablename = 'courses') THEN
    CREATE POLICY "Published courses are viewable by everyone"
      ON courses FOR SELECT
      USING (is_published = true OR auth.uid() = instructor_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage their courses' AND tablename = 'courses') THEN
    CREATE POLICY "Instructors can manage their courses"
      ON courses FOR ALL
      USING (auth.uid() = instructor_id);
  END IF;

  -- Modules Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Modules are viewable by enrolled students and instructors' AND tablename = 'modules') THEN
    CREATE POLICY "Modules are viewable by enrolled students and instructors"
      ON modules FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM courses c
          LEFT JOIN enrollments e ON e.course_id = c.id
          WHERE c.id = modules.course_id
          AND (c.instructor_id = auth.uid() OR e.student_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage their modules' AND tablename = 'modules') THEN
    CREATE POLICY "Instructors can manage their modules"
      ON modules FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = modules.course_id
          AND courses.instructor_id = auth.uid()
        )
      );
  END IF;

  -- Lessons Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Lessons are viewable by enrolled students and instructors' AND tablename = 'lessons') THEN
    CREATE POLICY "Lessons are viewable by enrolled students and instructors"
      ON lessons FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM modules m
          JOIN courses c ON c.id = m.course_id
          LEFT JOIN enrollments e ON e.course_id = c.id
          WHERE m.id = lessons.module_id
          AND (c.instructor_id = auth.uid() OR e.student_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage their lessons' AND tablename = 'lessons') THEN
    CREATE POLICY "Instructors can manage their lessons"
      ON lessons FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM modules m
          JOIN courses c ON c.id = m.course_id
          WHERE m.id = lessons.module_id
          AND c.instructor_id = auth.uid()
        )
      );
  END IF;

  -- Enrollments Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view their enrollments' AND tablename = 'enrollments') THEN
    CREATE POLICY "Students can view their enrollments"
      ON enrollments FOR SELECT
      USING (student_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can enroll in courses' AND tablename = 'enrollments') THEN
    CREATE POLICY "Students can enroll in courses"
      ON enrollments FOR INSERT
      WITH CHECK (student_id = auth.uid());
  END IF;

  -- Progress Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view and update their progress' AND tablename = 'progress') THEN
    CREATE POLICY "Students can view and update their progress"
      ON progress FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM enrollments
          WHERE enrollments.id = progress.enrollment_id
          AND enrollments.student_id = auth.uid()
        )
      );
  END IF;

  -- Assignments Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Assignments are viewable by enrolled students and instructors' AND tablename = 'assignments') THEN
    CREATE POLICY "Assignments are viewable by enrolled students and instructors"
      ON assignments FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM courses c
          LEFT JOIN enrollments e ON e.course_id = c.id
          WHERE c.id = assignments.course_id
          AND (c.instructor_id = auth.uid() OR e.student_id = auth.uid())
        )
      );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can manage their assignments' AND tablename = 'assignments') THEN
    CREATE POLICY "Instructors can manage their assignments"
      ON assignments FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM courses
          WHERE courses.id = assignments.course_id
          AND courses.instructor_id = auth.uid()
        )
      );
  END IF;

  -- Submissions Policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Students can view and create their submissions' AND tablename = 'submissions') THEN
    CREATE POLICY "Students can view and create their submissions"
      ON submissions FOR ALL
      USING (student_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Instructors can view and grade submissions' AND tablename = 'submissions') THEN
    CREATE POLICY "Instructors can view and grade submissions"
      ON submissions FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM assignments a
          JOIN courses c ON c.id = a.course_id
          WHERE a.id = submissions.assignment_id
          AND c.instructor_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Functions
CREATE OR REPLACE FUNCTION check_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if all lessons are completed
  IF EXISTS (
    SELECT 1
    FROM enrollments e
    WHERE e.id = NEW.enrollment_id
    AND NOT EXISTS (
      SELECT 1
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses c ON c.id = m.course_id
      WHERE c.id = e.course_id
      AND NOT EXISTS (
        SELECT 1
        FROM progress p
        WHERE p.enrollment_id = e.id
        AND p.lesson_id = l.id
      )
    )
  ) THEN
    -- Update enrollment completion
    UPDATE enrollments
    SET completed_at = NOW()
    WHERE id = NEW.enrollment_id
    AND completed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for course completion
DROP TRIGGER IF EXISTS check_course_completion_trigger ON progress;
CREATE TRIGGER check_course_completion_trigger
AFTER INSERT OR UPDATE ON progress
FOR EACH ROW
EXECUTE FUNCTION check_course_completion();