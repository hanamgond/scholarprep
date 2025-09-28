export type ApiError = {
  status?: number;
  message: string;
  details?: unknown;
  // add more fields if your backend returns them
};
