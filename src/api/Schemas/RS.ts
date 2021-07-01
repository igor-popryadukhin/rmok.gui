declare module 'RS' {
  interface ScheduleInterface {
    time: string;
    day: number;
  }

  interface ContactIntegration {
    id: number;
    user_id: number;
    user_name: string;
    project_id: number;
    project_name: string;
    is_active: boolean;
    limit: number;
  }
}
