import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Palette, Camera } from "lucide-react";

const STYLE_TEMPLATES = [
  { name: "Photorealistic", prompt: "hyperrealistic, 8k, detailed", icon: Camera },
  { name: "Digital Art", prompt: "digital art, concept art, trending on artstation", icon: Palette },
  { name: "Oil Painting", prompt: "oil painting, classical art style, masterpiece", icon: Wand2 },
  { name: "Anime Style", prompt: "anime style, manga art, vibrant colors", icon: Sparkles },
];

const QUALITY_MODIFIERS = [
  "masterpiece", "best quality", "ultra detailed", "8k", "professional",
  "stunning", "beautiful", "artistic", "cinematic lighting"
];

interface PromptComposerProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PromptComposer({ prompt, onPromptChange, onGenerate, isGenerating }: PromptComposerProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const applyStyleTemplate = (template: typeof STYLE_TEMPLATES[0]) => {
    const currentPrompt = prompt.trim();
    const newPrompt = currentPrompt 
      ? `${currentPrompt}, ${template.prompt}`
      : template.prompt;
    onPromptChange(newPrompt);
    setSelectedStyle(template.name);
  };

  const addQualityModifier = (modifier: string) => {
    const currentPrompt = prompt.trim();
    if (!currentPrompt.includes(modifier)) {
      const newPrompt = currentPrompt 
        ? `${currentPrompt}, ${modifier}`
        : modifier;
      onPromptChange(newPrompt);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Describe your image
          </label>
          <Textarea
            placeholder="A majestic dragon soaring through clouds at sunset..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 resize-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Style Templates
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STYLE_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <Button
                  key={template.name}
                  variant={selectedStyle === template.name ? "default" : "secondary"}
                  size="sm"
                  onClick={() => applyStyleTemplate(template)}
                  className="h-auto p-3 flex flex-col gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{template.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Quality Enhancers
          </label>
          <div className="flex flex-wrap gap-2">
            {QUALITY_MODIFIERS.map((modifier) => (
              <Badge
                key={modifier}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors border-border/50"
                onClick={() => addQualityModifier(modifier)}
              >
                {modifier}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 font-semibold"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}