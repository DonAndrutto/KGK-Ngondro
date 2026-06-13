export enum BlockType {
  INSTRUCTION = 'INSTRUCTION',
  RECITATION = 'RECITATION',
  HEADER = 'HEADER',
  NAVIGATION = 'NAVIGATION',
  TITLE = 'TITLE',
  IMAGE = 'IMAGE'
}

export interface PrayerBlock {
  id: string;
  type: BlockType;
  tibetan?: string;
  phonetics?: string;
  translation: string;
  targetTab?: 'YOGA' | 'NGONDRO';
  variant?: 'default' | 'repeated';
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface PrayerSection {
  id: string;
  title: string;
  blocks: PrayerBlock[];
}

export interface AppSettings {
  fontSize: number; // base pixel size
  isDarkMode: boolean;
  showPhonetics: boolean;
  showTranslation: boolean;
  showTibetan: boolean;
}