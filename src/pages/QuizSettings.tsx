import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save } from "lucide-react";

interface QuizSettings {
  shuffle_questions: boolean;
  marks_per_question: number;
  questions_per_page: number;
  time_limit: number | null;
}

const QuizSettings = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>({
    shuffle_questions: false,
    marks_per_question: 1,
    questions_per_page: 1,
    time_limit: null,
  });

  useEffect(() => {
    checkAuthAndLoadSettings();
  }, [quizId]);

  const checkAuthAndLoadSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await loadSettings();
  };

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("quizzes")
        .select("shuffle_questions, marks_per_question, questions_per_page, time_limit")
        .eq("id", quizId)
        .single();

      if (error) throw error;
      
      setSettings({
        shuffle_questions: data.shuffle_questions,
        marks_per_question: data.marks_per_question,
        questions_per_page: data.questions_per_page,
        time_limit: data.time_limit,
      });
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load quiz settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("quizzes")
        .update(settings)
        .eq("id", quizId);

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Quiz settings have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Quiz Settings</h1>
            <p className="text-muted-foreground">
              Configure quiz behavior and display options
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Question Display</CardTitle>
              <CardDescription>
                Control how questions are presented to students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shuffle">Shuffle Questions</Label>
                  <p className="text-sm text-muted-foreground">
                    Randomize the order of questions for each student
                  </p>
                </div>
                <Switch
                  id="shuffle"
                  checked={settings.shuffle_questions}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, shuffle_questions: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions_per_page">Questions Per Page</Label>
                <Input
                  id="questions_per_page"
                  type="number"
                  min="1"
                  max="20"
                  value={settings.questions_per_page}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      questions_per_page: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Number of questions to display on each page (1-20)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Scoring</CardTitle>
              <CardDescription>
                Configure how the quiz is scored
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="marks_per_question">Default Marks Per Question</Label>
                <Input
                  id="marks_per_question"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.marks_per_question}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      marks_per_question: parseInt(e.target.value) || 1,
                    })
                  }
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Default marks assigned to each question (can be overridden per question)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Time Limit</CardTitle>
              <CardDescription>
                Set a time limit for completing the quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                <Input
                  id="time_limit"
                  type="number"
                  min="1"
                  placeholder="No time limit"
                  value={settings.time_limit || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      time_limit: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Leave empty for no time limit
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizSettings;
