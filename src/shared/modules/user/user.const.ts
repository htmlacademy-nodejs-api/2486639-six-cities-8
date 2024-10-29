import { UserType } from '../../types/index.js';

export const DEFAULT_AVATAR_PATH = 'default-avatar.svg';

export enum UserName {
  Collection = 'users',
  Id = 'userId',
  Avatar = 'avatar'
}

export enum UserRoute {
  Root = '/',
  UserAvatar = `/:${UserName.Id}/avatar`,
  Login = '/login',
  Logout = '/logout'
}

export const UserValidation = {
  name: {
    minLength: 1,
    maxLength: 15
  },
  password: {
    minLength: 6,
    maxLength: 12
  }
} as const;

export const UserValidationMessage = {
  name: {
    minLength: `Minimum name length must be ${UserValidation.name.minLength}`,
    maxLength: `Maximum name length must be ${UserValidation.name.maxLength}`
  },
  email: {
    invalidFormat: 'email must be a valid email address'
  },
  type: {
    invalidFormat: `type must by one of ${Object.values(UserType).join(', ')}`
  },
  password: {
    minLength: `Minimum password length must be ${UserValidation.password.minLength}`,
    maxLength: `Maximum password length must be ${UserValidation.password.maxLength}`
  }
} as const;
