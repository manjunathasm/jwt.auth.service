import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

import winston = require('winston');

Injectable();
export class AppLogger extends ConsoleLogger implements LoggerService {
  private readonly logger;
  context?: string;
  public constructor(context?: string, options?: { timestamp?: boolean }) {
    super(context, options);

    let outputLogFormat = [
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) =>
          `${info.timestamp} [${info.level}]: [${info.context}] ${info.message}`,
      ),
    ];

    const ignorePrivateIncludeSeverity = winston.format((out) => {
      if (out.private || out.ignore) {
        return false;
      }
      out.severity = out.level;
      out['log.severity'] = out.level;
      return out;
    });

    this.logger = WinstonModule.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        ignorePrivateIncludeSeverity(),
        ...outputLogFormat,
      ),
      defaultMeta: {
        Appname: process.env.APPNAME || 'unset',
      },
      transports: [
        // Console log
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
        }),
      ],

      exceptionHandlers: [new winston.transports.Console()],
    });
  }

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, trace?: string, context?: string): void {
    context = context || this.context;
    this.logger.error(message, trace, context);
  }

  log(message: string, context?: string): void {
    context = context || this.context;
    this.logger.log(message, context);
  }

  warn(message: string, context?: string): void {
    context = context || this.context;
    this.logger.warn(message, context);
  }

  info(message: string, context?: string): void {
    context = context || this.context;
    this.logger.info(message, context);
  }

  debug(message: string, context?: string): void {
    context = context || this.context;
    this.logger.debug(message, context);
  }
}
