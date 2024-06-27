import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(type:number,page: number , limit: number , sortField: string , sortOrder: string ): Promise<User[]> {
    const skip = (page - 1) * limit;
    const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
    const users: User[] = await this.users.find({user_type:type}) .sort(sort)
    .skip(skip)
    .limit(limit);;
    return users;
  }

  public async findOneUser(input:object): Promise<User> {
    const user: User = await this.users.findOne(input);
    return user;
  }

  public async createUser(userData: CreateUserDto ): Promise<User> {
    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }


  public async updateUser(userId:string, userData: CreateUserDto): Promise<User> {
    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10);
      userData = { ...userData, password: hashedPassword };
    }

    const updateUserById: User = await this.users.findOneAndUpdate(
      { _id: userId },
      { $set: userData },
      { new: true }
    );
    // .findByIdAndUpdate({_id:userId}, { userData });
    return updateUserById;
  }


  public async deleteUser(userId: string): Promise<User> {
    const deleteUserById: User = await this.users.findOneAndDelete(
      { _id: userId },
      { new: true }
    );
    return deleteUserById;
  }
}

export default UserService;
