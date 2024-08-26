import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';

import { ErrorDto } from '../base';
import { ApplicationError } from '../errors';
import { AppLogger } from '../services';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new AppLogger(ErrorExceptionFilter.name, {
    timestamp: true,
  });
  catch(exception: ApplicationError, host: ArgumentsHost): void {
    this.logger.error(
      `ErrorExceptionsFilter ${exception.name} ${JSON.stringify(exception)}`,
      exception.stack,
      ErrorExceptionFilter.name,
    );

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const error = new ErrorDto();

    error.path = request.url;
    error.timestamp = new Date().toISOString();
    error.exception = JSON.stringify(exception);

    let status = exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR;
    let code = exception.code;
    let message = exception['response']?.message || exception.message;
    if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      code = 'validation_error';
      message = message;
    } else if (status == HttpStatus.UNAUTHORIZED) {
      code = code || 'server_error';
      message = message || 'Unauthorized';
    } else if (status == HttpStatus.FORBIDDEN) {
      code = code || 'server_error';
      message = message || 'Forbidden';
    } else if (exception.name === 'BadRequestException') {
      code = code || 'server_error';
      message = message || 'Bad Request Exception';
    } else {
      code = code || 'server_error';
      message = message || 'Internal Server Error';
    }

    status = status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.code = `${code}`;
    error.message = `${[message].flat()}`;

    if (exception.meta) {
      error.meta = exception.meta;
    }

    delete error.exception;
    response.status(status).json({
      success: false,
      error,
    });
  }
}
