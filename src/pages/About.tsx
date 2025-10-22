import { Card } from "@/components/ui/card";
import { Target, Eye, Award, Users, Sparkles, TrendingUp, Heart, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "Leveraging AI and modern technology to revolutionize educational assessment",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear, honest communication with detailed analytics and reporting",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Commitment to delivering the highest quality educational tools",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive ecosystem for educators and learners worldwide",
    },
  ];

  const team = [
    {
      role: "Mission",
      title: "Empowering Education",
      description:
        "Our mission is to transform the way educators create and manage assessments by providing intelligent, efficient, and user-friendly quiz creation tools that save time and enhance learning outcomes.",
    },
    {
      role: "Vision",
      title: "Future of Learning",
      description:
        "We envision a world where every educator has access to powerful AI-driven tools that make creating engaging, personalized assessments effortless, enabling them to focus on what truly matters - teaching.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold">
              About <span className="text-gradient">QuizQuest</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              QuizQuest is an AI-powered educational platform that revolutionizes quiz creation and assessment.
              Our mission is to empower educators with intelligent tools while making learning engaging for students.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-18 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto space-y-12">
            
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 border-border/50 shadow-elevated hover:shadow-glow transition-smooth group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-smooth" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <TrendingUp className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">The Beginning</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    QuizQuest was founded by a team of educators and technologists who recognized the challenges teachers face in creating engaging, effective assessments. We saw firsthand how much time teachers spent on quiz creation, grading, and analysis.
                  </p>
                </div>
              </Card>

              <Card className="p-8 border-border/50 shadow-elevated hover:shadow-glow transition-smooth group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-smooth" />
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <Zap className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold">The Innovation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    With the power of artificial intelligence and modern web technologies, we set out to build a platform that would revolutionize the assessment process. Our goal was simple: make quiz creation effortless, grading automatic, and insights actionable.
                  </p>
                </div>
              </Card>
            </div>

            <Card className="p-8 md:p-12 border-primary/20 shadow-elevated bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-primary opacity-10 rounded-full blur-3xl" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <Heart className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Today & Beyond</span>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Today, QuizQuest serves <span className="text-primary font-semibold">thousands of educators worldwide</span>, helping them create over <span className="text-primary font-semibold">50,000 quizzes</span> and saving countless hours of work. But we're just getting started. We're continuously innovating and adding new features to make educational assessment better for everyone.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {team.map((item, index) => (
              <Card
                key={index}
                className="p-10 hover:shadow-elevated transition-smooth border-border/50 group hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-smooth" />
                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-primary text-primary-foreground rounded-full text-sm font-semibold shadow-glow">
                    <Sparkles className="w-4 h-4" />
                    {item.role}
                  </div>
                  <h3 className="text-4xl font-bold group-hover:text-gradient transition-smooth">{item.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description}
                  </p>
                  <div className="w-16 h-1 bg-gradient-primary rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">What Drives Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card
                key={index}
                className="p-8 text-center hover:shadow-elevated transition-smooth border-border/50 group hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-smooth" />
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 group-hover:rotate-6 transition-smooth">
                    <value.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-smooth">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Making an Impact Worldwide
            </h2>
            <p className="text-primary-foreground/80">
              Join thousands of educators transforming education
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: "10K+", label: "Active Users", icon: Users },
              { value: "50K+", label: "Quizzes Created", icon: Target },
              { value: "100+", label: "Countries", icon: Award },
              { value: "98%", label: "Satisfaction", icon: Heart },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-3 group">
                <div className="inline-flex w-12 h-12 bg-primary-foreground/10 backdrop-blur-sm rounded-xl items-center justify-center group-hover:scale-110 transition-smooth">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary-foreground group-hover:scale-110 transition-smooth">{stat.value}</div>
                <div className="text-primary-foreground/90 font-medium text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
