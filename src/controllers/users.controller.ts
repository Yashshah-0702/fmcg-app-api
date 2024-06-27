import {  Response  } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';
import { success, failure } from '@/utils/response.utils';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';

class UsersController {
  public userService = new userService();

  public getAdmins = async (req: RequestWithUser, res: Response) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const sortField = req.query.sortField as string || 'createdAt';
        const sortOrder = req.query.sortOrder as string || 'asc';
        const userData: User = req.user;

        if (userData.user_type !== 1) {
            return failure(res, httpStatusCodes.UNAUTHORIZED, "Access Denied",);
        }

        const findAllUsersData: User[] = await this.userService.findAllUser(1, page, limit, sortField, sortOrder);

        return success(res, httpStatusCodes.SUCCESS, "Admins fetched successfully", findAllUsersData);
    } catch (error) {
        return failure(res, httpStatusCodes.INTERNAL_SERVER_ERROR, "Server error",);
    }
}

  public getUsers = async (req: RequestWithUser, res: Response) => {
    try {
      const userData: User = req.user;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const sortField = req.query.sortField as string || 'createdAt';
      const sortOrder = req.query.sortOrder as string || 'asc';
      if(userData.user_type !== 1){
        return failure(res,httpStatusCodes.UNAUTHORIZED,"Access Denied")
      }
      const findAllUsersData: User[] = await this.userService.findAllUser(2,page,limit,sortField,sortOrder);

     return success(res,httpStatusCodes.SUCCESS,"Users fetched succesfully",findAllUsersData)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
    }
  };

  public getUserById = async (req: RequestWithUser, res: Response) => {
    try {
      const userData: User = req.user;
      let userId: string = userData._id;
      if(userData.user_type === 1){
        userId = req.body.id;
      }
      const findOneUserData: User = await this.userService.findOneUser({_id:userId});
      if(!findOneUserData){
        return failure(res,httpStatusCodes.NOT_FOUND,"User not found")
      }

      return success(res,httpStatusCodes.SUCCESS,"User profile fetched succesfully",findOneUserData)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
    }
  };

  public updateUser = async (req: RequestWithUser, res: Response) => {
    try {
      const user: User = req.user;
      let userId: string = user._id;
      if(user.user_type === 1){
        userId = req.params.id;
      }
      let userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      if(!updateUserData){
        return failure(res,httpStatusCodes.NOT_FOUND,"User not found")
      }
      return success(res,httpStatusCodes.SUCCESS,"User updated",updateUserData)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
    }
  };

  public deleteUser = async (req: RequestWithUser, res: Response) => {
    try {
      const user: User = req.user;
      let userId: string = user._id;
      if(user.user_type === 1){
        userId = req.params.id;
      }
      const deleteUserData: User = await this.userService.deleteUser(userId);
      if(!deleteUserData){
        return failure(res,httpStatusCodes.NOT_FOUND,"User not found")
      }
      return success (res,httpStatusCodes.SUCCESS,"User deleted",[])
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server error")
    }
  };
}

export default UsersController;
