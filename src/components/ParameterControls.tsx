import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, Ratio, Zap } from "lucide-react";

interface ParameterControlsProps {
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  steps: number;
  onStepsChange: (steps: number) => void;
}

const ASPECT_RATIOS = [
  { value: "1:1", label: "Square (1:1)", dimensions: "1024×1024" },
  { value: "4:3", label: "Landscape (4:3)", dimensions: "1152×896" },
  { value: "3:4", label: "Portrait (3:4)", dimensions: "896×1152" },
  { value: "16:9", label: "Widescreen (16:9)", dimensions: "1344×768" },
  { value: "9:16", label: "Mobile (9:16)", dimensions: "768×1344" },
];

export function ParameterControls({
  aspectRatio,
  onAspectRatioChange,
  quality,
  onQualityChange,
  steps,
  onStepsChange,
}: ParameterControlsProps) {
  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-foreground">Generation Parameters</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Ratio className="w-3 h-3" />
              Aspect Ratio
            </Label>
            <Select value={aspectRatio} onValueChange={onAspectRatioChange}>
              <SelectTrigger className="bg-background/50 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    <div className="flex flex-col">
                      <span>{ratio.label}</span>
                      <span className="text-xs text-muted-foreground">{ratio.dimensions}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Quality Scale
              <span className="text-xs text-muted-foreground ml-auto">{quality}</span>
            </Label>
            <Slider
              value={[quality]}
              onValueChange={(value) => onQualityChange(value[0])}
              min={1}
              max={20}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Creative</span>
              <span>Precise</span>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Settings className="w-3 h-3" />
              Inference Steps
              <span className="text-xs text-muted-foreground ml-auto">{steps}</span>
            </Label>
            <Slider
              value={[steps]}
              onValueChange={(value) => onStepsChange(value[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Fast</span>
              <span>High Quality</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}