
export interface ProjectState {
  scenario: string;
}

function state (): ProjectState {
  return {
    scenario: ''
  };
}

export default state;
