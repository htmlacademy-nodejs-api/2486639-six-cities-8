export const DEFAULT_AVATAR_PATH = 'default-avatar-path.png';
export const USER_ID = 'userId';
export const USER_ID_PARAMETR = `:${USER_ID}`;

export enum UserRoute {
  Root = '/',
  UserAvatar = `/${USER_ID_PARAMETR}/avatar`,
  Login = '/login',
  Logout = '/logout'
}
