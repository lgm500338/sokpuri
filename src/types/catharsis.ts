import { SoundEffectType } from '../utils/soundEngine';

export type WeaponCategory = 'firearms' | 'special' | 'strike' | 'splat' | 'shatter';

export type DummyStyle = 'bear' | 'bunny' | 'crash_dummy';

export type AppLanguage = 'ko' | 'en';

export type MouthSealType = 'none' | 'duct_tape' | 'zipper';

export interface WeaponItem {
  id: string;
  name: string;
  nameEn: string;
  category: WeaponCategory;
  categoryLabel: string;
  damage: number;
  rageGain: number;
  sound: SoundEffectType;
  hitWords: string[];
  hitWordsEn: string[];
  particleColors: string[];
  particleShape: 'spark' | 'cotton' | 'splat' | 'shard' | 'ceramic' | 'lightning';
  markType:
    | 'bandaid'
    | 'bump'
    | 'cotton_pop'
    | 'tomato'
    | 'cream'
    | 'ink'
    | 'mud'
    | 'crack'
    | 'burn_scorch'
    | 'bullet_hole'
    | 'laser_burn'
    | 'ice_frost';
  specialEffect?:
    | 'electrocute'
    | 'flood_electrocute'
    | 'seal_tape'
    | 'seal_zipper'
    | 'auto_fire'
    | 'shotgun_spread'
    | 'bazooka_blast'
    | 'laser_beam'
    | 'freeze_ray'
    | 'paint_burst';
  description: string;
  descriptionEn: string;
}

export interface DamageMark {
  id: string;
  x: number; // relative % inside dummy box (15 to 85)
  y: number; // relative % inside dummy box (12 to 88)
  rotation: number;
  scale: number;
  type: WeaponItem['markType'];
}

export interface FloatingPopText {
  id: string;
  x: number;
  y: number;
  text: string;
  subText?: string;
  color: string;
  isShout?: boolean;
}

export interface SessionStats {
  totalHits: number;
  maxCombo: number;
  objectsShattered: number;
  ultimatesUnleashed: number;
  shoutsThrown: number;
  papersBurned: number;
  papersShredded: number;
}
