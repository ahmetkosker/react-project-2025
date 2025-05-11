/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Staff {
  id: string;
  name: string;
  pairList?: {
    partnerId: string;
    startDate: string;
    endDate: string;
  }[];
  offDays?: string[];
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export interface Reminder {
  id: string;
  time: number; 
  type: 'notification' | 'email';
}

export interface Assignment {
  id: string;
  staffId: string;
  shiftId: string;
  shiftStart: string;
  shiftEnd: string;
  isUpdated: boolean;
  title?: string;
  location?: string;
  description?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
  reminders?: Reminder[];
  tags?: string[];
}

export interface ScheduleInstance {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  staffs: Staff[];
  shifts: Shift[];
  assignments: Assignment[];
}