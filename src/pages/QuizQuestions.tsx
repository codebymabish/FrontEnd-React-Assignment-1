import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, FileQuestion, Loader2, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: string;
  question_text: string;
  question_type: 'mcq' | 'true_false' | 'short_answer';
  options: any;
  correct_answer: string;
  marks: number;
  order_index: number;
}

const QuizQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    question_type: "mcq" as 'mcq' | 'true_false' | 'short_answer',
    options: ["", "", "", ""],
    correct_answer: "",
    marks: 1,
  });

  useEffect(() => {
    checkAuthAndLoadQuestions();
  }, [quizId]);

  const checkAuthAndLoadQuestions = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    await loadQuestions();
  };

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      let optionsData = null;
      let correctAnswer = newQuestion.correct_answer;

      if (newQuestion.question_type === "mcq") {
        const filteredOptions = newQuestion.options.filter((opt: string) => opt.trim() !== "");
        if (filteredOptions.length < 2) {
          throw new Error("Please provide at least 2 options for MCQ");
        }
        optionsData = filteredOptions;
      } else if (newQuestion.question_type === "true_false") {
        optionsData = ["True", "False"];
        if (!correctAnswer) {
          correctAnswer = "True";
        }
      }

      const { error } = await supabase
        .from("questions")
        .insert({
          quiz_id: quizId,
          question_text: newQuestion.question_text,
          question_type: newQuestion.question_type,
          options: optionsData,
          correct_answer: correctAnswer,
          marks: newQuestion.marks,
          order_index: questions.length,
        });

      if (error) throw error;

      toast({
        title: "Question Added",
        description: "Your question has been created successfully",
      });

      setNewQuestion({
        question_text: "",
        question_type: "mcq",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: 1,
      });
      setDialogOpen(false);
      await loadQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create question",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    setDeleting(questionId);
    try {
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) throw error;

      toast({
        title: "Question Deleted",
        description: "Question has been removed",
      });

      await loadQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
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
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Questions</h1>
              <p className="text-muted-foreground">
                Add and manage questions for this quiz
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Question</DialogTitle>
                  <DialogDescription>
                    Create a new question for this quiz
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateQuestion}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question_text">Question</Label>
                      <Textarea
                        id="question_text"
                        placeholder="Enter your question here"
                        value={newQuestion.question_text}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, question_text: e.target.value })
                        }
                        required
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="question_type">Question Type</Label>
                      <Select
                        value={newQuestion.question_type}
                        onValueChange={(value: any) =>
                          setNewQuestion({ 
                            ...newQuestion, 
                            question_type: value,
                            options: value === "mcq" ? ["", "", "", ""] : [],
                            correct_answer: ""
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mcq">Multiple Choice</SelectItem>
                          <SelectItem value="true_false">True/False</SelectItem>
                          <SelectItem value="short_answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newQuestion.question_type === "mcq" && (
                      <div className="space-y-2">
                        <Label>Options</Label>
                        {newQuestion.options.map((option: string, index: number) => (
                          <Input
                            key={index}
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                          />
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="correct_answer">Correct Answer</Label>
                      {newQuestion.question_type === "mcq" ? (
                        <Select
                          value={newQuestion.correct_answer}
                          onValueChange={(value) =>
                            setNewQuestion({ ...newQuestion, correct_answer: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            {newQuestion.options
                              .filter((opt: string) => opt.trim() !== "")
                              .map((option: string, index: number) => (
                                <SelectItem key={index} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      ) : newQuestion.question_type === "true_false" ? (
                        <Select
                          value={newQuestion.correct_answer}
                          onValueChange={(value) =>
                            setNewQuestion({ ...newQuestion, correct_answer: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="True">True</SelectItem>
                            <SelectItem value="False">False</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="correct_answer"
                          placeholder="Enter the correct answer"
                          value={newQuestion.correct_answer}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, correct_answer: e.target.value })
                          }
                          required
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks</Label>
                      <Input
                        id="marks"
                        type="number"
                        min="1"
                        value={newQuestion.marks}
                        onChange={(e) =>
                          setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) })
                        }
                        required
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
                        "Add Question"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first question to get started
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <Badge>{question.question_type.replace('_', ' ')}</Badge>
                        <Badge variant="secondary">{question.marks} {question.marks === 1 ? 'mark' : 'marks'}</Badge>
                      </div>
                      <CardTitle className="text-lg">{question.question_text}</CardTitle>
                    </div>
                    <Button
                      onClick={() => handleDeleteQuestion(question.id)}
                      disabled={deleting === question.id}
                      variant="ghost"
                      size="sm"
                    >
                      {deleting === question.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {question.question_type === "mcq" && question.options && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Options:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {question.options.map((option: string, i: number) => (
                          <li 
                            key={i} 
                            className={option === question.correct_answer ? "text-green-600 font-medium" : ""}
                          >
                            {option}
                            {option === question.correct_answer && " (Correct)"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {question.question_type === "true_false" && (
                    <p className="text-sm">
                      <span className="font-medium">Correct Answer:</span>{" "}
                      <span className="text-green-600">{question.correct_answer}</span>
                    </p>
                  )}
                  {question.question_type === "short_answer" && (
                    <p className="text-sm">
                      <span className="font-medium">Expected Answer:</span>{" "}
                      <span className="text-green-600">{question.correct_answer}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizQuestions;
