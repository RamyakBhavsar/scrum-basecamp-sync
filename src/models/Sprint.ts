
export interface Sprint {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  tasks: string[];
  userId?: string;
}

export interface SprintInput {
  title: string;
  startDate: string;
  endDate: string;
  tasks?: string[];
}
