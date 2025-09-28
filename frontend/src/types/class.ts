// This should match your backend Section entity
export interface Section {
  id: string;
  name: string;
  // Add other properties like capacity, status if needed
}

// This should match your backend Class entity
export interface Class {
  id: string;
  name: string;
  sections: Section[];
  // Add other properties like school_id, capacity, status if needed
}
