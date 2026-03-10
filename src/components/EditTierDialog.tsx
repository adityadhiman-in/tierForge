import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Tier } from "@/types/tier";

const TIER_COLORS = [
  "0 85% 55%",
  "15 90% 55%",
  "25 95% 55%",
  "45 95% 55%",
  "80 60% 45%",
  "140 60% 45%",
  "180 60% 45%",
  "210 70% 55%",
  "270 60% 55%",
  "330 70% 55%",
  "225 10% 40%",
  "225 14% 25%",
];

interface EditTierDialogProps {
  tier: Tier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tierId: string, label: string, color: string) => void;
  onDelete: (tierId: string) => void;
}

const EditTierDialog = ({
  tier,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EditTierDialogProps) => {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (tier) {
      setLabel(tier.label);
      setColor(tier.color);
    }
  }, [tier]);

  if (!tier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display">Edit Tier</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Label
            </label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Tier name..."
              className="bg-muted/30 border-border/50"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {TIER_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-lg transition-all ${
                    color === c
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: `hsl(${c})` }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onSave(tier.id, label, color);
                onOpenChange(false);
              }}
              className="flex-1 py-2.5 rounded-lg gradient-brand text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Save
            </button>
            <button
              onClick={() => {
                onDelete(tier.id);
                onOpenChange(false);
              }}
              className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditTierDialog;
