import { GENERIC_ERROR_CODES } from '@shared/core/constants/exceptions/exception.code';
import { ExceptionBase } from '@shared/core/exceptions/exception.base';

/**
 * Digunakan saat input user validasi gagal (mirip 400 Bad Request)
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.ARGUMENT_INVALID;
}

/**
 * Digunakan saat parameter wajib tidak diisi (mirip 400 Bad Request)
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.ARGUMENT_NOT_PROVIDED;
}

/**
 * Digunakan saat entity tidak ditemukan (mirip 404 Not Found)
 */
export class UnauthorizedException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.UNAUTHORIZED;

  static readonly message = 'Unauthorized';

  constructor(message = UnauthorizedException.message, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}

/**
 * Digunakan saat entity tidak ditemukan (mirip 404 Not Found)
 */
export class NotFoundException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.NOT_FOUND;

  static readonly message = 'Not found';

  constructor(message = NotFoundException.message, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}

/**
 * Digunakan saat terjadi duplikasi data unik (mirip 409 Conflict)
 */
export class ConflictException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.CONFLICT;

  static readonly message = 'Conflict';

  constructor(message = ConflictException.message, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}

/**
 * Digunakan untuk error internal yang tidak diketahui (mirip 500 Internal Server Error)
 */
export class InternalServerErrorException extends ExceptionBase {
  readonly code = GENERIC_ERROR_CODES.INTERNAL;

  static readonly message = 'Internal server error';

  constructor(message = InternalServerErrorException.message, cause?: Error, metadata?: unknown) {
    super(message, cause, metadata);
  }
}
