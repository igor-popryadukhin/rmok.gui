export interface TasksState {
  pending_items: Array<Record<string, unknown>>;
}

function state (): TasksState {
  return {
    pending_items: []
  };
}

export default state;
