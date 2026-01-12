import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  HttpExceptionBody,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExceptionBase } from '@shared/core/exceptions/exception.base';
import { getHttpStatusCode } from '@shared/core/exceptions/exception.mapping';
import { ResponseDto } from '@shared/application/dtos/base.response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let code: string | undefined;
    let stack: string | undefined;

    if (exception instanceof ExceptionBase) {
      statusCode = getHttpStatusCode(exception);
      message = exception.message;
      code = exception.code;
      stack = exception.stack;
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();

      if (responseBody && typeof responseBody === 'object' && !Array.isArray(responseBody)) {
        const res = responseBody as HttpExceptionBody;

        if (Array.isArray(res.message)) {
          message = res.message[0];
        } else {
          message = String(res.message);
        }

        code = res.error || 'HTTP_EXCEPTION';
      } else {
        message = exception.message;
        code = exception.name;
      }
      stack = exception.stack;
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      code = 'INTERNAL_SERVER_ERROR';

      if (exception instanceof Error) {
        stack = exception.stack;
      }
    }

    this.logError(request, statusCode, message, stack);

    const responsePayload = ResponseDto.error(message, code, statusCode);

    response.status(statusCode).json(responsePayload);
  }

  private logError(request: Request, statusCode: number, message: string, stack?: string) {
    if (statusCode >= (HttpStatus.INTERNAL_SERVER_ERROR as number)) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${statusCode} - ${message}`,
        stack || ''
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - ${statusCode} - ${message}`);
    }
  }
}
