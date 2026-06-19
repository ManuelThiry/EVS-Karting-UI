export type Driver = {
  id: string;
  name: string;
  team: string[];
};

export const Drivers: Driver[] = [
  { id: 'THIRY', name: "Manuel THIRY", team: ["A7 Core"] },
  { id: 'BECKERS', name: "Maxime BECKERS", team: ["A7 Core", "Enrich"] },
  { id: 'MAUDOUX', name: "Simon MAUDOUX", team: ["A7 Core"] },
  { id: 'MIGNOLET', name: "Pierre MIGNOLET", team: ["PGT"] },
  { id: 'MARECHAL', name: "Thibaut MARECHAL", team: ["Enrich"] },
  { id: 'HUYGHEBAERT', name: "Aubry HUYGHEBAERT", team: ["Pulsar"] },
  { id: 'MAHIAT', name: "Jeremy MAHIAT", team: ["PGT"] },
  { id: 'JACOBS', name: "Pierre JACOBS", team: ["LSMVIA"] },
  { id: 'BOILEAU', name: "Quentin BOILEAU", team: ["LSMVIA"] },
  { id: 'PETERS', name: "Loic PETERS", team: ["LSMVIA"] },
  { id: 'GIARRUSSO', name: "Florian GIARRUSSO", team: ["System Test"] },
  { id: 'WYZEN', name: "Mathieu WYZEN", team: ["Enrich"] },
  { id: 'VINCENT', name: "Nicolas VINCENT", team: ["Support"] },
  { id: 'VAN EYLEN', name: "Quentin VAN EYLEN", team: ["PGT"] },
  { id: 'HARDY', name: "Cyril HARDY", team: ["Production XT"] },
  { id: 'PREUDHOMME', name: "Nicolas PREUD'HOMME", team: ["System Test"] },
  { id: 'SCHAAL', name: "Arnaud SCHAAL", team: ["A7 Core"] },
  { id: 'MAWET', name: "Xavier MAWET", team: ["Innovation"] },
  { id: 'HUTSEMAIKERS', name: "Michael HUTSEMAIKERS", team: ["Production XT"] },
  { id: 'VERHEUGE', name: "Gauthier VERHEUGE", team: ["Produce"] },
  { id: 'ATIF', name: "Yannis ATIF", team: ["A7 Core"] },
  { id: 'LAMALLE', name: "Noa LAMALLE", team: ["Ext."] },
  { id: 'SANFILIPPO', name: "Ugo SANFILIPPO", team: ["Enrich"] },
  { id: 'ARNOULD', name: "Ayrton ARNOULD", team: ["A7 Core"] },
  { id: 'BALANDJIN', name: "Alexandre BALANDJIN", team: ["Ext."] },
  { id: 'MAGHE', name: "Alexandre MAGHE", team: ["?"] },
  { id: 'CAHAY', name: "Olivier CAHAY", team: ["?"] },
  { id: 'PIRENNE', name: "Romain PIRENNE", team: ["?"] },
  { id: 'PANAHBEKHODA', name: "Emad PANAHBEKHODA", team: ["?"] },
];

export type Race = {
  id: number;
  name: string;
  address: string;
  distance: string;
  imageUrl: string;
  contact?: string;
  price?: number;
  date?: Date;
  format?: string;
  drivers?: string[];
  qualifResults?: QualifResult[];
  raceResults?: RaceResult[];
};

export type QualifResult = {
  position: number;
  driver: string;
  time: string;
}

export type RaceResult = {
  position: number;
  driver: string;
  gap: string;
  bestLap: string;
}

