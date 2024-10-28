import { UserDto } from '../user/user.dto';

export class ReviewDto {
  public comment!: string;
  public rating!: number;
  public publishDate!: string;
  public user!: UserDto;
}
