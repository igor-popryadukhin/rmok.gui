
interface ProfilerInterface {
  [key: string]: string;
}

export interface SymfonyStateInterface {
  call_collection: ProfilerInterface[]
}

function state (): SymfonyStateInterface {
  return {
    call_collection: []
  };
}

export default state;
