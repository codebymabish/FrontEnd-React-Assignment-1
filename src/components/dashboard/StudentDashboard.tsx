import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, FileQuestion, Award, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase signOut error:", error);
      toast.error("Error logging out");
      return;
    }

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      /* ignore */
    }

    toast.success("Logged out successfully");
    window.location.replace("/auth");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Find Teachers</CardTitle>
              <CardDescription>Search and connect</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Search for teachers by email or name and send connection requests.
          </p>
          <Button onClick={() => navigate("/find-teachers")} variant="gradient" className="w-full">Search Teachers</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Enrolled courses</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View all courses you're enrolled in and track your progress.
          </p>
          <Button variant="outline" className="w-full">View Courses</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <FileQuestion className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Available Quizzes</CardTitle>
              <CardDescription>Take quizzes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View and attempt quizzes assigned by your teachers.
          </p>
          <Button variant="gradient" className="w-full">View Quizzes</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-accent/10">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle>My Results</CardTitle>
              <CardDescription>Quiz performance</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View your quiz scores, progress, and detailed performance reports.
          </p>
          <Button variant="outline" className="w-full">View Results</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>My Teachers</CardTitle>
              <CardDescription>Connected teachers</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            View all teachers you're connected with and manage connections.
          </p>
          <Button variant="outline" className="w-full">View Teachers</Button>
        </CardContent>
      </Card>

      <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20">
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Your learning progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Courses Enrolled</span>
            <span className="text-2xl font-bold text-primary">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Quizzes Completed</span>
            <span className="text-2xl font-bold text-accent">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Score</span>
            <span className="text-2xl font-bold text-primary">0%</span>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
