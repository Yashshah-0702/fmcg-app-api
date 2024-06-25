import { IsEmail, IsString , IsNotEmpty , Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between $constraint1 and $constraint2 characters long.' })
  public password: string;
  
  @IsString()
  @IsNotEmpty()
  @Length(1,20, { message: 'First name must be between $constraint1 and $constraint2 characters long.' })
  public first_name: string;
  
  @IsString()
  @IsNotEmpty()
  @Length(1,20, { message: ':Last name must be between $constraint1 and $constraint2 characters long.' })
  public last_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(4,20, { message: 'Username must be between $constraint1 and $constraint2 characters long.' })
  public user_name: string;

}


export class LoginUserDto{
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between $constraint1 and $constraint2 characters long.' })
  public password: string;
}