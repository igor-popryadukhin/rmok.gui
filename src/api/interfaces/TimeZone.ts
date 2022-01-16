export default interface TimeZone {
  id: number;
  name: string;
  name_local: string;
  offset_string: string;
  offset_summer: number;
  offset_winter: number;
}
