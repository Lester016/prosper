import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(
    '\x1b[1m\x1b[36m%s', // Logs will be cyan and bold.
    'Start of',
    req.method,
    req.baseUrl,
    `[${new Date().toISOString()}]`,
    '\x1b[1m\x1b[37m', // Next logs will be white and bold.
  );

  // Only logs the end if there was no error encountered.
  res.on('finish', () => {
    // Status 400 means there was an error in response.
    if (res.statusCode < 400) {
      console.log(
        '\x1b[1m\x1b[33m%s',
        'End of',
        req.method,
        req.url,
        `[${new Date().toISOString()}]`,
      );
    }
  });
  next();
}
