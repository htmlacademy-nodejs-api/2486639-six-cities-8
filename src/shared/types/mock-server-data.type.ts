export type randomNumberOption = {
  min: number,
  max: number,
  orderDivisor?: number
};

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  publishDate: {
    min: string;
    max: string;
  };
  cities: string[];
  categoryImages: string[];
  previewImages: string[];
  rating: randomNumberOption;
  rooms: randomNumberOption;
  maxAdults: randomNumberOption;
  price: randomNumberOption;
  user: {
    names: string[];
    emails: string[];
    avatarPaths: string[];
    passwords: string[];
  };
  deltaCityLocation: {
    latitude: randomNumberOption;
    longitude: randomNumberOption;
  };
};
