import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { UserValidation, UserValidationMessage } from '../user.const.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessage.email.invalidFormat })
  public email: string;

  @MinLength(UserValidation.password.minLength, { message: UserValidationMessage.password.minLength })
  @MaxLength(UserValidation.password.maxLength, { message: UserValidationMessage.password.maxLength })
  public password: string;
}
