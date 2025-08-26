import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'src/application/domain/errors/entity-not-found.error';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ProblemResponseDto } from '../dto/company/problem-response.dto';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.UNPROCESSABLE_ENTITY;

    const plainProblem = {
      title: exception.code,
      status: status,
      detail: exception.message,
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
