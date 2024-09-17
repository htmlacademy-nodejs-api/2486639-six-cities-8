import { UserType } from './user-type.enum.js';

export type User = {
  email: string;
  type: UserType;
  avatarPath: string;
  firstname: string;
  lastname: string;
}
