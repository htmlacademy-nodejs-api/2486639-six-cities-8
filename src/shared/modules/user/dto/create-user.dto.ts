import { IsEmail, IsEnum, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { UserValidation, UserValidationMessage } from '../user.const.js';

export class CreateUserDto {
  @MinLength(UserValidation.name.minLength, { message: UserValidationMessage.name.minLength })
  @MaxLength(UserValidation.name.maxLength, { message: UserValidationMessage.name.maxLength })
  public name: string;

  @IsEmail({}, { message: UserValidationMessage.email.invalidFormat })
  public email: string;

  @IsEnum(UserType, { message: UserValidationMessage.type.invalidFormat })
  public type: UserType;

  @MinLength(UserValidation.password.minLength, { message: UserValidationMessage.password.minLength })
  @MaxLength(UserValidation.password.maxLength, { message: UserValidationMessage.password.maxLength })
  public password: string;

  //! нужен ли сразу avatarPath?
}
