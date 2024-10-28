import { UserType } from '../../const';

export class UserDto {
  public name!: string;
  public email!: string;
  public avatarPath!: string;
  public type!: UserType;
}
