import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../../types/index.js';
import { UserValidation, UserValidationMessage } from '../user.const.js';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(UserValidation.name.minLength, { message: UserValidationMessage.name.minLength })
  @MaxLength(UserValidation.name.maxLength, { message: UserValidationMessage.name.maxLength })
  public name?: string;

  @IsOptional()
  public avatarPath?: string;

  @IsOptional()
  @IsEnum(UserType, { message: UserValidationMessage.type.invalidFormat })
  public type?: UserType;

  @IsOptional()
  @MinLength(UserValidation.password.minLength, { message: UserValidationMessage.password.minLength })
  @MaxLength(UserValidation.password.maxLength, { message: UserValidationMessage.password.maxLength })
  public password?: string;
}
