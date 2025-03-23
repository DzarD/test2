export interface SessionSettings {
  focus_time: number;
  short_break: number;
  long_break: number;
  sections: number;
}

export interface Task {
  id: number;
  tag_id: number | null;
  name: string;
  description: string;
  isTaskCompleted: boolean;
}

export interface SessionData {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  type: string;
  tag: string;
}

export interface FlowSessionTask {
  flowSessionId: number;
  date: string;
  duration: number;
}
