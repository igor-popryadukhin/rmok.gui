export default interface ValidationState {
  message: string;
  property_name: string;
  status: 'failure'|'success'|string;
  value: string;
}
