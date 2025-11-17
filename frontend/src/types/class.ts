// This should match your backend Section entity (for detail pages)
export interface Section {
  id: string;
  name: string;
  // Add other properties like capacity, status if needed
}

// This should match your backend Class entity (for detail pages)
export interface Class {
  id: string;
  name: string;
  sections: Section[];
  // Add other properties like school_id, capacity, status if needed
}

// --- NEW TYPES FOR FILTER DROPDOWNS ---

// This is for the "Classes" dropdown in your student filter
export interface ApiClass {
  id: string;
  name: string;
}

// This is for the "Sections" dropdown in your student filter
export interface ApiSection {
  id: string;
  classId: string; // So you can filter sections by class
  name: string;
}