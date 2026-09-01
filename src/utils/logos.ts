import hciLogo from '../images/hci.png';
import ieeeLogo from '../images/ieee.png';
import mdpiLogo from '../images/mdpi.png';
import scopusLogo from '../images/scopus.png';
import wosLogo from '../images/wos.png';

export interface PublisherLogoItem {
  id: string;
  name: string;
  shortName: string;
  src: string;
  tagline: string;
  badgeBg: string;
}

export const PUBLISHER_LOGOS: PublisherLogoItem[] = [
  {
    id: 'ieee',
    name: 'IEEE Xplore Digital Library',
    shortName: 'IEEE',
    src: ieeeLogo,
    tagline: 'IEEE Indexed Conference & Journal',
    badgeBg: 'bg-brutal-blue text-white',
  },
  {
    id: 'scopus',
    name: 'Scopus Elsevier Indexing',
    shortName: 'Scopus',
    src: scopusLogo,
    tagline: 'Scopus Bibliographic Database',
    badgeBg: 'bg-brutal-yellow text-brutal-black',
  },
  {
    id: 'wos',
    name: 'Web of Science (Clarivate)',
    shortName: 'Web of Science',
    src: wosLogo,
    tagline: 'Web of Science Master Journal List',
    badgeBg: 'bg-brutal-black text-white',
  },
  {
    id: 'hci',
    name: 'HCI International',
    shortName: 'HCI',
    src: hciLogo,
    tagline: 'Human-Computer Interaction Symposia',
    badgeBg: 'bg-purple-600 text-white',
  },
  {
    id: 'mdpi',
    name: 'MDPI Open Access Journals',
    shortName: 'MDPI',
    src: mdpiLogo,
    tagline: 'MDPI Academic Peer-Reviewed',
    badgeBg: 'bg-brutal-green text-white',
  },
];

/**
 * Returns logo item matching ID or name string
 */
export const getLogoById = (id?: string): PublisherLogoItem | undefined => {
  if (!id) return undefined;
  const normalized = id.toLowerCase().trim();
  return PUBLISHER_LOGOS.find(
    (l) => l.id === normalized || l.shortName.toLowerCase() === normalized || l.name.toLowerCase().includes(normalized)
  );
};

/**
 * Returns multiple logo items matching array of IDs, string, or fallback keywords
 */
export const getLogosByIds = (
  ids?: string[] | string,
  fallbackText?: string
): PublisherLogoItem[] => {
  const result: PublisherLogoItem[] = [];
  const seen = new Set<string>();

  if (Array.isArray(ids)) {
    ids.forEach((id) => {
      const match = getLogoById(id);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        result.push(match);
      }
    });
  } else if (typeof ids === 'string' && ids.trim()) {
    // If comma separated string or single id
    const parts = ids.split(',').map((p) => p.trim());
    parts.forEach((p) => {
      const match = getLogoById(p);
      if (match && !seen.has(match.id)) {
        seen.add(match.id);
        result.push(match);
      }
    });
  }

  if (result.length > 0) return result;

  // Try fallback text matching
  if (fallbackText) {
    const textLower = fallbackText.toLowerCase();
    PUBLISHER_LOGOS.forEach((logo) => {
      if ((textLower.includes(logo.id) || textLower.includes(logo.shortName.toLowerCase())) && !seen.has(logo.id)) {
        seen.add(logo.id);
        result.push(logo);
      }
    });
  }

  return result;
};
