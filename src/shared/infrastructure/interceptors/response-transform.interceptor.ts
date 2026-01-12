import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ResponseDto } from '@shared/application/dtos/base.response.dto';
import { PageDto } from '@shared/application/dtos/page.dto'; // Sesuaikan path import PageDto kamu

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseDto<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const statusCode = response.statusCode;

        if (data instanceof ResponseDto) {
          return data as ResponseDto<T>;
        }

        if (data instanceof PageDto) {
          return ResponseDto.successWithMeta(data.data as T, data.meta, 'Success', statusCode);
        }

        let message = 'Success';
        let finalData = data as T;

        if (data && typeof data === 'object' && !Array.isArray(data)) {
          const rawData = data as Record<string, unknown>;

          if ('message' in rawData && typeof rawData.message === 'string') {
            message = rawData.message;
          }

          if ('result' in rawData) {
            finalData = rawData.result as T;
          }
        }

        return ResponseDto.success(finalData, message, statusCode);
      })
    );
  }
}
