import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Heart, Copy, MoreHorizontal, Images } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface ImageGalleryProps {
  images: GeneratedImage[];
  onImageLike?: (id: string) => void;
  onImageDownload?: (image: GeneratedImage) => void;
  onImageShare?: (image: GeneratedImage) => void;
}

export function ImageGallery({ images, onImageLike, onImageDownload, onImageShare }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <Card className="p-12 bg-gradient-card border-border/50 shadow-card text-center">
        <Images className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No images yet</h3>
        <p className="text-muted-foreground">
          Your generated images will appear here. Start by creating your first masterpiece!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Images className="w-4 h-4 text-primary" />
            Generated Images ({images.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative rounded-lg overflow-hidden bg-background/20 border border-border/30 hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onImageLike?.(image.id)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Heart className={`w-4 h-4 ${image.liked ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onImageDownload?.(image)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onImageShare?.(image)}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => navigator.clipboard.writeText(image.prompt)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Image details */}
              <div className="p-3 space-y-2">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {image.prompt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {image.aspectRatio}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {image.parameters.steps} steps
                    </Badge>
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {image.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}