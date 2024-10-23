import { Expose } from 'class-transformer';

export class ReviewRdo {
  @Expose()
  public comment: string;

  @Expose()
  public rating: number;

  @Expose()
  public publishDate: Date;

  @Expose()
  public userId: string;
  //! user
}
