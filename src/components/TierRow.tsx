import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Pencil } from "lucide-react";
import TierItemComponent from "./TierItem";
import type { Tier } from "@/types/tier";

interface TierRowProps {
  tier: Tier;
  index: number;
  onEditTier: (tierId: string) => void;
  onRemoveItem: (itemId: string) => void;
}

const TierRow = ({ tier, index, onEditTier, onRemoveItem }: TierRowProps) => {
  return (
    <div className="flex rounded-lg overflow-hidden border border-border/50 bg-card/30">
      {/* Tier Label */}
      <button
        onClick={() => onEditTier(tier.id)}
        className="group relative flex-shrink-0 w-28 min-h-[90px] flex items-center justify-center font-display text-2xl font-bold text-white cursor-pointer transition-all hover:brightness-110"
        style={{ backgroundColor: `hsl(${tier.color})` }}
      >
        {tier.label}
        <Pencil className="absolute top-2 right-2 w-3.5 h-3.5 opacity-0 group-hover:opacity-80 transition-opacity text-white/80" />
      </button>

      {/* Droppable area */}
      <Droppable droppableId={tier.id} direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-wrap items-center gap-3 p-3 min-h-[90px] transition-colors ${
              snapshot.isDraggingOver ? "bg-primary/5" : ""
            }`}
          >
            {tier.items.map((item, idx) => (
              <Draggable key={item.id} draggableId={item.id} index={idx}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    <TierItemComponent
                      item={item}
                      onRemove={onRemoveItem}
                      isDragging={snap.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TierRow;
