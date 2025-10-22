import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, FileQuestion, Award, User, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 mt-20"> 
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-card/50 p-6 rounded-lg shadow-sm backdrop-blur-sm">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Student Dashboard
              </h2>
              <p className="text-muted-foreground">Access your courses and quizzes</p>
            </div>
            <Button 
              onClick={() => navigate("/auth")} 
              variant="outline" 
              size="sm"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
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
      </div>
    </div>
  );
}
