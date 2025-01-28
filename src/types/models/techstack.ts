export enum TechCategory {
  BACKEND = "BACKEND",
  FRONTEND = "FRONTEND",
  MOBILE = "MOBILE",
  OTHER = "OTHER"
}

export interface TechStack {
  id: number;
  name: string;
  category: TechCategory;
}