import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, BookOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Topic {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

interface Course {
  title: string;
}

const Topics = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({ title: "", description: "" });

  useEffect(() => {
    checkAuthAndLoadData();
  }, [courseId]);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await Promise.all([loadCourse(), loadTopics()]);
  };

  const loadCourse = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("title")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error("Error loading course:", error);
      toast({
        title: "Error",
        description: "Failed to load course",
        variant: "destructive",
      });
      navigate("/courses");
    }
  };

  const loadTopics = async () => {
    try {
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (error) {
      console.error("Error loading topics:", error);
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { error } = await supabase
        .from("topics")
        .insert({
          course_id: courseId,
          title: newTopic.title,
          description: newTopic.description || null,
        });

      if (error) throw error;

      toast({
        title: "Topic Created",
        description: "Your topic has been added successfully",
      });

      setNewTopic({ title: "", description: "" });
      setDialogOpen(false);
      await loadTopics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create topic",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    setDeleting(topicId);
    try {
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", topicId);

      if (error) throw error;

      toast({
        title: "Topic Deleted",
        description: "Topic has been removed",
      });

      await loadTopics();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete topic",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
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
              <h1 className="text-3xl font-bold mb-2">{course?.title || "Course"} - Topics</h1>
              <p className="text-muted-foreground">
                Manage topics for this course
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Topic</DialogTitle>
                  <DialogDescription>
                    Create a new topic for this course
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTopic}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Topic Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Newton's Laws of Motion"
                        value={newTopic.title}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the topic"
                        value={newTopic.description}
                        onChange={(e) =>
                          setNewTopic({ ...newTopic, description: e.target.value })
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
                        "Add Topic"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {topics.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first topic to organize course content
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <CardTitle>{topic.title}</CardTitle>
                  <CardDescription>
                    {topic.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDeleteTopic(topic.id)}
                    disabled={deleting === topic.id}
                    variant="destructive"
                    className="w-full"
                  >
                    {deleting === topic.id ? (
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

export default Topics;
