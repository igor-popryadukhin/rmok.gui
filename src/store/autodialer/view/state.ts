import Project from '@/api/interfaces/Project';

export interface State {
  id: number;
  name: string;
  status: string;
  mode: string;
  queue_name: string;
  pickup_timeout: number;
  max_calls_number: number;
  maximum_attempts: number;
  calls_processing_rules_actions: Array<Record<string, unknown>>;
  calls_processing_rules: Array<Record<string, unknown>>;
  description?: string;
  project?: Project;
  summary?: Array<Record<string, unknown>>;
}

function state (): State {
  return {
    id: 0,
    name: '',
    status: 'ready',
    mode: '',
    queue_name: '',
    pickup_timeout: 0,
    max_calls_number: 0,
    maximum_attempts: 0,
    calls_processing_rules_actions: [],
    calls_processing_rules: [],
    description: '',
    project: null,
    summary: []
  };
}

export default state;
