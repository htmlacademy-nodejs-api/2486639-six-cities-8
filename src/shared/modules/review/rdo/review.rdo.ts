import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class ReviewRdo {
  @Expose()
  public id: string;

  @Expose()
  public comment: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'createdAt' })
  public publishDate: string;
  //? сработает

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
