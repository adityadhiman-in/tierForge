import { useState, useCallback } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { Plus, RotateCcw, Download, Flame } from "lucide-react";
import TierRow from "@/components/TierRow";
import ItemPool from "@/components/ItemPool";
import AddItemDialog from "@/components/AddItemDialog";
import EditTierDialog from "@/components/EditTierDialog";
import { DEFAULT_TIERS, type Tier, type TierItem } from "@/types/tier";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [tiers, setTiers] = useState<Tier[]>(
    () => JSON.parse(JSON.stringify(DEFAULT_TIERS))
  );
  const [pool, setPool] = useState<TierItem[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editTier, setEditTier] = useState<Tier | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddItem = useCallback(
    (item: Omit<TierItem, "id">) => {
      const newItem: TierItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      setPool((prev) => [...prev, newItem]);
    },
    []
  );

  const handleRemoveItem = useCallback((itemId: string) => {
    setTiers((prev) =>
      prev.map((t) => ({
        ...t,
        items: t.items.filter((i) => i.id !== itemId),
      }))
    );
    setPool((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const handleDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // Helper to get items from a droppable
    const getItems = (id: string): TierItem[] => {
      if (id === "pool") return [...pool];
      return [...(tiers.find((t) => t.id === id)?.items || [])];
    };

    const sourceItems = getItems(source.droppableId);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      if (source.droppableId === "pool") {
        setPool(sourceItems);
      } else {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === source.droppableId ? { ...t, items: sourceItems } : t
          )
        );
      }
    } else {
      const destItems = getItems(destination.droppableId);
      destItems.splice(destination.index, 0, movedItem);

      if (source.droppableId === "pool") {
        setPool(sourceItems);
      } else {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === source.droppableId ? { ...t, items: sourceItems } : t
          )
        );
      }

      if (destination.droppableId === "pool") {
        setPool(destItems);
      } else {
        setTiers((prev) =>
          prev.map((t) =>
            t.id === destination.droppableId ? { ...t, items: destItems } : t
          )
        );
      }
    }
  }, [pool, tiers]);

  const handleEditTier = useCallback(
    (tierId: string) => {
      const tier = tiers.find((t) => t.id === tierId);
      if (tier) {
        setEditTier(tier);
        setEditDialogOpen(true);
      }
    },
    [tiers]
  );

  const handleSaveTier = useCallback(
    (tierId: string, label: string, color: string) => {
      setTiers((prev) =>
        prev.map((t) => (t.id === tierId ? { ...t, label, color } : t))
      );
    },
    []
  );

  const handleDeleteTier = useCallback((tierId: string) => {
    setTiers((prev) => {
      const tier = prev.find((t) => t.id === tierId);
      if (tier) {
        setPool((p) => [...p, ...tier.items]);
      }
      return prev.filter((t) => t.id !== tierId);
    });
  }, []);

  const handleAddTier = useCallback(() => {
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      label: "New",
      color: "225 14% 25%",
      items: [],
    };
    setTiers((prev) => [...prev, newTier]);
  }, []);

  const handleReset = useCallback(() => {
    const allItems = tiers.flatMap((t) => t.items);
    setPool((prev) => [...prev, ...allItems]);
    setTiers((prev) => prev.map((t) => ({ ...t, items: [] })));
    toast({ title: "Reset", description: "All items moved back to pool." });
  }, [tiers, toast]);

  const handleExport = useCallback(() => {
    const canvas = document.createElement("canvas");
    const tierEl = document.getElementById("tier-list");
    if (!tierEl) return;

    // Simple text export
    let text = "🏆 TierForge by Aditya\n\n";
    tiers.forEach((t) => {
      text += `[${t.label}] ${t.items.map((i) => i.label).join(", ") || "(empty)"}\n`;
    });
    if (pool.length > 0) {
      text += `\n[Unranked] ${pool.map((i) => i.label).join(", ")}`;
    }

    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Tier list copied to clipboard." });
    });
  }, [tiers, pool, toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 gradient-surface">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg gradient-brand flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
                TierForge
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">by Aditya</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Reset all tiers"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Copy to clipboard"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Tier Rows */}
          <motion.div
            id="tier-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, staggerChildren: 0.05 }}
            className="space-y-1.5"
          >
            {tiers.map((tier, idx) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <TierRow
                  tier={tier}
                  index={idx}
                  onEditTier={handleEditTier}
                  onRemoveItem={handleRemoveItem}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Add Tier Button */}
          <button
            onClick={handleAddTier}
            className="w-full py-2 rounded-lg border border-dashed border-border/50 text-muted-foreground/60 hover:text-muted-foreground hover:border-border transition-colors text-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Tier
          </button>

          {/* Item Pool */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ItemPool
              items={pool}
              onAddItem={() => setAddDialogOpen(true)}
              onRemoveItem={handleRemoveItem}
            />
          </motion.div>
        </DragDropContext>
      </main>

      {/* Dialogs */}
      <AddItemDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={handleAddItem}
      />
      <EditTierDialog
        tier={editTier}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSaveTier}
        onDelete={handleDeleteTier}
      />
    </div>
  );
};

export default Index;
