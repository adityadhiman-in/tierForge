import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import TierItemComponent from "./TierItem";
import type { TierItem } from "@/types/tier";

interface ItemPoolProps {
  items: TierItem[];
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

const ItemPool = ({ items, onAddItem, onRemoveItem }: ItemPoolProps) => {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-muted-foreground uppercase tracking-wider">
          Unranked Items
        </h3>
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-brand text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <Droppable droppableId="pool" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-wrap gap-3 min-h-[100px] rounded-lg p-4 transition-colors border-2 border-dashed ${
              snapshot.isDraggingOver
                ? "border-primary/40 bg-primary/5"
                : "border-border/30 bg-muted/20"
            }`}
          >
            {items.map((item, idx) => (
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

export default ItemPool;
