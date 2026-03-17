interface E {
  code: string;
  message: string;
  property_name: string;
}

interface ErrorInterface {
  error_code: string;
  error_message: string;
  debug_message?: string;
  errors?: E[];
}

export default class APIError extends Error {
  get error_code (): string {
    return this._error_code;
  }

  set error_code (value: string) {
    this._error_code = value;
  }

  get error_message (): string {
    return this._error_message;
  }

  set error_message (value: string) {
    this._error_message = value;
  }

  get debug_message (): string {
    return this._debug_message;
  }

  set debug_message (value: string) {
    this._debug_message = value;
  }

  get errors (): E[] {
    return this._errors;
  }

  set errors (value: E[]) {
    this._errors = value;
  }

  private _error_code: string;
  private _error_message: string;
  private _debug_message: string;
  private _errors: E[];

  /**
   *
   * @param data
   */
  constructor (data: ErrorInterface) {
    super(data.error_message || 'The structure of the incoming data is broken!');

    this._error_code = data.error_code;
    this._error_message = data.error_message;
    this._debug_message = data.debug_message || '';
    this._errors = data.errors || [];
  }
}
