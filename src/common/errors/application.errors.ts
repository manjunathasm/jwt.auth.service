export class ApplicationError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly meta: any = null,
  ) {
    super(message);
    this.code = code;
    this.meta = meta;
    this.name = 'ApplicationError';
  }
}
