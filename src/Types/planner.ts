export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  day: string;
  type: 'task';
}

export interface DailyRoutine {
  id: string;
  name: string;
  description?: string;
  timeSlot: string;
  completed: boolean;
  day: string;
  type: 'routine';
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  targetFrequency: 'daily' | 'weekly';
  streak: number;
  completed: boolean;
  day: string;
  type: 'habit';
}

export interface IntegrityItem {
  id: string;
  word: string;
  commitment: string;
  completed: boolean;
  completedAt?: string;
  day: string;
  type: 'integrity';
}

export type PlannerItem = DailyTask | DailyRoutine | Habit | IntegrityItem;