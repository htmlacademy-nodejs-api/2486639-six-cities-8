import { NewOffer } from '../../types/types';
import { CreateOfferDto } from '../../dto/offer/create-offer.dto';
import { getTime } from '../utils';

export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDto => {
    const {
      title,
      description,
      city,
      previewImage,
      isPremium,
      type,
      bedrooms,
      maxAdults,
      price,
      goods,
      location,
      images
    } = offer;

    return {
      title,
      description,
      publishDate: getTime(),
      city: city.name,
      previewImage,
      images,
      isPremium,
      type,
      rooms: bedrooms,
      maxAdults,
      price,
      goods,
      location
    };
  };
