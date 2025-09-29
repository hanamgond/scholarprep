// src/pages/Students/students.utils.ts
import type { StudentListItem } from "../../types/student";

export const classes = ["", "9", "10", "11 (PUC I)", "12 (PUC II)"] as const;
export const sections = ["", "A", "B", "C", "D"] as const;
export const tracks = ["", "NEET", "JEE", "KCET", "Board"] as const;

export const perfLevels = [
  { label: "" as const, range: [0, 100] as [number, number] },
  { label: "excellent" as const, range: [90, 100] as [number, number] },
  { label: "good" as const, range: [75, 89.999] as [number, number] },
  { label: "average" as const, range: [50, 74.999] as [number, number] },
  { label: "poor" as const, range: [0, 49.999] as [number, number] },
];

export type Filters = {
  classFilter: string;
  sectionFilter: string;
  trackFilter: (typeof tracks)[number];
  perfLabel: (typeof perfLevels)[number]["label"];
  search: string;
};

export function perfRangeForLabel(label: Filters["perfLabel"]) {
  return perfLevels.find((p) => p.label === label)?.range ?? [0, 100];
}

export function applyFilters(students: StudentListItem[], f: Filters) {
  const [minPerf, maxPerf] = perfRangeForLabel(f.perfLabel);
  const q = f.search.trim().toLowerCase();

  return students.filter((s) => {
    if (f.classFilter && !s.className.includes(f.classFilter)) return false;
    if (f.sectionFilter && (s.section ?? "") !== f.sectionFilter) return false;
    if (f.trackFilter && s.track !== f.trackFilter) return false;
    if (s.metrics.accuracyPct < minPerf || s.metrics.accuracyPct > maxPerf) return false;

    if (
      q &&
      !(s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q))
    ) {
      return false;
    }
    return true;
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

// ---- Track helpers (no `any`)
export type Track = (typeof tracks)[number];

export function isTrack(v: unknown): v is Track {
  return typeof v === "string" && (tracks as readonly string[]).includes(v);
}

export function toTrack(v: string): Track {
  return isTrack(v) ? v : "";
}

// Optional helper
export function safeUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
