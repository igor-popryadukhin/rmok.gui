export default interface Autodialer {
  id: number;
  name: string;
  status: 'ready' | 'process';
  mode: 'predictive' | 'progressive';
  percentage_completed_calls?: number;
  contacts_count?: number;
}
