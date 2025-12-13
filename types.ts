export interface Student {
  id: string;
  full_name: string;
  phone_number: string;
  image_url: string;
  class: string;
  notes: string;
}

export interface GoogleSheetRow {
  full_name: string;
  phone_number: string;
  image_url: string;
  class: string;
  notes: string;
}

export interface AppState {
  students: Student[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}