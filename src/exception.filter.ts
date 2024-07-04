import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    const error = exception.getResponse() as {
      message: string | string[];
    };
    response.status(status).send({
      statusCode: status,
      message:
        error?.message instanceof Array
          ? error.message[0]
          : error.message || error,
    });
  }
}
