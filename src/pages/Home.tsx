import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Zap, Clock, BarChart, Shield } from "lucide-react";
import heroImage from "../assets/hero-image.jpg";

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      icon: BookOpen,
      title: "Smart Quiz Creation",
      description: "Generate quizzes from PDFs, Word docs, or just topics. AI-powered question generation.",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Easy student-teacher connections with request-based linking system.",
    },
    {
      icon: Zap,
      title: "Instant Grading",
      description: "Automatic grading and detailed performance analytics for every quiz.",
    },
    {
      icon: Clock,
      title: "Timed Assessments",
      description: "Built-in quiz timers with customizable settings for fair testing.",
    },
    {
      icon: BarChart,
      title: "Detailed Reports",
      description: "Comprehensive reports with PDF export capabilities for tracking progress.",
    },
    {
      icon: Shield,
      title: "Attendance Control",
      description: "Mark attendance and control quiz access based on participation.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Quizzes Created" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                  AI-Powered Quiz Platform
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Transform Education with{" "}
                <span className="text-gradient">QuizQuest</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                Create, manage, and analyze quizzes effortlessly. Empower teachers and engage students with our intelligent quiz platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="gradient" className="group" onClick={() => navigate("/auth")}>
                  Get Started Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-smooth" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/services")}>
                  View Features
                </Button>
              </div>
              <div className="flex gap-8 pt-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-full" />
              <img
                src={heroImage}
                alt="QuizQuest Platform"
                className="relative rounded-2xl shadow-elevated w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-19 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything You Need for{" "}
              <span className="text-gradient">Effective Learning</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to make quiz creation and management seamless
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 transition-smooth group border-primary/50 shadow-glow"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-smooth">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-5xl font-bold text-gradient">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
