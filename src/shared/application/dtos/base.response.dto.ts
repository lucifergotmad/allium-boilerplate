import { Expose } from 'class-transformer';

export class ResponseDto<T> {
  @Expose()
  readonly statusCode: number;

  @Expose()
  readonly message: string;

  @Expose()
  readonly data?: T;

  @Expose()
  readonly meta?: Record<string, any>;

  @Expose()
  readonly timestamp: string;

  @Expose()
  readonly error?: string;

  constructor(
    statusCode: number,
    message: string,
    data?: T,
    meta?: Record<string, any>,
    error?: string
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success', statusCode = 200): ResponseDto<T> {
    return new ResponseDto(statusCode, message, data);
  }

  static successWithMeta<T>(
    data: T,
    meta: Record<string, any>,
    message = 'Success',
    statusCode = 200
  ): ResponseDto<T> {
    return new ResponseDto(statusCode, message, data, meta);
  }

  static error(message: string, error?: string, statusCode = 400): ResponseDto<null> {
    return new ResponseDto(statusCode, message, null, undefined, error);
  }
}
