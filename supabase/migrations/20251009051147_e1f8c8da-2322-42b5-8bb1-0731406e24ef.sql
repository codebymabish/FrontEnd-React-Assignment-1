-- Create enum for question types
CREATE TYPE public.question_type AS ENUM ('mcq', 'true_false', 'short_answer');

-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create topics table
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  shuffle_questions BOOLEAN NOT NULL DEFAULT false,
  marks_per_question INTEGER NOT NULL DEFAULT 1,
  questions_per_page INTEGER NOT NULL DEFAULT 1,
  time_limit INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type question_type NOT NULL DEFAULT 'mcq',
  options JSONB,
  correct_answer TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Teachers can view own courses"
ON public.courses FOR SELECT
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view courses from connected teachers"
ON public.courses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.teacher_student_connections
    WHERE teacher_id = courses.teacher_id
    AND student_id = auth.uid()
    AND status = 'approved'
  )
);

CREATE POLICY "Teachers can create courses"
ON public.courses FOR INSERT
WITH CHECK (
  auth.uid() = teacher_id AND
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Teachers can update own courses"
ON public.courses FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own courses"
ON public.courses FOR DELETE
USING (auth.uid() = teacher_id);

-- Topics policies
CREATE POLICY "Teachers can view topics of own courses"
ON public.topics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = topics.course_id
    AND courses.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view topics from connected teachers"
ON public.topics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    JOIN public.teacher_student_connections
    ON courses.teacher_id = teacher_student_connections.teacher_id
    WHERE courses.id = topics.course_id
    AND teacher_student_connections.student_id = auth.uid()
    AND teacher_student_connections.status = 'approved'
  )
);

CREATE POLICY "Teachers can create topics in own courses"
ON public.topics FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = topics.course_id
    AND courses.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can update topics in own courses"
ON public.topics FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = topics.course_id
    AND courses.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can delete topics in own courses"
ON public.topics FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.courses
    WHERE courses.id = topics.course_id
    AND courses.teacher_id = auth.uid()
  )
);

-- Quizzes policies
CREATE POLICY "Teachers can view own quizzes"
ON public.quizzes FOR SELECT
USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view published quizzes from connected teachers"
ON public.quizzes FOR SELECT
USING (
  is_published = true AND
  EXISTS (
    SELECT 1 FROM public.teacher_student_connections
    WHERE teacher_id = quizzes.teacher_id
    AND student_id = auth.uid()
    AND status = 'approved'
  )
);

CREATE POLICY "Teachers can create quizzes"
ON public.quizzes FOR INSERT
WITH CHECK (
  auth.uid() = teacher_id AND
  public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Teachers can update own quizzes"
ON public.quizzes FOR UPDATE
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete own quizzes"
ON public.quizzes FOR DELETE
USING (auth.uid() = teacher_id);

-- Questions policies
CREATE POLICY "Teachers can view questions of own quizzes"
ON public.questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Students can view questions of published quizzes"
ON public.questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    JOIN public.teacher_student_connections
    ON quizzes.teacher_id = teacher_student_connections.teacher_id
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.is_published = true
    AND teacher_student_connections.student_id = auth.uid()
    AND teacher_student_connections.status = 'approved'
  )
);

CREATE POLICY "Teachers can create questions in own quizzes"
ON public.questions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can update questions in own quizzes"
ON public.questions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.teacher_id = auth.uid()
  )
);

CREATE POLICY "Teachers can delete questions in own quizzes"
ON public.questions FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = questions.quiz_id
    AND quizzes.teacher_id = auth.uid()
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
BEFORE UPDATE ON public.topics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();