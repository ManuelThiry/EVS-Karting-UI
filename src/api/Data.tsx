export type Race = {
  name?: string;
  period: string;
  date?: string;
  coverImage?: string;
  trackImage?: string;
  location?: string;
  length?: string;
  price?: number;
  format?: { qualifying: number; race: number };
  contact?: string;
  lineUps?: string[];
  results?: {
    qualifying: { name: string; time: string }[];
    race: { name: string; time: string }[];
  };
};

export const Data: Race[] = [
  {
    name: "Experience Factory Eupen",
    period: "January",
    coverImage:
      "https://s3.eu-west-3.amazonaws.com/sport-finder.image/images/cache/full_hd/center/karting-eupen.jpeg",
    trackImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81zHUIvxhHi6MuF8wf_9B7RcoG2Mje9xciQ&s",
    location: "Industriestraße 37, 4700 Eupen",
    length: "1.1 km",
  },
  {
    name: "Liege Karting",
    period: "March",
    coverImage:
      "https://www.liegekarting.com/upload/liege-karting-5b3b97-large.jpg",
    trackImage:
      "https://www.liegekarting.com/upload/liege-karting-5b3b97-large.jpg",
    location: "Rue Eugène Vandenhoff 88, 4030 Liège",
    length: "530 m",
  },
  {
    name: "RACB Karting Spa-Francorchamps",
    period: "May",
    coverImage:
      "https://www.francorchamps-karting.be/images/site/2024121814_1734530354e2.jpg",
    trackImage:
      "https://www.francorchamps-karting.be/images/site/2024121814_1734530354e2.jpg",
    location: "Rte de l' Eau Rouge 51, 4970 Stavelot",
    length: "1.0 km",
  },
  {
    name: "Karting des Fagnes",
    period: "July",
    coverImage:
      "https://www.lavenir.net/resizer/v2/AVCT2F553ZEFJEXQ3SEYOQRKN4.jpg?auth=0b9be8d04b9e73a078e70838860f29bc40f18b1287b72d0af458d09e9fa95987&width=1620&height=1085&quality=85&focal=512%2C343",
    trackImage:
      "https://www.lavenir.net/resizer/v2/AVCT2F553ZEFJEXQ3SEYOQRKN4.jpg?auth=0b9be8d04b9e73a078e70838860f29bc40f18b1287b72d0af458d09e9fa95987&width=1620&height=1085&quality=85&focal=512%2C343",
    location: "Rue du Karting 13, 5660 Couvin",
    length: "1.3 km",
  },
  {
    name: "Hurricane Dolhain Karting",
    period: "September",
    coverImage:
      "https://i.pinimg.com/564x/90/7c/2f/907c2f8ecc87c1688948ed0dee503761.jpg",
    trackImage:
      "https://i.pinimg.com/564x/90/7c/2f/907c2f8ecc87c1688948ed0dee503761.jpg",
    location: "Av. Reine Astrid 97/A, 4831 Limbourg",
    length: "600 m",
  },
  {
    period: "November",
  },
];