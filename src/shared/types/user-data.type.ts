import { User } from './user.type.js';

export type Token = string;

export type UserData =
  User & {
    email: string;
    token: string;
  };
