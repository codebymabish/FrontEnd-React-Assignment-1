-- Create enum for connection status
CREATE TYPE public.connection_status AS ENUM ('pending', 'approved', 'rejected');

-- Create teacher_student_connections table
CREATE TABLE public.teacher_student_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  student_id UUID NOT NULL,
  status connection_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, student_id)
);

-- Enable RLS
ALTER TABLE public.teacher_student_connections ENABLE ROW LEVEL SECURITY;

-- Students can view their own connection requests
CREATE POLICY "Students can view own connections"
ON public.teacher_student_connections
FOR SELECT
USING (
  auth.uid() = student_id OR auth.uid() = teacher_id
);

-- Students can create connection requests
CREATE POLICY "Students can create connections"
ON public.teacher_student_connections
FOR INSERT
WITH CHECK (
  auth.uid() = student_id AND
  public.has_role(auth.uid(), 'student')
);

-- Teachers can update connection status
CREATE POLICY "Teachers can update connections"
ON public.teacher_student_connections
FOR UPDATE
USING (
  auth.uid() = teacher_id AND
  public.has_role(auth.uid(), 'teacher')
);

-- Students can delete their pending requests
CREATE POLICY "Students can delete pending requests"
ON public.teacher_student_connections
FOR DELETE
USING (
  auth.uid() = student_id AND
  status = 'pending'
);

-- Add trigger for updated_at
CREATE TRIGGER update_teacher_student_connections_updated_at
BEFORE UPDATE ON public.teacher_student_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();