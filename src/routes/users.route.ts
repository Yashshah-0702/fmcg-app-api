import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public admin = '/admin';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware,this.usersController.getUsers);
    this.router.get(`${this.admin}`, authMiddleware ,this.usersController.getAdmins);
    this.router.post(`${this.path}`,authMiddleware,this.usersController.getUserById);
    // this.router.post(`${this.path}/updateUser`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}`, authMiddleware,validationMiddleware(UpdateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}`, authMiddleware ,this.usersController.deleteUser);
  }
}

export default UsersRoute;
