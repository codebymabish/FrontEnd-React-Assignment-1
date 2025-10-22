import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Brain,
  FileBarChart,
  Settings,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Brain,
      title: "AI-Powered Quiz Generation",
      description: "Transform any document into engaging quizzes instantly",
      features: [
        "PDF and document processing",
        "Multiple question types",
        "Automatic difficulty adjustment",
        "Smart answer validation",
      ],
      gradient: "from-violet-500 to-purple-500",
    },
    {
      icon: FileBarChart,
      title: "Advanced Analytics",
      description: "Gain valuable insights into student performance",
      features: [
        "Real-time performance tracking",
        "Detailed progress reports",
        "Visual data representation",
        "Performance trends analysis",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Efficiently manage student interactions and progress",
      features: [
        "Student grouping",
        "Progress monitoring",
        "Personalized feedback",
        "Engagement tracking",
      ],
      gradient: "from-emerald-500 to-green-500",
    },
    {
      icon: Settings,
      title: "Customization Tools",
      description: "Tailor the platform to your teaching style",
      features: [
        "Quiz customization",
        "Flexible scoring options",
        "Timer settings",
        "Question bank management",
      ],
      gradient: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 bg-grid-white/8 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
           
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-20">
              Transform Your Teaching with{" "}
              <span className="text-gradient">QuizQuest</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Leverage AI-powered tools to create engaging assessments, track progress,
              and enhance the learning experience.
            </p>
          </div>
        </div>
      </section>

     
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group relative p-6 overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-glow"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-6 transition-opacity duration-300`}
                />
                <div className="relative space-y-4">
                  
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#7D4DEF]/10 transform transition-transform group-hover:scale-105"
                  >
                    <service.icon className="w-6 h-6 text-[#7D4DEF]" />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  </div>

               
                  <ul className="space-y-2 text-sm">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-[#7D4DEF]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-semibold">Ready to Revolutionize Your Teaching?</h2>
            <p className="text-muted-foreground">
              Join thousands of educators using QuizQuest to create engaging and
              effective assessments.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90"
            >
              Get Started Now
              <ArrowRight className="ml-2 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
