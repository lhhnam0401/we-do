export interface User {
  id: string;
  email: string;
  display_name: string;
  couple_id: string | null;
}

export interface Couple {
  id: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  members: User[];
}

export type PlanCategory = "travel" | "food" | "home" | "adventure" | "other";
export type PlanStatus = "pending" | "done";

export interface Plan {
  id: string;
  couple_id: string;
  created_by: string;
  title: string;
  description: string | null;
  category: PlanCategory;
  target_date: string | null;
  status: PlanStatus;
  completed_at: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  plan_id: string;
  uploaded_by: string;
  file_path: string;
  thumbnail_path: string;
  original_filename: string;
  created_at: string;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
