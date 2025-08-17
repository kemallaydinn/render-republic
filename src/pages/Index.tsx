import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Settings, Image, Zap, Key } from "lucide-react";
import { PromptComposer } from "@/components/PromptComposer";
import { ParameterControls } from "@/components/ParameterControls";
import { GenerationQueue } from "@/components/GenerationQueue";
import { ImageGallery } from "@/components/ImageGallery";
import { toast } from "sonner";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: Date;
  aspectRatio: string;
  parameters: {
    quality: number;
    steps: number;
    model: string;
  };
  liked?: boolean;
}

interface GenerationItem {
  id: string;
  prompt: string;
  status: "pending" | "generating" | "completed" | "failed";
  progress: number;
  estimatedTime?: number;
  imageUrl?: string;
  error?: string;
}

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState(7);
  const [steps, setSteps] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationQueue, setGenerationQueue] = useState<GenerationItem[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    // Check if this is a Supabase-connected project
    toast.info("To use AI image generation, connect your project to Supabase and configure Replicate API access.", {
      duration: 5000,
    });

    // For demo purposes, simulate generation
    const newItem: GenerationItem = {
      id: crypto.randomUUID(),
      prompt: prompt.trim(),
      status: "generating",
      progress: 0,
      estimatedTime: 45,
    };

    setGenerationQueue(prev => [...prev, newItem]);
    setIsGenerating(true);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationQueue(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { ...item, progress: Math.min(item.progress + 10, 90) }
            : item
        )
      );
    }, 1000);

    // Simulate completion after 5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationQueue(prev => 
        prev.map(item => 
          item.id === newItem.id 
            ? { ...item, status: "completed", progress: 100 }
            : item
        )
      );
      
      // Add to gallery (placeholder image)
      const newImage: GeneratedImage = {
        id: newItem.id,
        url: `https://picsum.photos/1024/1024?random=${Date.now()}`,
        prompt: prompt.trim(),
        timestamp: new Date(),
        aspectRatio,
        parameters: {
          quality,
          steps,
          model: "replicate/stable-diffusion",
        },
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setIsGenerating(false);
      toast.success("Image generated successfully!");
      
      // Remove from queue after 3 seconds
      setTimeout(() => {
        setGenerationQueue(prev => prev.filter(item => item.id !== newItem.id));
      }, 3000);
    }, 5000);
  };

  const handleImageLike = (id: string) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, liked: !img.liked } : img
      )
    );
  };

  const handleImageDownload = (image: GeneratedImage) => {
    // Create download link
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `generated-image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  const handleImageShare = (image: GeneratedImage) => {
    if (navigator.share) {
      navigator.share({
        title: 'AI Generated Image',
        text: image.prompt,
        url: image.url,
      });
    } else {
      navigator.clipboard.writeText(image.url);
      toast.success("Image URL copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Studio</h1>
                <p className="text-sm text-muted-foreground">Professional Image Generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Key className="w-4 h-4 mr-2" />
                API Setup
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Prompt & Parameters */}
          <div className="lg:col-span-1 space-y-6">
            <PromptComposer
              prompt={prompt}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
            
            <ParameterControls
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              quality={quality}
              onQualityChange={setQuality}
              steps={steps}
              onStepsChange={setSteps}
            />

            {generationQueue.length > 0 && (
              <GenerationQueue items={generationQueue} />
            )}
          </div>

          {/* Right Column - Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery
              images={generatedImages}
              onImageLike={handleImageLike}
              onImageDownload={handleImageDownload}
              onImageShare={handleImageShare}
            />
          </div>
        </div>
      </div>

      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-glow rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-glow rounded-full blur-3xl opacity-20" />
      </div>
    </div>
  );
};

export default Index;