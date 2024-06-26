import { IsEmail, IsString , IsNotEmpty , Length, Matches ,  } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between $constraint1 and $constraint2 characters long.' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must contain at least one special character.' })
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

export class PassowrdDto{
  @IsString()
  @IsNotEmpty()
  public oldPassword: string;
  
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between $constraint1 and $constraint2 characters long.' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one uppercase letter.' })
  @Matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/, { message: 'Password must contain at least one special character.' })
  public newPassword: string;
  

  @IsString()
  @IsNotEmpty()
  public confirmPassword: string;
}

// export class UpdateUserDto {
//   @IsString()
//   public _id: string;

//   @IsEmail()
//   @IsNotEmpty()
//   public email: string;

//   @IsString()
//   @IsNotEmpty()
//   @Length(6, 20, { message: 'Password must be between $constraint1 and $constraint2 characters long.' })
//   public password: string;
  
//   @IsString()
//   @IsNotEmpty()
//   @Length(1,20, { message: 'First name must be between $constraint1 and $constraint2 characters long.' })
//   public first_name: string;
  
//   @IsString()
//   @IsNotEmpty()
//   @Length(1,20, { message: ':Last name must be between $constraint1 and $constraint2 characters long.' })
//   public last_name: string;

//   @IsString()
//   @IsNotEmpty()
//   @Length(4,20, { message: 'Username must be between $constraint1 and $constraint2 characters long.' })
//   public user_name: string;

// }