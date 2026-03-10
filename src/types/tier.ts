export interface TierItem {
  id: string;
  label: string;
  imageUrl?: string;
  color: string;
}

export interface Tier {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}

export const DEFAULT_TIERS: Tier[] = [
  { id: "tier-s", label: "S", color: "0 85% 55%", items: [] },
  { id: "tier-a", label: "A", color: "25 95% 55%", items: [] },
  { id: "tier-b", label: "B", color: "45 95% 55%", items: [] },
  { id: "tier-c", label: "C", color: "140 60% 45%", items: [] },
  { id: "tier-d", label: "D", color: "210 70% 55%", items: [] },
  { id: "tier-f", label: "F", color: "225 10% 40%", items: [] },
];

export const ITEM_COLORS = [
  "225 14% 18%",
  "0 85% 55%",
  "25 95% 55%",
  "45 95% 55%",
  "140 60% 45%",
  "210 70% 55%",
  "270 60% 55%",
  "330 70% 55%",
];
