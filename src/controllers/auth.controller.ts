import { Request, Response } from 'express';
import { CreateUserDto , LoginUserDto, PassowrdDto } from '@dtos/users.dto';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import UserService from '@/services/users.service';
import { success, failure } from '@/utils/response.utils';
import { httpStatusCodes } from '@/constants/httpStatusCodes.constants';
import { JWT_SECRET, TOKEN_EXPIRY } from '@/config';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

class AuthController {
  public userService = new UserService();

  public signUp = async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDto = req.body;
      const userType = req.params.type
      let type:number = 2;
      if(userType === "admin"){
         type = 1
      }

      const findUser: User = await this.userService.findOneUser({ email: userData.email });
      if (findUser){
        return failure(res,httpStatusCodes.BAD_REQUEST,"user already exist",{})
      }

      const data ={
        ...userData,
        user_type:type
      }

      const signUpUserData: User = await this.userService.createUser(data);
      return success(res,httpStatusCodes.CREATED,"signup succesfull",signUpUserData)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server Error",{})
    }
  };

  public logIn = async (req: Request, res: Response) => {
    try {
      const userData: LoginUserDto = req.body;
      const findUser: User = await this.userService.findOneUser({ email: userData.email });
      if (!findUser) return failure(res,httpStatusCodes.BAD_REQUEST,"Invalid Credentials",{})
      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching ) return failure(res,httpStatusCodes.BAD_REQUEST,"Invalid Credentials",{})
      const dataStoredInToken: DataStoredInToken = { _id: findUser._id , user_type:findUser.user_type ,email:findUser.email };
      const secretKey: string = JWT_SECRET;
      const expiresIn: number = parseInt(TOKEN_EXPIRY);
      const token = sign(dataStoredInToken, secretKey , { expiresIn })
      const data = {
       token,
       findUser,
      }
      return success(res,httpStatusCodes.SUCCESS,"login successfull",data)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server Error",{})
    }
  };

  // public changePassword = async(req:RequestWithUser,res:Response)=>{
  //   try {
  //     const user: User = req.user;
  //     let userId: string = user._id;
  //     if(user.user_type === 1){
  //       userId = req.params.id;
  //     }
  //     const userData:PassowrdDto=req.body
  //     if(userData.newPassword !== userData.confirmPassword){
  //       return failure(res,httpStatusCodes.BAD_REQUEST,"password does not match",{})
  //     }
  //     const updateUser:User = await this.userService.updateUser(userId,{password:userData.newPassword})
  //     return success(res,httpStatusCodes.SUCCESS,"password updated",updateUser)
  //   } catch (error) {
  //     return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server Error",{})
  //   }
  // }

  // public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  //   try {
  //     const userData: User = req.user;
  //     const logOutUserData: User = await this.authService.logout(userData);

  //     // res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
  //     res.status(200).json({ data: logOutUserData, message: 'logout' });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default AuthController;
