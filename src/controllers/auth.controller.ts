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
import { sendEmail } from '@/utils/sendEmail.utils';

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
        return failure(res,httpStatusCodes.BAD_REQUEST,"user already exist")
      }

      const data ={
        ...userData,
        user_type:type
      }

      const signUpUserData: User = await this.userService.createUser(data);
      const subject = "Welcome to our platform"
      const html = `<h1>Dear ${
        signUpUserData.first_name.toUpperCase() + " " + signUpUserData.last_name.toUpperCase()
      } ,</h1>
      <h1>Welcome to our platform </h1> <br> 
      <h2>Your account has been created on our platform.</h2> 
      <h4>You can login now </h4> 
      <h4>you can change your password after login from our website.</h4>
      <h4>Best regards, <br>
      FMCG App Team</h4>
      `;
      sendEmail(userData.email,subject,html)
      return success(res,httpStatusCodes.CREATED,"signup succesfull",signUpUserData)
    } catch (error) {
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server Error")
    }
  };

  public logIn = async (req: Request, res: Response) => {
    try {
      const userData: LoginUserDto = req.body;
      const findUser: User = await this.userService.findOneUser({ email: userData.email });
      if (!findUser) return failure(res,httpStatusCodes.BAD_REQUEST,"Invalid Credentials")
      const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
      if (!isPasswordMatching ) return failure(res,httpStatusCodes.BAD_REQUEST,"Invalid Credentials")
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
      return failure(res,httpStatusCodes.INTERNAL_SERVER_ERROR,"Server Error")
    }
  };

}

export default AuthController;
