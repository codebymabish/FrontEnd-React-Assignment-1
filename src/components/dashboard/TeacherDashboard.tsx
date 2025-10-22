import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, FileQuestion, BarChart3, Settings, LogOut } from "lucide-react";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-card/50 p-6 rounded-lg shadow-sm backdrop-blur-sm ">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Teacher Dashboard
              </h2>
              <p className="text-muted-foreground">Manage your course quizzes and students</p>
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
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Courses</CardTitle>
                    <CardDescription>Manage your courses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and manage courses, add topics, and organize your teaching materials.
                </p>
                <Button onClick={() => navigate("/courses")} variant="gradient" className="w-full">View Courses</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>Manage student connections</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View student requests, manage connections, and track student progress.
                </p>
                <Button onClick={() => navigate("/connection-requests")} variant="outline" className="w-full">Manage Connections</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileQuestion className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Quizzes</CardTitle>
                    <CardDescription>Create AI-powered quizzes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate quizzes from PDFs or topics using AI, manage quiz settings.
                </p>
                <Button onClick={() => navigate("/courses")} variant="gradient" className="w-full">Manage Quizzes</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-accent/10">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>View quiz reports</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate and download detailed reports of student quiz performance.
                </p>
                <Button variant="outline" className="w-full">View Reports</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 hover:shadow-glow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Quiz configuration</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure quiz settings: shuffle, pagination, marks, and more.
                </p>
                <Button variant="outline" className="w-full">Configure</Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-primary/20 md:col-span-2 lg:col-span-1 hover:shadow-glow">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Overview of your teaching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Courses</span>
                  <span className="text-2xl font-bold text-primary">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Students</span>
                  <span className="text-2xl font-bold text-accent">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Quizzes Created</span>
                  <span className="text-2xl font-bold text-primary">0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
