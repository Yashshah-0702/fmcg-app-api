import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import { failure } from '@/utils/response.utils';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    // const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
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
        return failure(res,401,"Wrong authentication token",{})
      }
    } else {
      return failure(res,404,"Authentication token missing",{})
    }
  } catch (error) {

    return failure (res,401,"Wrong authentication token",{})
  }
};

export default authMiddleware;
