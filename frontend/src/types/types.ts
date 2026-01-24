// features/auth/types.ts
export interface User {
  id: string;
  email: string;
  tenantId: string;
  campusId?: string;
  role: string;
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
