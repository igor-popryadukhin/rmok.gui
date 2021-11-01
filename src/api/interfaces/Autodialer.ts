export default interface Autodialer {
  id: number;
  name: string;
  status: 'ready' | 'process';
  mode: 'predictive' | 'progressive';
}
