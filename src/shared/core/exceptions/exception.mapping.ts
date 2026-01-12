import {
  ConflictException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'; // Import dari NestJS
import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  UnauthorizedException,
} from '@shared/core/exceptions/common.exceptions';

export const exceptionToStatusMap: Record<string, number> = {
  [ArgumentInvalidException.name]: HttpStatus.BAD_REQUEST,
  [ArgumentNotProvidedException.name]: HttpStatus.BAD_REQUEST,
  [ConflictException.name]: HttpStatus.CONFLICT,
  [NotFoundException.name]: HttpStatus.NOT_FOUND,
  [InternalServerErrorException.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [UnauthorizedException.name]: HttpStatus.UNAUTHORIZED,
};

export function getHttpStatusCode(exception: unknown): number {
  if (exception && typeof exception === 'object' && 'constructor' in exception) {
    const name = exception.constructor.name;
    if (name in exceptionToStatusMap) {
      return exceptionToStatusMap[name];
    }
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}
