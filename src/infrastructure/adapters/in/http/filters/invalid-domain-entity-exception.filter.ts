import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { InvalidEntityError } from 'src/application/domain/errors/invalid-entity.error';
import { ProblemResponseDto } from '../dto/company/problem-response.dto';

@Catch(InvalidEntityError)
export class InvalidEntityExceptionFilter implements ExceptionFilter {
  catch(exception: InvalidEntityError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    const plainProblem = {
      title: exception.code,
      status: status,
      detail: exception.context,
      instance: ctx.getRequest<Request>()?.url,
    };

    response
      .status(status)
      .header('Content-Type', 'application/problem+json')
      .json(
        plainToInstance(ProblemResponseDto, plainProblem, {
          excludeExtraneousValues: true,
        }),
      );
  }
}
