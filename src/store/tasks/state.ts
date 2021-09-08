export interface TasksState {
  pending_count: number;
}

function state (): TasksState {
  return {
    pending_count: 0
  }
}

export default state
