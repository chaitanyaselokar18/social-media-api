import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If already standardized, return as-is
        if (data?.statusCode && data?.message) return data;

        const res = context.switchToHttp().getResponse();
        return {
          statusCode: res.statusCode || 200,
          message: 'Success',
          data: data ?? null,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
