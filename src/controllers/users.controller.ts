import { NextFunction, Request, Response  } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { success, failure } from '@/utils/response.utils';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';

class UsersController {
  public userService = new userService();

  public getAdmins = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      if(userData.user_type !== 1){
        return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
      }
      const findAllUsersData: User[] = await this.userService.findAllUser(1);

     return success(res,httpStatusCodes.SUCCESS,"Admins fetched succesfully",findAllUsersData)
    } catch (error) {
      next(error);
    }
  }

  public getUsers = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      if(userData.user_type !== 1){
        return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied",{})
      }
      const findAllUsersData: User[] = await this.userService.findAllUser(2);

     return success(res,httpStatusCodes.SUCCESS,"Users fetched succesfully",findAllUsersData)
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const findOneUserData: User = await this.userService.findOneUser({_id:userId});

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.userService.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.params.id;
      const deleteUserData: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
