export interface User {
  id: string;
  login: string;
  password: string;
  name: string;
  cpf: string;
  createdAt: Date;
}

export interface Camera {
  id: string;
  name: string;
  ip: string;
  login: string;
  password: string;
  status: 'online' | 'offline';
  analyticsActive: boolean;
  alarmEnabled: boolean;
  groupId?: string;
}

export interface CameraGroup {
  id: string;
  name: string;
  cameraIds: string[];
  createdAt: Date;
}

export interface AnalyticsFence {
  id: string;
  cameraId: string;
  channel: number;
  points: Point[];
  isActive: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface DetectionConfig {
  motionDetection: {
    enabled: boolean;
    sensitivity: number;
    schedule: {
      [day: string]: { start: string; end: string; enabled: boolean };
    };
  };
  analyticsFence: {
    enabled: boolean;
  };
  lineCrossing: {
    enabled: boolean;
  };
  notifications: {
    email: boolean;
    flash: boolean;
    sound: boolean;
    central: boolean;
  };
}

export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  timestamp: Date;
  details?: string;
}

export type StatusColor = 'online' | 'offline' | 'warning' | 'neutral';