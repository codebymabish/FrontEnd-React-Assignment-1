import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileQuestion, Loader2, Plus, Settings, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  is_published: boolean;
  topic_id: string | null;
  created_at: string;
}

interface Topic {
  id: string;
  title: string;
}

const Quizzes = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    topic_id: "",
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, [courseId]);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await Promise.all([loadTopics(), loadQuizzes(session.user.id)]);
  };

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("topics")
        .select("id, title")
        .eq("course_id", courseId);

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  const loadQuizzes = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("course_id", courseId)
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      toast({
        title: "Error",
        description: "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("quizzes")
        .insert({
          teacher_id: session.user.id,
          course_id: courseId,
          topic_id: newQuiz.topic_id || null,
          title: newQuiz.title,
          description: newQuiz.description || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Quiz Created",
        description: "Your quiz has been created successfully",
      });

      setNewQuiz({ title: "", description: "", topic_id: "" });
      setDialogOpen(false);
      
      if (data) {
        navigate(`/quizzes/${data.id}/questions`);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    setDeleting(quizId);
    try {
      const { error } = await supabase
        .from("quizzes")
        .delete()
        .eq("id", quizId);

      if (error) throw error;

      toast({
        title: "Quiz Deleted",
        description: "Quiz has been removed",
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) await loadQuizzes(session.user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete quiz",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublish = async (quizId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("quizzes")
        .update({ is_published: !currentStatus })
        .eq("id", quizId);

      if (error) throw error;

      toast({
        title: currentStatus ? "Quiz Unpublished" : "Quiz Published",
        description: currentStatus 
          ? "Students can no longer access this quiz"
          : "Students can now access this quiz",
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) await loadQuizzes(session.user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update quiz status",
        variant: "destructive",
      });
    }
  };

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
            onClick={() => navigate("/courses")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Course Quizzes</h1>
              <p className="text-muted-foreground">
                Create and manage quizzes for this course
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                  <DialogDescription>
                    Add a new quiz for this course
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateQuiz}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Chapter 1 Test"
                        value={newQuiz.title}
                        onChange={(e) =>
                          setNewQuiz({ ...newQuiz, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="topic">Topic (Optional)</Label>
                      <Select
                        value={newQuiz.topic_id}
                        onValueChange={(value) =>
                          setNewQuiz({ ...newQuiz, topic_id: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific topic</SelectItem>
                          {topics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the quiz"
                        value={newQuiz.description}
                        onChange={(e) =>
                          setNewQuiz({ ...newQuiz, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={creating}>
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Quiz"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No quizzes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first quiz to get started
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex-1">{quiz.title}</CardTitle>
                    <Badge variant={quiz.is_published ? "default" : "secondary"}>
                      {quiz.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {quiz.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => navigate(`/quizzes/${quiz.id}/questions`)}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Manage Questions
                  </Button>
                  <Button
                    onClick={() => navigate(`/quizzes/${quiz.id}/settings`)}
                    variant="outline"
                    className="w-full"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Quiz Settings
                  </Button>
                  <Button
                    onClick={() => handleTogglePublish(quiz.id, quiz.is_published)}
                    variant={quiz.is_published ? "secondary" : "default"}
                    className="w-full"
                  >
                    {quiz.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    disabled={deleting === quiz.id}
                    variant="destructive"
                    className="w-full"
                  >
                    {deleting === quiz.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
