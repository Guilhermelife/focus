
export interface MockApp {
  id: string;
  name: string;
  category: 'Social' | 'Game' | 'Entertainment' | 'Productivity';
  iconColor: string;
  isBlocked: boolean;
}

export interface BlockSchedule {
  id: string; // usually matches profile id
  name: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  days: number[];    // 0 = Sunday, 1 = Monday, etc.
  isActive: boolean;
  strictMode: boolean;
}

export interface Profile {
  id: string;
  name: string;
  icon: 'briefcase' | 'moon' | 'book' | 'zap'; // Simple string identifier for icons
  schedule: BlockSchedule;
  blockedAppIds: string[];
}

export interface UserStats {
  date: string;
  minutesSaved: number;
  attempts: number;
}

export enum AppView {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  APP_LIST = 'APP_LIST',
  SCHEDULE = 'SCHEDULE',
  LOCKED_OVERLAY = 'LOCKED_OVERLAY',
  STATS = 'STATS'
}
