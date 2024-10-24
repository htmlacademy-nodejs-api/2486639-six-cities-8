import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class ReviewRdo {
  @Expose()
  public comment: string;

  @Expose()
  public rating: number;

  @Expose()
  public publishDate: Date;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;
}
