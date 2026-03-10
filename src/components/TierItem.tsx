import { X } from "lucide-react";
import type { TierItem as TierItemType } from "@/types/tier";

interface TierItemProps {
  item: TierItemType;
  onRemove?: (id: string) => void;
  isDragging?: boolean;
}

const TierItemComponent = ({ item, onRemove, isDragging }: TierItemProps) => {
  return (
    <div
      className={`relative group flex items-center justify-center rounded-lg overflow-hidden tier-item-shadow transition-transform ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-105"
      }`}
      style={{
        backgroundColor: `hsl(${item.color})`,
        minWidth: item.imageUrl ? "100px" : "100px",
        height: item.imageUrl ? "100px" : "64px",
      }}
    >
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.label}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : null}
      {(!item.imageUrl || item.label) && (
        <span
          className={`font-semibold px-3 py-1 truncate max-w-[120px] ${
            item.imageUrl
              ? "absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center text-sm"
              : "text-base text-white"
          }`}
        >
          {item.label}
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.id);
          }}
          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default TierItemComponent;
