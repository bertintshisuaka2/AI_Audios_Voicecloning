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
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      page: "generate"
    },
    {
      title: "Clone Voice",
      description: "Create custom voice clones from audio",
      icon: Mic,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      page: "clone"
    },
    {
      title: "My Library",
      description: "View all generated audio files",
      icon: Library,
      color: "text-yellow-300",
      bgColor: "bg-yellow-300/10",
      page: "library"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="text-yellow-400/80">
          Ready to create amazing voice content? Choose an option below to get started.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/50 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Total Audio Files
            </CardTitle>
            <FileAudio className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{totalAudios}</div>
            <p className="text-xs text-yellow-400/60 mt-1">
              Generated speech files
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Voice Clones
            </CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{totalClones}</div>
            <p className="text-xs text-yellow-400/60 mt-1">
              Custom voice models
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/50 border-yellow-500/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Account Status
            </CardTitle>
            <Settings className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">Active</div>
            <p className="text-xs text-yellow-400/60 mt-1">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Links */}
        <Card className="bg-black/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-500">Quick Links</CardTitle>
            <CardDescription className="text-yellow-400/60">
              Access key features quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className="w-full flex items-center gap-4 p-4 rounded-lg bg-black/30 border border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all group"
              >
                <div className={`p-3 rounded-lg ${link.bgColor}`}>
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-yellow-500 group-hover:text-yellow-400">
                    {link.title}
                  </h3>
                  <p className="text-sm text-yellow-400/60">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-yellow-500/50 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/50 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-yellow-500 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-yellow-400/60">
              Your latest generated audio files
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentAudios.length === 0 ? (
              <div className="text-center py-8">
                <Volume2 className="w-12 h-12 text-yellow-500/30 mx-auto mb-3" />
                <p className="text-yellow-400/60 text-sm">
                  No audio files yet. Start by generating your first speech!
                </p>
                <Button
                  onClick={() => onNavigate("generate")}
                  className="mt-4 bg-yellow-500 text-black hover:bg-yellow-400"
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
                    className="flex items-start gap-3 p-3 rounded-lg bg-black/30 border border-yellow-500/20"
                  >
                    <div className="p-2 rounded bg-yellow-500/10">
                      <FileAudio className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-yellow-500 truncate">
                        {audio.text.substring(0, 50)}
                        {audio.text.length > 50 ? "..." : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-400/60">
                          {audio.voiceName}
                        </span>
                        <span className="text-xs text-yellow-400/40">•</span>
                        <span className="text-xs text-yellow-400/60">
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
                    className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
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
