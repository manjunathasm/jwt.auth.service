import { Allow } from 'class-validator';

export class ErrorDto {
  @Allow()
  code: string;

  @Allow()
  message: string;

  @Allow()
  meta: string;

  @Allow()
  exception: string;

  @Allow()
  path: string;

  @Allow()
  timestamp: string;
}
