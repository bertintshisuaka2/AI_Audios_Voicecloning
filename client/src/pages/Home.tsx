import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Loader2, Mic, Volume2, Download, Share2, Trash2, LogOut, Languages } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function Home() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [text, setText] = useState("");
  const [selectedVoiceId, setSelectedVoiceId] = useState("");
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [cloneName, setCloneName] = useState("");
  const [enableTranslation, setEnableTranslation] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState("Auto-detect");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: availableVoices, isLoading: voicesLoading } = trpc.voices.getAvailable.useQuery();
  const { data: myClones, refetch: refetchClones } = trpc.voices.getMy.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: myAudios, refetch: refetchAudios } = trpc.tts.getMyAudios.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const generateMutation = trpc.tts.generate.useMutation({
    onSuccess: () => {
      toast.success("Speech generated successfully!");
      refetchAudios();
      setText("");
    },
    onError: (error) => {
      toast.error(`Failed to generate speech: ${error.message}`);
    },
  });

  const cloneMutation = trpc.voices.clone.useMutation({
    onSuccess: () => {
      toast.success("Voice cloned successfully!");
      refetchClones();
      setAudioFile(null);
      setCloneName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error) => {
      toast.error(`Failed to clone voice: ${error.message}`);
    },
  });

  const deleteCloneMutation = trpc.voices.delete.useMutation({
    onSuccess: () => {
      toast.success("Voice deleted successfully!");
      refetchClones();
    },
  });

  const deleteAudioMutation = trpc.tts.delete.useMutation({
    onSuccess: () => {
      toast.success("Audio deleted successfully!");
      refetchAudios();
    },
  });

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error("Please enter text to convert");
      return;
    }
    if (!selectedVoiceId) {
      toast.error("Please select a voice");
      return;
    }
    generateMutation.mutate({
      text: text.trim(),
      voiceId: selectedVoiceId,
      voiceName: selectedVoiceName,
      sourceLanguage: enableTranslation && sourceLanguage !== "Auto-detect" ? sourceLanguage : undefined,
      targetLanguage: enableTranslation ? targetLanguage : undefined,
    });
  };

  const handleClone = async () => {
    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }
    if (!cloneName.trim()) {
      toast.error("Please enter a name for the voice");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const audioData = base64.split(',')[1];
      cloneMutation.mutate({
        name: cloneName.trim(),
        audioData,
        fileName: audioFile.name,
      });
    };
    reader.readAsDataURL(audioFile);
  };

  const handleShare = (shareToken: string) => {
    const url = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="w-16 h-16 mx-auto mb-4" />}
            <CardTitle className="text-3xl font-bold">{APP_TITLE}</CardTitle>
            <CardDescription className="text-lg mt-2">
              Transform text into natural speech with AI voice cloning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Text-to-Speech</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Convert any text to natural-sounding speech with masculine and feminine voices
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary" />
                <span className="font-medium">Voice Cloning</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload audio samples to clone any voice and use it for speech generation
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Share & Download</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Download generated audio or share it with others via link
              </p>
            </div>
            <Button className="w-full mt-6" size="lg" asChild>
              <a href={getLoginUrl()}>Get Started</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="w-10 h-10" />}
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="clone">Clone Voice</TabsTrigger>
            <TabsTrigger value="library">My Library</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Text to Speech</CardTitle>
                <CardDescription>Enter text and select a voice to generate speech</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="text">Text</Label>
                  <span className={`text-xs ${text.length > 10000 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                    {text.length.toLocaleString()} / 10,000 characters
                  </span>
                </div>
                <Textarea
                  id="text"
                  placeholder="Enter the text you want to convert to speech..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                {text.length > 10000 && (
                  <p className="text-xs text-destructive">
                    ⚠️ Text exceeds 10,000 character limit. Please shorten your text.
                  </p>
                )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="voice">Voice</Label>
                  <Select
                    value={selectedVoiceId}
                    onValueChange={(value) => {
                      setSelectedVoiceId(value);
                      const voice = [...(availableVoices || []), ...(myClones || [])].find(
                        (v) => ('voice_id' in v ? v.voice_id : v.voiceId) === value
                      );
                      setSelectedVoiceName(voice ? ('name' in voice ? voice.name : '') : '');
                    }}
                  >
                    <SelectTrigger id="voice">
                      <SelectValue placeholder={voicesLoading ? "Loading voices..." : "Select a voice"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableVoices && availableVoices.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Pre-built Voices</div>
                          {availableVoices.map((voice) => (
                            <SelectItem key={voice.voice_id} value={voice.voice_id}>
                              {voice.name}
                              {voice.labels && Object.keys(voice.labels).length > 0 && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({Object.values(voice.labels).join(', ')})
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {myClones && myClones.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">My Cloned Voices</div>
                          {myClones.map((clone) => (
                            <SelectItem key={clone.voiceId} value={clone.voiceId}>
                              {clone.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                      {(!availableVoices || availableVoices.length === 0) && (!myClones || myClones.length === 0) && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No voices available. Please configure your ElevenLabs API key in Settings.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  {!voicesLoading && (!availableVoices || availableVoices.length === 0) && (!myClones || myClones.length === 0) && (
                    <p className="text-xs text-amber-600">
                      ⚠️ No voices available. Please add your ElevenLabs API key in Settings → Secrets to enable voice generation.
                    </p>
                  )}
                </div>

                <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="translate" className="text-sm font-medium cursor-pointer">
                        Enable Translation
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Auto-detect input language and translate to target language
                      </p>
                    </div>
                    <Switch
                      id="translate"
                      checked={enableTranslation}
                      onCheckedChange={setEnableTranslation}
                    />
                  </div>
                  {enableTranslation && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="sourceLanguage" className="text-sm">Source Language</Label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger id="sourceLanguage">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Auto-detect">🔍 Auto-detect</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                            <SelectItem value="French">French (Français)</SelectItem>
                            <SelectItem value="German">German (Deutsch)</SelectItem>
                            <SelectItem value="Italian">Italian (Italiano)</SelectItem>
                            <SelectItem value="Portuguese">Portuguese (Português)</SelectItem>
                            <SelectItem value="Russian">Russian (Русский)</SelectItem>
                            <SelectItem value="Japanese">Japanese (日本語)</SelectItem>
                            <SelectItem value="Korean">Korean (한국어)</SelectItem>
                            <SelectItem value="Chinese">Chinese (中文)</SelectItem>
                            <SelectItem value="Arabic">Arabic (العربية)</SelectItem>
                            <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                            <SelectItem value="Dutch">Dutch (Nederlands)</SelectItem>
                            <SelectItem value="Polish">Polish (Polski)</SelectItem>
                            <SelectItem value="Turkish">Turkish (Türkçe)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetLanguage" className="text-sm">Target Language</Label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger id="targetLanguage">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                            <SelectItem value="French">French (Français)</SelectItem>
                            <SelectItem value="German">German (Deutsch)</SelectItem>
                            <SelectItem value="Italian">Italian (Italiano)</SelectItem>
                            <SelectItem value="Portuguese">Portuguese (Português)</SelectItem>
                            <SelectItem value="Russian">Russian (Русский)</SelectItem>
                            <SelectItem value="Japanese">Japanese (日本語)</SelectItem>
                            <SelectItem value="Korean">Korean (한국어)</SelectItem>
                            <SelectItem value="Chinese">Chinese (中文)</SelectItem>
                            <SelectItem value="Arabic">Arabic (العربية)</SelectItem>
                            <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                            <SelectItem value="Dutch">Dutch (Nederlands)</SelectItem>
                            <SelectItem value="Polish">Polish (Polski)</SelectItem>
                            <SelectItem value="Turkish">Turkish (Türkçe)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateMutation.isPending || !text.trim() || !selectedVoiceId || text.length > 10000}
                  className="w-full"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Generate Speech
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clone" className="space-y-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Clone a Voice</CardTitle>
                <CardDescription>
                  Upload an audio sample (at least 10 seconds) to create a custom voice clone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cloneName">Voice Name</Label>
                  <Input
                    id="cloneName"
                    placeholder="e.g., My Voice, John's Voice"
                    value={cloneName}
                    onChange={(e) => setCloneName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audioFile">Audio File</Label>
                  <Input
                    id="audioFile"
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, OGG. Minimum 10 seconds of clear audio recommended.
                  </p>
                </div>

                <Button
                  onClick={handleClone}
                  disabled={cloneMutation.isPending || !audioFile || !cloneName.trim()}
                  className="w-full"
                  size="lg"
                >
                  {cloneMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cloning Voice...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Clone Voice
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {myClones && myClones.length > 0 && (
              <Card className="max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle>My Cloned Voices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {myClones.map((clone) => (
                      <div
                        key={clone.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                      >
                        <div>
                          <p className="font-medium">{clone.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(clone.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCloneMutation.mutate({ id: clone.id })}
                          disabled={deleteCloneMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <Card className="max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle>Generated Audio</CardTitle>
                <CardDescription>Your text-to-speech audio files</CardDescription>
              </CardHeader>
              <CardContent>
                {!myAudios || myAudios.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No audio files yet. Generate some speech to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myAudios.map((audio) => (
                      <div key={audio.id} className="border rounded-lg p-4 space-y-3">
                        <div>
                          <p className="font-medium text-sm text-muted-foreground">{audio.voiceName}</p>
                          <p className="text-sm mt-1">{audio.text.substring(0, 100)}...</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(audio.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <audio controls className="w-full" src={audio.audioUrl} />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={audio.audioUrl} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => audio.shareToken && handleShare(audio.shareToken)}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAudioMutation.mutate({ id: audio.id })}
                            disabled={deleteAudioMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
