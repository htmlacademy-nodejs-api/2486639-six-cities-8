export type randomNumberOption = {
  min: number,
  max: number,
  numAfterDigit?: number
};

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  publishDate: {
    min: string;
    max: string;
  };
  images: string[];
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
