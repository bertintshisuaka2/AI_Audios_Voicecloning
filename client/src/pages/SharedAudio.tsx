import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { Download, Loader2, Volume2 } from "lucide-react";
import { useRoute } from "wouter";

export default function SharedAudio() {
  const [, params] = useRoute("/shared/:token");
  const token = params?.token || "";

  const { data: audio, isLoading, error } = trpc.tts.getShared.useQuery(
    { token },
    { enabled: !!token }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !audio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Audio Not Found</CardTitle>
            <CardDescription>
              This audio file doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10" />}
          <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-primary" />
              <CardTitle>Shared Audio</CardTitle>
            </div>
            <CardDescription>Generated with {audio.voiceName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm">{audio.text}</p>
            </div>

            <audio controls className="w-full" src={audio.audioUrl} autoPlay />

            <Button variant="outline" className="w-full" asChild>
              <a href={audio.audioUrl} download>
                <Download className="w-4 h-4 mr-2" />
                Download Audio
              </a>
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Created {new Date(audio.createdAt).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
