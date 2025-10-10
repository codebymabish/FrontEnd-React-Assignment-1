import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, X, Loader2, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Connection {
  id: string;
  student_id: string;
  status: string;
  created_at: string;
  student: {
    full_name: string;
    email: string;
    bio: string | null;
  };
}

const ConnectionRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    checkAuthAndLoadConnections();
  }, []);

  const checkAuthAndLoadConnections = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleData?.role !== "teacher") {
      navigate("/dashboard");
      return;
    }

    await loadConnections(session.user.id);
  };

  const loadConnections = async (teacherId: string) => {
    try {
      const { data: connectionsData, error: connectionsError } = await supabase
        .from("teacher_student_connections")
        .select("id, student_id, status, created_at")
        .eq("teacher_id", teacherId)
        .order("created_at", { ascending: false });

      if (connectionsError) throw connectionsError;

      if (!connectionsData || connectionsData.length === 0) {
        setConnections([]);
        return;
      }

      // Get student profiles
      const studentIds = connectionsData.map(c => c.student_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, full_name, email, bio")
        .in("user_id", studentIds);

      if (profilesError) throw profilesError;

      const profileMap = new Map(
        profiles?.map(p => [p.user_id, p]) || []
      );

      const enrichedConnections = connectionsData.map(conn => ({
        ...conn,
        student: profileMap.get(conn.student_id) || {
          full_name: "Unknown",
          email: "Unknown",
          bio: null
        }
      }));

      setConnections(enrichedConnections as Connection[]);
    } catch (error) {
      console.error("Error loading connections:", error);
      toast({
        title: "Error",
        description: "Failed to load connection requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (connectionId: string, status: 'approved' | 'rejected') => {
    setProcessing(connectionId);
    try {
      const { error } = await supabase
        .from("teacher_student_connections")
        .update({ status })
        .eq("id", connectionId);

      if (error) throw error;

      toast({
        title: status === 'approved' ? "Request Approved" : "Request Declined",
        description: `Connection request has been ${status}`,
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) await loadConnections(session.user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update connection",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const pendingConnections = connections.filter(c => c.status === 'pending');
  const approvedConnections = connections.filter(c => c.status === 'approved');
  const rejectedConnections = connections.filter(c => c.status === 'rejected');

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
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold mb-2">Connection Requests</h1>
          <p className="text-muted-foreground">
            Manage your student connections
          </p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingConnections.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedConnections.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Declined ({rejectedConnections.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingConnections.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No pending requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <CardTitle>{connection.student.full_name}</CardTitle>
                    <CardDescription>{connection.student.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {connection.student.bio && (
                      <p className="text-sm text-muted-foreground">{connection.student.bio}</p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateStatus(connection.id, 'approved')}
                        disabled={processing === connection.id}
                        className="flex-1"
                      >
                        {processing === connection.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(connection.id, 'rejected')}
                        disabled={processing === connection.id}
                        variant="outline"
                        className="flex-1"
                      >
                        {processing === connection.id ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-2" />
                        )}
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedConnections.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No approved connections</p>
                </CardContent>
              </Card>
            ) : (
              approvedConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <CardTitle>{connection.student.full_name}</CardTitle>
                    <CardDescription>{connection.student.email}</CardDescription>
                  </CardHeader>
                  {connection.student.bio && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{connection.student.bio}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedConnections.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No declined requests</p>
                </CardContent>
              </Card>
            ) : (
              rejectedConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardHeader>
                    <CardTitle>{connection.student.full_name}</CardTitle>
                    <CardDescription>{connection.student.email}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConnectionRequests;
