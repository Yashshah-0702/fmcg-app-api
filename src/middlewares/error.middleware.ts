import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@/interfaces/error.interface';
import { logger } from '@utils/logger';
import { failure } from '@/utils/response.utils';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';

const errorMiddleware = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    return failure(res,status,message,{});
  } catch (error) {
    return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error",{})
  }
};

export default errorMiddleware;
