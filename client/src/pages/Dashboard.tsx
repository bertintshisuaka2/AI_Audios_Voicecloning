import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  Mic, 
  Volume2, 
  Library, 
  Clock, 
  ArrowRight,
  FileAudio,
  Users,
  Settings
} from "lucide-react";
import { Link } from "wouter";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { data: myAudios } = trpc.tts.getMyAudios.useQuery();
  const { data: myClones } = trpc.voices.getMy.useQuery();

  const recentAudios = myAudios?.slice(0, 5) || [];
  const totalAudios = myAudios?.length || 0;
  const totalClones = myClones?.length || 0;

  const quickLinks = [
    {
      title: "Generate Speech",
      description: "Convert text to speech with AI voices",
      icon: Volume2,
      color: "text-white",
      bgColor: "bg-white/10",
      page: "generate"
    },
    {
      title: "Clone Voice",
      description: "Create custom voice clones from audio",
      icon: Mic,
      color: "text-gray-200",
      bgColor: "bg-gray-200/10",
      page: "clone"
    },
    {
      title: "My Library",
      description: "View all generated audio files",
      icon: Library,
      color: "text-gray-300",
      bgColor: "bg-gray-300/10",
      page: "library"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-white/20 to-gray-100/20 border border-white/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-gray-200/80">
          Ready to create amazing voice content? Choose an option below to get started.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Total Audio Files
            </CardTitle>
            <FileAudio className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalAudios}</div>
            <p className="text-xs text-gray-200/60 mt-1">
              Generated speech files
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Voice Clones
            </CardTitle>
            <Users className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalClones}</div>
            <p className="text-xs text-gray-200/60 mt-1">
              Custom voice models
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-white/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Account Status
            </CardTitle>
            <Settings className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">Active</div>
            <p className="text-xs text-gray-200/60 mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <Card className="bg-black/50 border-white/30">
          <CardHeader>
            <CardTitle className="text-white">Quick Links</CardTitle>
            <CardDescription className="text-gray-200/60">
              Access key features quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-white/20 hover:border-white/50 hover:bg-white/5 transition-all group"
              >
                <div className={`p-3 rounded-lg ${link.bgColor}`}>
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white group-hover:text-gray-200">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-200/60">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/50 border-white/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-200/60">
              Your latest generated audio files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAudios.length === 0 ? (
              <div className="text-center py-8">
                <Volume2 className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-gray-200/60 text-sm">
                  No audio files yet. Start by generating your first speech!
                </p>
                <Button
                  onClick={() => onNavigate("generate")}
                  className="mt-4 bg-white text-black hover:bg-gray-200"
                  size="sm"
                >
                  Generate Speech
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAudios.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-white/20"
                  >
                    <div className="p-2 rounded bg-white/10">
                      <FileAudio className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {audio.text.substring(0, 50)}
                        {audio.text.length > 50 ? "..." : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-200/60">
                          {audio.voiceName}
                        </span>
                        <span className="text-xs text-gray-200/40">•</span>
                        <span className="text-xs text-gray-200/60">
                          {new Date(audio.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {totalAudios > 5 && (
                  <Button
                    onClick={() => onNavigate("library")}
                    variant="outline"
                    size="sm"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    View All ({totalAudios})
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
