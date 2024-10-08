import { User } from './user.type.js';

//! скорее всего позже понадобится
export type Token = string;

//! скорее всего позже понадобится
export type UserData =
  User & {
    email: string;
    token: string;
  };
