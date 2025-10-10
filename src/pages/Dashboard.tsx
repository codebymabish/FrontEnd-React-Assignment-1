import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { GraduationCap, LogOut, User as UserIcon, BookOpen, Users, BarChart } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  bio: string | null;
  avatar_url: string | null;
}

interface UserRole {
  role: "teacher" | "student";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<"teacher" | "student" | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStats, setConnectionStats] = useState({ total: 0, pending: 0 });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadUserData(session.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/auth");
        } else if (session) {
          setUser(session.user);
          await loadUserData(session.user.id);
        }
      }
    );

    checkAuth();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadUserData = async (userId: string) => {
    try {
      const [{ data: profileData }, { data: roleData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", userId).single(),
        supabase.from("user_roles").select("role").eq("user_id", userId).single(),
      ]);

      if (profileData) setProfile(profileData);
      if (roleData) {
        setUserRole(roleData.role);
        await loadConnectionStats(userId, roleData.role);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadConnectionStats = async (userId: string, role: "teacher" | "student") => {
    try {
      const query = supabase
        .from("teacher_student_connections")
        .select("status", { count: "exact" });

      if (role === "teacher") {
        query.eq("teacher_id", userId);
      } else {
        query.eq("student_id", userId);
      }

      const [{ count: total }, { count: pending }] = await Promise.all([
        query.eq("status", "approved"),
        query.eq("status", "pending"),
      ]);

      setConnectionStats({ total: total || 0, pending: pending || 0 });
    } catch (error) {
      console.error("Error loading connection stats:", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">
                {userRole === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
              </h1>
              <p className="text-muted-foreground">Welcome back, {profile?.full_name || "User"}!</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userRole === "teacher" ? "Total Students" : "Enrolled Courses"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{connectionStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {userRole === "teacher" ? "Connected students" : "Connected teachers"}
              </p>
              {connectionStats.pending > 0 && (
                <p className="text-xs text-primary mt-1">
                  {connectionStats.pending} pending request{connectionStats.pending !== 1 ? 's' : ''}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userRole === "teacher" ? "Active Quizzes" : "Quizzes Taken"}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {userRole === "teacher" ? "Published quizzes" : "Completed assessments"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userRole === "teacher" ? "Reports Generated" : "Average Score"}
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userRole === "teacher" ? "0" : "0%"}
              </div>
              <p className="text-xs text-muted-foreground">
                {userRole === "teacher" ? "This month" : "Across all quizzes"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Your Profile
              </CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{profile?.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{userRole}</p>
              </div>
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Coming Soon Cards */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                {userRole === "teacher" ? "Quick Actions" : "My Quizzes"}
              </CardTitle>
              <CardDescription>
                {userRole === "teacher"
                  ? "Manage courses, quizzes, and students"
                  : "View and take available quizzes"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {userRole === "teacher"
                    ? "Course management, AI quiz generation, student tracking, and reporting features are being built."
                    : "Quiz taking, progress tracking, and performance analytics features are on the way."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
