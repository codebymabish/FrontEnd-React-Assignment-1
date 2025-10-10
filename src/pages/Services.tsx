import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Brain,
  CheckCircle,
  FileBarChart,
  Settings,
  Clock,
  Shuffle,
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Users,
      title: "Registration & Authentication",
      description: "Secure login for teachers and students with role-based access.",
    },
    {
      icon: FileText,
      title: "Intelligent Dashboard",
      description: "Personalized dashboards with profile and course management.",
    },
    {
      icon: Brain,
      title: "AI Quiz Creation",
      description: "AI-powered quiz generation from documents or topics.",
    },
    {
      icon: CheckCircle,
      title: "Quiz Access Control",
      description: "Attendance-based access management for quizzes.",
    },
    {
      icon: FileBarChart,
      title: "Report Generation",
      description: "Detailed analytics with PDF export capabilities.",
    },
    {
      icon: Clock,
      title: "Quiz Timer System",
      description: "Built-in timer for fair and timed assessments.",
    },
    {
      icon: Settings,
      title: "Advanced Quiz Settings",
      description: "Flexible configuration for quiz customization.",
    },
    {
      icon: Shuffle,
      title: "Question Randomization",
      description: "Randomization features to ensure unique experiences.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive features designed to revolutionize the way you create, manage, and analyze educational assessments
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-elevated transition-smooth border-border/50 group hover:border-primary/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-smooth flex-shrink-0">
                    <service.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Services;
