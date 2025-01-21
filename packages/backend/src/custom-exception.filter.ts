import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const res = exception.getResponse() as { message: string[] };
    const status = exception.getStatus();
    const message = exception.message;
    response
      .status(status)
      .json({
        code: status,
        message,
        data: res?.message?.join(',') ?? exception.message,
      })
      .end();
  }
}