export const Races: Race[] = [
  {
    id: 1,
    name: "Experience Factory Eupen",
    address: "Industriestraße 37, 4700 Eupen",
    distance: "1.1 km",
    imageUrl: "https://s3.eu-west-3.amazonaws.com/sport-finder.image/images/cache/full_hd/center/karting-eupen.jpeg",
    contact: "Manuel Thiry (MATH)",
    date: new Date("2026-01-15 20:00"),
    format: "Q: 6min, R: 30min",
    price: 56,
    drivers: ["THIRY", "BECKERS", "MAUDOUX", "MIGNOLET", "MARECHAL", "HUYGHEBAERT", "MAHIAT", "JACOBS", "BOILEAU", "PETERS", "GIARRUSSO", "WYZEN", "VINCENT", "VAN EYLEN", "HARDY", "PREUDHOMME", "SCHAAL", "MAWET", "HUTSEMAIKERS", "VERHEUGE", "ATIF"],
    qualifResults: [
      {position:1, driver:"Manuel THIRY", time:"1:02.995"},
      {position:2, driver:"Cyril HARDY", time:"1:03.203"},
      {position:3, driver:"Gauthier VERHEUGE", time:"1:03.496"},
      {position:4, driver:"Xavier MAWET", time:"1:03.946"},
      {position:5, driver:"Nicolas PREUD'HOMME", time:"1:05.916"},
      {position:6, driver:"Simon MAUDOUX", time:"1:06.004"},
      {position:7, driver:"Thibaut MARECHAL", time:"1:06.570"},
      {position:8, driver:"Loic PETERS", time:"1:06.631"},
      {position:9, driver:"Quentin BOILEAU", time:"1:07.040"},
      {position:10, driver:"Michael HUTSEMAIKERS", time:"1:07.154"},
      {position:11, driver:"Pierre MIGNOLET", time:"1:07.370"},
      {position:12, driver:"Jeremy MAHIAT", time:"1:07.656"},
      {position:13, driver:"Pierre JACOBS", time:"1:08.575"},
      {position:14, driver:"Yannis ATIF", time:"1:08.682"},
      {position:15, driver:"Nicolas VINCENT", time:"1:08.984"},
      {position:16, driver:"Florian GIARRUSSO", time:"1:09.441"},
      {position:17, driver:"Quentin VAN EYLEN", time:"1:09.472"},
      {position:18, driver:"Maxime BECKERS", time:"1:10.494"},
      {position:19, driver:"Aubry HUYGHEBAERT", time:"1:11.636"},
      {position:20, driver:"Arnaud SCHAAL", time:"1:11.673"},
      {position:21, driver:"Mathieu WYZEN", time:"1:21.777"}
    ],
    raceResults: [
      {position: 1, driver: "Cyril HARDY", gap: "", bestLap: "1:01.648"},
      {position: 2, driver: "Manuel THIRY", gap: "1.748", bestLap: "1:01.830"},
      {position: 3, driver: "Gauthier VERHEUGE", gap: "10.003", bestLap: "1:02.157"},
      {position: 4, driver: "Xavier MAWET", gap: "10.716", bestLap: "1:02.016"},
      {position: 5, driver: "Nicolas PREUD'HOMME", gap: "1 Laps", bestLap: "1:03.929"},
      {position: 6, driver: "Simon MAUDOUX", gap: "1 Laps", bestLap: "1:04.162"},
      {position: 7, driver: "Michael HUTSEMAIKERS", gap: "1 Laps", bestLap: "1:04.187"},
      {position: 8, driver: "Quentin BOILEAU", gap: "1 Laps", bestLap: "1:04.147"},
      {position: 9, driver: "Pierre MIGNOLET", gap: "1 Laps", bestLap: "1:05.113"},
      {position: 10, driver: "Loic PETERS", gap: "1 Laps", bestLap: "1:04.908"},
      {position: 11, driver: "Pierre JACOBS", gap: "2 Laps", bestLap: "1:05.418"},
      {position: 12, driver: "Aubry HUYGHEBAERT", gap: "2 Laps", bestLap: "1:06.152"},
      {position: 13, driver: "Thibaut MARECHAL", gap: "2 Laps", bestLap: "1:06.008"},
      {position: 14, driver: "Maxime BECKERS", gap: "2 Laps", bestLap: "1:05.491"},
      {position: 15, driver: "Quentin VAN EYLEN", gap: "2 Laps", bestLap: "1:05.536"},
      {position: 16, driver: "Yannis ATIF", gap: "2 Laps", bestLap: "1:07.123"},
      {position: 17, driver: "Jeremy MAHIAT", gap: "2 Laps", bestLap: "1:07.223"},
      {position: 18, driver: "Nicolas VINCENT", gap: "3 Laps", bestLap: "1:07.626"},
      {position: 19, driver: "Florian GIARRUSSO", gap: "3 Laps", bestLap: "1:08.280"},
      {position: 20, driver: "Arnaud SCHAAL", gap: "3 Laps", bestLap: "1:08.626"},
      {position: 21, driver: "Mathieu WYZEN", gap: "4 Laps", bestLap: "1:13.238"}
    ]
  },
  {
    id: 2,
    name: "Liege Karting",
    address: "Rue Eugène Vandenhoff 88, 4030 Liège",
    distance: "530 m",
    imageUrl: "https://www.liegekarting.com/upload/liege-karting-5b3b97-large.jpg",
    contact: "Manuel Thiry (MATH)",
    date: new Date("2026-03-26 20:00"),
    format: "Q: 10min, R: 20min",
    price: 39,
    drivers: ["THIRY", "LAMALLE", "BECKERS", "SANFILIPPO", "VINCENT", "VAN EYLEN", "HUYGHEBAERT", "HUTSEMAIKERS", "PETERS", "HARDY", "MIGNOLET", "MAHIAT", "ARNOULD", "BALANDJIN"],
    qualifResults: [
      {position: 1, driver: "Cyril HARDY", time: "39.206"},
      {position: 2, driver: "Manuel THIRY", time: "39.723"},
      {position: 3, driver: "Michael HUTSEMAIKERS", time: "41.469"},
      {position: 4, driver: "Pierre MIGNOLET", time: "41.603"},
      {position: 5, driver: "Aubry HUYGHEBAERT", time: "41.923"},
      {position: 6, driver: "Maxime BECKERS", time: "41.977"},
      {position: 7, driver: "Ugo SANFILIPPO", time: "42.678"},
      {position: 8, driver: "Jeremy MAHIAT", time: "42.699"},
      {position: 9, driver: "Loic PETERS", time: "42.892"},
      {position: 10, driver: "Quentin VAN EYLEN", time: "43.464"},
      {position: 11, driver: "Alexandre BALANDJIN", time: "43.611"},
      {position: 12, driver: "Nicolas VINCENT", time: "43.982"},
      {position: 13, driver: "Ayrton ARNOULD", time: "45.448"},
      {position: 14, driver: "Noa LAMALLE", time: "46.007"}
    ],
    raceResults: [
      {position: 1, driver: "Cyril HARDY", gap: "", bestLap: "38.977"},
      {position: 2, driver: "Manuel THIRY", gap: "3.032", bestLap: "39.142"},
      {position: 3, driver: "Michael HUTSEMAIKERS", gap: "1 Laps", bestLap: "40.228"},
      {position: 4, driver: "Pierre MIGNOLET", gap: "2 Laps", bestLap: "41.092"},
      {position: 5, driver: "Maxime BECKERS", gap: "2 Laps", bestLap: "41.026"},
      {position: 6, driver: "Quentin VAN EYLEN", gap: "2 Laps", bestLap: "40.963"},
      {position: 7, driver: "Ugo SANFILIPPO", gap: "3 Laps", bestLap: "41.727"},
      {position: 8, driver: "Jeremy MAHIAT", gap: "3 Laps", bestLap: "42.122"},
      {position: 9, driver: "Loic PETERS", gap: "3 Laps", bestLap: "41.024"},
      {position: 10, driver: "Aubry HUYGHEBAERT", gap: "3 Laps", bestLap: "41.993"},
      {position: 11, driver: "Alexandre BALANDJIN", gap: "3 Laps", bestLap: "41.294"},
      {position: 12, driver: "Noa LAMALLE", gap: "4 Laps", bestLap: "43.071"},
      {position: 13, driver: "Ayrton ARNOULD", gap: "4 Laps", bestLap: "43.134"},
      {position: 14, driver: "Nicolas VINCENT", gap: "5 Laps", bestLap: "42.476"}
    ]
  },
  {
    id: 3,
    name: "RACB Karting Spa-Francorchamps",
    address: "Rte de l' Eau Rouge 51, 4970 Stavelot",
    distance: "1.0 km",
    imageUrl: "https://www.francorchamps-karting.be/images/site/2024121814_1734530354e2.jpg",
    contact: "Manuel Thiry (MATH)",
    date: new Date("2026-07-01 19:00"),
    format: "Q: 10min, R: 20min",
    price: 58.5,
    drivers: ["THIRY", "MAUDOUX", "MAWET", "BECKERS", "GIARRUSSO", "MAGHE", "VINCENT", "HARDY", "CAHAY", "PIRENNE", "PANAHBEKHODA", "VAN EYLEN"]
  },
  {
    id: 4,
    name: "RACB Karting Spa-Francorchamps",
    address: "Rte de l' Eau Rouge 51, 4970 Stavelot",
    distance: "1.0 km",
    imageUrl: "https://www.francorchamps-karting.be/images/site/2024121814_1734530354e2.jpg",
    contact: "Manuel Thiry (MATH)",
    date: new Date("2026-07-01 19:30"),
    format: "R: 30min",
    price: 31.5,
    drivers: ["THIRY", "MAUDOUX", "BECKERS", "GIARRUSSO", "MAGHE", "VINCENT", "HARDY", "VAN EYLEN"]
  },
  {
    id: 5,
    name: "Karting des Fagnes",
    address: "Rue du Karting 13, 5660 Couvin",
    distance: "1.3 km",
    imageUrl: "https://www.lavenir.net/resizer/v2/AVCT2F553ZEFJEXQ3SEYOQRKN4.jpg?auth=0b9be8d04b9e73a078e70838860f29bc40f18b1287b72d0af458d09e9fa95987&width=1620&height=1085&quality=85&focal=512%2C343"
  },
  {
    id: 6,
    name: "Hurricane Dolhain Karting",
    address: "Av. Reine Astrid 97/A, 4831 Limbourg",
    distance: "600 m",
    imageUrl: "https://i.pinimg.com/564x/90/7c/2f/907c2f8ecc87c1688948ed0dee503761.jpg"
  },
]
