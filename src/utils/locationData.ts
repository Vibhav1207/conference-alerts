export const EVENT_TYPES = [
  'All',
  'Conference',
  'Internship',
  'Journals',
  'Workshop / Seminar',
  'FAP',
] as const;

export const CATEGORIES = [
  'All',
  'Engineering & Tech',
  'Physical & Life Sciences',
  'Agricultural & Biological Sciences',
  'Medical & Health Sciences',
  'Business & Management',
  'Arts & Humanities',
  'Social Sciences',
  'FDP',
] as const;

export const CONTINENTS = [
  'All',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Australia / Oceania',
] as const;

export interface CountryCityMap {
  [country: string]: string[];
}

export interface ContinentLocationMap {
  [continent: string]: CountryCityMap;
}

export const LOCATION_HIERARCHY: ContinentLocationMap = {
  Asia: {
    Japan: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'],
    India: ['New Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Hyderabad'],
    Singapore: ['Singapore'],
    'South Korea': ['Seoul', 'Busan', 'Incheon'],
    China: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'],
  },
  Europe: {
    Switzerland: ['Zurich', 'Geneva', 'Lausanne', 'Basel'],
    Germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'],
    'United Kingdom': ['London', 'Cambridge', 'Oxford', 'Edinburgh'],
    Denmark: ['Copenhagen', 'Aarhus'],
    France: ['Paris', 'Lyon', 'Marseille'],
  },
  'North America': {
    'United States': ['Boston', 'New York', 'San Francisco', 'Chicago', 'Seattle'],
    Canada: ['Toronto', 'Vancouver', 'Montreal'],
  },
  'South America': {
    Brazil: ['São Paulo', 'Rio de Janeiro'],
    Argentina: ['Buenos Aires'],
  },
  Africa: {
    'South Africa': ['Cape Town', 'Johannesburg'],
    Egypt: ['Cairo'],
    Kenya: ['Nairobi'],
  },
  'Australia / Oceania': {
    Australia: ['Sydney', 'Melbourne', 'Brisbane'],
    'New Zealand': ['Auckland', 'Wellington'],
  },
};
