import { useState, useRef } from "react";
import { ImagePlus, Type } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ITEM_COLORS, type TierItem } from "@/types/tier";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<TierItem, "id">) => void;
}

const AddItemDialog = ({ open, onOpenChange, onAdd }: AddItemDialogProps) => {
  const [label, setLabel] = useState("");
  const [selectedColor, setSelectedColor] = useState(ITEM_COLORS[0]);
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!label.trim() && !imageUrl) return;
    onAdd({
      label: label.trim(),
      color: selectedColor,
      imageUrl,
    });
    setLabel("");
    setImageUrl(undefined);
    setSelectedColor(ITEM_COLORS[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Image upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative flex items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-border/50 bg-muted/30 cursor-pointer hover:border-primary/40 transition-colors overflow-hidden"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="w-8 h-8" />
                <span className="text-sm">Click to upload image</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Label */}
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              <Type className="w-3.5 h-3.5 inline mr-1" />
              Label
            </label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Item name..."
              className="bg-muted/30 border-border/50"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Color (only when no image) */}
          {!imageUrl && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {ITEM_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      selectedColor === color
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: `hsl(${color})` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!label.trim() && !imageUrl}
            className="w-full py-2.5 rounded-lg gradient-brand text-primary-foreground font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Add Item
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
