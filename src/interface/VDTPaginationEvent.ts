export default interface VDTPaginationEvent {
  itemsLength: number;
  itemsPerPage: number;
  page: number;
  pageCount: number;
  pageStart: number;
  pageStop: number;
}
