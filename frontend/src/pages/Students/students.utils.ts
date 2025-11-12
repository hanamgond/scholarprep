// We import the 'Student' type which is what our API service will return
import type { Student } from "../../types/student";

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

// We update this function to filter on 'Student' objects from the new API
export function applyFilters(students: Student[], f: Filters) {
  // const [minPerf, maxPerf] = perfRangeForLabel(f.perfLabel); // Hidden
  const q = f.search.trim().toLowerCase();

  return students.filter((s) => {
    // --- FILTERS TEMPORARILY DISABLED ---
    // These properties don't exist on the new backend object,
    // so we "hide" this functionality for now to prevent a crash.

    // if (f.classFilter && s.className && !s.className.includes(f.classFilter)) return false;
    // if (f.sectionFilter && (s.section ?? "") !== f.sectionFilter) return false;
    // if (f.trackFilter && s.track && s.track !== f.trackFilter) return false;
    // if (s.metrics && (s.metrics.accuracyPct < minPerf || s.metrics.accuracyPct > maxPerf)) return false;

    // --- SEARCH LOGIC UPDATED ---
    // We update this to search by the new fields: firstName, lastName, and admissionNo
    if (q) {
      const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
      if (
        !fullName.includes(q) &&
        !s.admissionNo.toLowerCase().includes(q)
      ) {
        return false;
      }
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