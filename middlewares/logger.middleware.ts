import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // 1. 여기까지 실행 후
    response.on('finish', () => {
      // 3. 종료 후 내부 실행
      const { statusCode } = response;
      const contentLength = response.get('Content-Length');
      const message = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      this.logger.log(message);
    });

    // 2. 다음항목 먼저 실행 후
    next();
  }
}
