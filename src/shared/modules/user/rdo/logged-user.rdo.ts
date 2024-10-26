import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public token: string;

  @Expose()
  public email: string;
  //! в ТЗ только токен, глянуть как реализовано на клиенте
}
