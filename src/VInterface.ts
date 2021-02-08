export default interface VInterface extends Vue {
  $screenHeight: number;
  $headerHeight: number;
  assertObjectHasAttribute (obj: any, key: string): boolean;
  [key: string]: any;
}
