export const EVENT_TYPES = [
  'Conference',
  'Internship',
  'Journals',
  'Workshop / Seminar',
] as const;

export const CATEGORIES = [
  'Engineering & Tech',
  'Physical & Life Sciences',
  'Agricultural & Biological Sciences',
  'Medical & Health Sciences',
  'Business & Management',
  'Arts & Humanities',
  'Social Sciences',
] as const;

export const CONTINENTS = [
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Africa',
  'Australia / Oceania',
] as const;

export interface LocationHierarchy {
  continent: string;
  countries: {
    name: string;
    cities: string[];
  }[];
}

export const LOCATION_DATA: LocationHierarchy[] = [
  {
    continent: 'Asia',
    countries: [
      { name: 'Japan', cities: ['Tokyo', 'Kyoto', 'Osaka', 'Nagoya'] },
      { name: 'India', cities: ['New Delhi', 'Bengaluru', 'Mumbai', 'Chennai', 'Hyderabad'] },
      { name: 'Singapore', cities: ['Singapore'] },
      { name: 'South Korea', cities: ['Seoul', 'Busan', 'Incheon'] },
      { name: 'China', cities: ['Beijing', 'Shanghai', 'Shenzhen', 'Guangzhou'] },
    ],
  },
  {
    continent: 'Europe',
    countries: [
      { name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Lausanne', 'Basel'] },
      { name: 'Germany', cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'] },
      { name: 'United Kingdom', cities: ['London', 'Cambridge', 'Oxford', 'Edinburgh'] },
      { name: 'Denmark', cities: ['Copenhagen', 'Aarhus'] },
      { name: 'France', cities: ['Paris', 'Lyon', 'Marseille'] },
    ],
  },
  {
    continent: 'North America',
    countries: [
      { name: 'United States', cities: ['Boston', 'New York', 'San Francisco', 'Chicago', 'Seattle'] },
      { name: 'Canada', cities: ['Toronto', 'Vancouver', 'Montreal'] },
    ],
  },
  {
    continent: 'South America',
    countries: [
      { name: 'Brazil', cities: ['São Paulo', 'Rio de Janeiro'] },
      { name: 'Argentina', cities: ['Buenos Aires'] },
    ],
  },
  {
    continent: 'Africa',
    countries: [
      { name: 'South Africa', cities: ['Cape Town', 'Johannesburg'] },
      { name: 'Egypt', cities: ['Cairo'] },
      { name: 'Kenya', cities: ['Nairobi'] },
    ],
  },
  {
    continent: 'Australia / Oceania',
    countries: [
      { name: 'Australia', cities: ['Sydney', 'Melbourne', 'Brisbane'] },
      { name: 'New Zealand', cities: ['Auckland', 'Wellington'] },
    ],
  },
];
