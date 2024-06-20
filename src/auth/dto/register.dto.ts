import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?\/]).{8,}$/;

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Matches(PASSWORD_REGEX, {
    message:
      'Password should have at least one capital letter, one lowercase letter, one number, and one special character',
  })
  @MaxLength(50)
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsInt()
  age: number;
}
