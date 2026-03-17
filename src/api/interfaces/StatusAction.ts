export default interface StatusAction {
  data: Record<string, Record<string, unknown>>;
  type: string;
  title: string;
}
