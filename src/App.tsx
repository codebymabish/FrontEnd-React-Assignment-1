import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FindTeachers from "./pages/FindTeachers";
import ConnectionRequests from "./pages/ConnectionRequests";
import Courses from "./pages/Courses";
import Topics from "./pages/Topics";
import Quizzes from "./pages/Quizzes";
import QuizQuestions from "./pages/QuizQuestions";
import QuizSettings from "./pages/QuizSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/find-teachers" element={<FindTeachers />} />
          <Route path="/connection-requests" element={<ConnectionRequests />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId/topics" element={<Topics />} />
          <Route path="/courses/:courseId/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:quizId/questions" element={<QuizQuestions />} />
          <Route path="/quizzes/:quizId/settings" element={<QuizSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
