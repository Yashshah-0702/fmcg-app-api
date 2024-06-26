import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@config';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { failure } from '@/utils/response.utils';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.headers.authorization.split(" ")[1]
    if (Authorization) {
      const secretKey: string = JWT_SECRET;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        return failure(res,httpStatusCodes.UNAUTHORIZED,"Wrong authentication token",{})
      }
    } else {
      return failure(res,httpStatusCodes.ACCESS_DENIED,"Authentication token missing",{})
    }
  } catch (error) {
    if(error.message === "jwt expired"){
      return failure (res,httpStatusCodes.UNAUTHORIZED,"Session expired",{})
    }
    return failure (res,httpStatusCodes.UNAUTHORIZED,"Wrong authentication token",{})
  }
};

export default authMiddleware;
