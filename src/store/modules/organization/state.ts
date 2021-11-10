export interface State {
  id: number;
  name: string;
  sphere_activity?: string;
  inn?: string;
  cpp?: string;
  site?: string;
  city?: string;
  address?: string;
  region?: string;
  description?: string;
  phone?: string;
  email?: string;
}

function state (): State {
  return {
    id: 0,
    name: '',
    address: '',
    city: '',
    cpp: '',
    description: '',
    email: '',
    inn: '',
    phone: '',
    region: '',
    site: '',
    sphere_activity: ''
  }
}

export default state
