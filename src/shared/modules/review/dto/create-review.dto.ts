import { IsMongoId, IsNumber, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ReviewValidation, ReviewValidationMessage } from '../review.const.js';

export class CreateReviewDto {
  @MinLength(ReviewValidation.comment.minLength, { message: ReviewValidationMessage.comment.minLength })
  @MaxLength(ReviewValidation.comment.maxLength, { message: ReviewValidationMessage.comment.maxLength })
  public comment: string;

  @IsNumber({ maxDecimalPlaces: ReviewValidation.rating.maxDecimalPlaces }, { message: ReviewValidationMessage.rating.invalidFormat })
  @Min(ReviewValidation.rating.min, { message: ReviewValidationMessage.rating.min })
  @Max(ReviewValidation.rating.max, { message: ReviewValidationMessage.rating.max })
  public rating: number;

  @IsMongoId({ message: ReviewValidationMessage.userId.invalidId })
  public userId: string;
}
