interface Error {
  message: string;
  property_name: string;
}

export default interface ErrorInterface {
  error_code: string;
  error_message: number;
  errors?: Error[];
}
