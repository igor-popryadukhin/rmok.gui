export default interface Role {
  name: string;
  grants?: Array<Record<string, string>>;
  main_role: string;
}
