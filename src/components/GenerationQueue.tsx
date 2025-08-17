import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface GenerationItem {
  id: string;
  prompt: string;
  status: "pending" | "generating" | "completed" | "failed";
  progress: number;
  estimatedTime?: number;
  imageUrl?: string;
  error?: string;
}

interface GenerationQueueProps {
  items: GenerationItem[];
}

export function GenerationQueue({ items }: GenerationQueueProps) {
  if (items.length === 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Generation Queue ({items.length})
        </h3>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-background/30 border border-border/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.prompt}
                  </p>
                  
                  {item.status === "generating" && (
                    <div className="mt-2 space-y-1">
                      <Progress value={item.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item.progress}% complete</span>
                        {item.estimatedTime && (
                          <span>~{formatTime(item.estimatedTime)} remaining</span>
                        )}
                      </div>
                    </div>
                  )}

                  {item.error && (
                    <p className="text-xs text-destructive mt-1">{item.error}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.status === "pending" && (
                    <Badge variant="outline" className="text-warning">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                  
                  {item.status === "generating" && (
                    <Badge variant="outline" className="text-primary">
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating
                    </Badge>
                  )}
                  
                  {item.status === "completed" && (
                    <Badge variant="outline" className="text-success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  )}
                  
                  {item.status === "failed" && (
                    <Badge variant="outline" className="text-destructive">
                      <XCircle className="w-3 h-3 mr-1" />
                      Failed
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}