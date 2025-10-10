import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, ArrowLeft, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Teacher {
  user_id: string;
  full_name: string;
  email: string;
  bio: string | null;
  connectionStatus?: 'none' | 'pending' | 'approved' | 'rejected';
}

const FindTeachers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadTeachers();
  }, []);

  const checkAuthAndLoadTeachers = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role !== "student") {
      navigate("/dashboard");
      return;
    }

    await loadTeachers(session.user.id);
  };

  const loadTeachers = async (studentId: string) => {
    try {
      // Get all teachers
      const { data: teacherRoles, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher");

      if (roleError) throw roleError;

      const teacherIds = teacherRoles?.map(r => r.user_id) || [];

      // Get teacher profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, bio")
        .in("user_id", teacherIds);

      if (profileError) throw profileError;

      // Get connection statuses
      const { data: connections } = await supabase
        .from("teacher_student_connections")
        .select("teacher_id, status")
        .eq("student_id", studentId);

      const connectionMap = new Map(
        connections?.map(c => [c.teacher_id, c.status]) || []
      );

      const teachersWithStatus: Teacher[] = (profiles || []).map(p => ({
        ...p,
        connectionStatus: (connectionMap.get(p.user_id) as 'none' | 'pending' | 'approved' | 'rejected') || 'none'
      }));

      setTeachers(teachersWithStatus);
    } catch (error) {
      console.error("Error loading teachers:", error);
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestConnection = async (teacherId: string) => {
    setRequesting(teacherId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from("teacher_student_connections")
        .insert({
          teacher_id: teacherId,
          student_id: session.user.id,
        });

      if (error) throw error;

      toast({
        title: "Request Sent",
        description: "Your connection request has been sent to the teacher",
      });

      await loadTeachers(session.user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send connection request",
        variant: "destructive",
      });
    } finally {
      setRequesting(null);
    }
  };

  const filteredTeachers = teachers.filter(
    t => t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Find Teachers</h1>
          <p className="text-muted-foreground">
            Search and connect with teachers
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card key={teacher.user_id}>
              <CardHeader>
                <CardTitle className="text-lg">{teacher.full_name}</CardTitle>
                <CardDescription>{teacher.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teacher.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {teacher.bio}
                  </p>
                )}
                
                {teacher.connectionStatus === 'none' && (
                  <Button
                    onClick={() => handleRequestConnection(teacher.user_id)}
                    disabled={requesting === teacher.user_id}
                    className="w-full"
                  >
                    {requesting === teacher.user_id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Request Connection
                      </>
                    )}
                  </Button>
                )}
                
                {teacher.connectionStatus === 'pending' && (
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Request Pending
                  </Badge>
                )}
                
                {teacher.connectionStatus === 'approved' && (
                  <Badge variant="default" className="w-full justify-center py-2">
                    Connected
                  </Badge>
                )}
                
                {teacher.connectionStatus === 'rejected' && (
                  <Badge variant="destructive" className="w-full justify-center py-2">
                    Request Declined
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No teachers found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindTeachers;
