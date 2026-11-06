import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BearFigure, BunnyFigure, CrashDummyFigure, ElectrocutedEars } from './TargetCharacters';
import { BasementRoom, roomGeometry } from './BasementRoom';
import {
  Flame,
  RotateCcw,
  Volume2,
  VolumeX,
  Send,
  Zap,
  X,
  Tag,
  Droplets,
  Lock,
  Smartphone,
  Hand,
  Snowflake,
  User,
  Globe,
  ArrowLeftRight,
} from 'lucide-react';
import {
  WeaponCategory,
  WeaponItem,
  DummyStyle,
  AppLanguage,
  MouthSealType,
  DamageMark,
  FloatingPopText,
  SessionStats,
} from '../types/catharsis';
import { soundEngine } from '../utils/soundEngine';

export const WEAPONS: WeaponItem[] = [
  // 0. 총기 · 사격 무기 (Firearms)
  {
    id: 'ak47_rifle',
    name: 'AK-47 돌격소총 (누르면 연사)',
    nameEn: 'AK-47 Assault Rifle (Hold)',
    category: 'firearms',
    categoryLabel: '총기 · 사격',
    damage: 22,
    rageGain: 10,
    sound: 'machine_gun',
    hitWords: ['타타타탕!!', 'AK명중!!', '집중포화!!', '관통!!'],
    hitWordsEn: ['RAT-TAT-TAT!!', 'BULLSEYE!!', 'FULL AUTO!!', 'PIERCED!!'],
    particleColors: ['#FBBF24', '#F97316', '#FEF08A', '#FFFFFF'],
    particleShape: 'spark',
    markType: 'bullet_hole',
    specialEffect: 'auto_fire',
    description: '화면을 누르고 있으면 측면 총구가 조준점을 따라가며 연속으로 소총탄을 발사합니다',
    descriptionEn: 'Hold down to unleash continuous automatic rifle fire from the side turret',
  },
  {
    id: 'uzi_smg',
    name: '우지(Uzi) 기관단총 (초고속 연사)',
    nameEn: 'Uzi Submachine Gun (Rapid)',
    category: 'firearms',
    categoryLabel: '총기 · 사격',
    damage: 16,
    rageGain: 9,
    sound: 'machine_gun',
    hitWords: ['드르르륵!!', '벌집명중!!', '초고속연사!', '따다다당!'],
    hitWordsEn: ['BRRRRRRT!!', 'RIDDLED!!', 'RAPID FIRE!', 'SHREDDED!'],
    particleColors: ['#38BDF8', '#FDE047', '#F97316', '#FFFFFF'],
    particleShape: 'spark',
    markType: 'bullet_hole',
    specialEffect: 'auto_fire',
    description: '밀실 안을 뛰어다니는 표적에게 순식간에 수십 발의 총알을 퍼붓습니다',
    descriptionEn: 'Sprays dozens of high-speed bullets at the dodging target',
  },
  {
    id: 'green_pistol',
    name: '택티컬 매그넘 권총',
    nameEn: 'Tactical Magnum Pistol',
    category: 'firearms',
    categoryLabel: '총기 · 사격',
    damage: 28,
    rageGain: 13,
    sound: 'machine_gun',
    hitWords: ['탕ㅡ!!', '정밀사격!', '헤드샷!!', '명중!!'],
    hitWordsEn: ['BANG!!', 'HEADSHOT!!', 'DIRECT HIT!', 'CRACK!!'],
    particleColors: ['#4ADE80', '#FBBF24', '#FFFFFF'],
    particleShape: 'spark',
    markType: 'bullet_hole',
    description: '묵직한 단발 사격으로 조준한 부위를 정확하게 꿰뚫습니다',
    descriptionEn: 'Heavy single-shot handgun with pinpoint laser accuracy',
  },
  {
    id: 'double_shotgun',
    name: '더블배럴 산탄 샷건',
    nameEn: 'Double-Barrel Shotgun',
    category: 'firearms',
    categoryLabel: '총기 · 사격',
    damage: 40,
    rageGain: 17,
    sound: 'shotgun_blast',
    hitWords: ['콰아앙!!', '산탄폭발!!', '벽으로날아가!', '전탄명중!'],
    hitWordsEn: ['KABOOM!!', 'BUCKSHOT!!', 'BLASTED!!', 'KNOCKOUT!'],
    particleColors: ['#EF4444', '#F97316', '#FBBF24', '#E2E8F0'],
    particleShape: 'spark',
    markType: 'bullet_hole',
    specialEffect: 'shotgun_spread',
    description: '넓은 범위로 산탄이 퍼져 나가 조금만 스쳐도 밀실 벽까지 강하게 날려버립니다',
    descriptionEn: 'Fires a wide spread of buckshot that blasts the target into the wall',
  },
  {
    id: 'frag_grenade',
    name: '세열 수류탄 투척',
    nameEn: 'Frag Grenade Blast',
    category: 'firearms',
    categoryLabel: '폭탄 · 중화기',
    damage: 55,
    rageGain: 24,
    sound: 'shotgun_blast',
    hitWords: ['콰르르릉!!', '수류탄폭발!', '밀실초토화!', '대폭발!!'],
    hitWordsEn: ['BOOM!!', 'GRENADE!!', 'DEVASTATED!!', 'MEGA BLAST!'],
    particleColors: ['#EF4444', '#F97316', '#FDE047', '#1E293B'],
    particleShape: 'shard',
    markType: 'burn_scorch',
    specialEffect: 'bazooka_blast',
    description: '핀을 뽑은 수류탄을 던져 밀실 전체가 흔들리는 거대한 폭발을 일으킵니다',
    descriptionEn: 'Throws a live frag grenade that shakes the entire box room',
  },
  {
    id: 'cryo_freeze_gun',
    name: '급속 냉동 캐논 (얼음 감옥)',
    nameEn: 'Cryo Freeze Cannon',
    category: 'firearms',
    categoryLabel: '총기 · 사격',
    damage: 28,
    rageGain: 15,
    sound: 'freeze_blast',
    hitWords: ['꽁꽁얼음!!', '동결완료!!', '꼼짝마라!!', '얼음감옥!'],
    hitWordsEn: ['FROZEN SOLID!!', 'ICE BLOCK!!', 'DONT MOVE!!', 'SUB-ZERO!'],
    particleColors: ['#38BDF8', '#7DD3FC', '#E0F2FE', '#FFFFFF'],
    particleShape: 'shard',
    markType: 'ice_frost',
    specialEffect: 'freeze_ray',
    description: '명중 시 표적을 얼음덩어리로 꽁꽁 얼려 도망치지 못하게 발을 묶어둡니다',
    descriptionEn: 'Freezes the running target solid inside an ice block',
  },

  // 1. 둔기 · 냉병기 (Strike)
  {
    id: 'spiked_mace',
    name: '사슬 철퇴 (모닝스타)',
    nameEn: 'Spiked Morningstar Mace',
    category: 'strike',
    categoryLabel: '둔기 · 냉병기',
    damage: 38,
    rageGain: 17,
    sound: 'metal_pan',
    hitWords: ['콰직ㅡ!!', '철퇴강타!!', '묵직하다!!', '박살!!'],
    hitWordsEn: ['CRUNCH!!', 'MACE SMASH!!', 'BRUTAL!!', 'CRUSHED!!'],
    particleColors: ['#94A3B8', '#E2E8F0', '#EF4444', '#F97316'],
    particleShape: 'spark',
    markType: 'crack',
    description: '사슬에 달린 가시 철퇴를 휘둘러 밀실 벽에 강하게 패대기칩니다',
    descriptionEn: 'Swings a heavy spiked iron ball and slams the target',
  },
  {
    id: 'battle_axe',
    name: '강철 양날 배틀액스',
    nameEn: 'Heavy Steel Battle Axe',
    category: 'strike',
    categoryLabel: '둔기 · 냉병기',
    damage: 42,
    rageGain: 18,
    sound: 'wood_bat',
    hitWords: ['퍼억ㅡ!!', '도끼강타!!', '두동강!!', '일격!!'],
    hitWordsEn: ['CHOP!!', 'AXE CLEAVE!!', 'HEAVY HIT!!', 'WHACK!!'],
    particleColors: ['#CBD5E1', '#EF4444', '#F59E0B', '#FFFFFF'],
    particleShape: 'spark',
    markType: 'crack',
    description: '묵직한 강철 도끼로 내려찍어 엄청난 충격파와 상처를 남깁니다',
    descriptionEn: 'Delivers a massive overhead chop with a steel axe',
  },
  {
    id: 'circular_saw',
    name: '초고속 강철 회전톱날',
    nameEn: 'Spinning Steel Sawblade',
    category: 'strike',
    categoryLabel: '둔기 · 냉병기',
    damage: 44,
    rageGain: 19,
    sound: 'metal_pan',
    hitWords: ['위이이잉ㅡ콱!', '톱날회전!!', '갈아버려!!', '불꽃튀네!'],
    hitWordsEn: ['BZZZZTㅡSLASH!', 'SAWBLADE!!', 'SPARKS FLY!!', 'SHRED!!'],
    particleColors: ['#FDE047', '#F97316', '#E2E8F0', '#38BDF8'],
    particleShape: 'spark',
    markType: 'bandaid',
    description: '맹렬하게 회전하는 강철 톱날을 날려 불꽃이 튀도록 타격합니다',
    descriptionEn: 'Hurls a high-speed spinning steel sawblade with flying sparks',
  },
  {
    id: 'iron_pan',
    name: '무쇠 프라이팬 스매시',
    nameEn: 'Cast-Iron Frying Pan',
    category: 'strike',
    categoryLabel: '둔기 · 냉병기',
    damage: 30,
    rageGain: 14,
    sound: 'metal_pan',
    hitWords: ['깡ㅡ!!', '쩌렁쩌렁!!', '정신차려!!', '홈런!!'],
    hitWordsEn: ['CLANGㅡ!!', 'BONK!!', 'HOME RUN!!', 'SMACK!!'],
    particleColors: ['#F97316', '#EF4444', '#E2E8F0', '#FBBF24'],
    particleShape: 'spark',
    markType: 'bump',
    description: '쩌렁쩌렁 울리는 무쇠 소리와 함께 머리에 큼직한 혹을 만듭니다',
    descriptionEn: 'Rings out with a loud metallic clang and leaves a giant bump',
  },

  // 2. 수중 감전 & 입봉쇄 특수 도구 (Special)
  {
    id: 'underwater_generator',
    name: '유리 수조 & 고압 전선 감전',
    nameEn: 'Glass Tank High-Voltage Wire',
    category: 'special',
    categoryLabel: '수조 · 입봉쇄',
    damage: 48,
    rageGain: 22,
    sound: 'electric_zap',
    hitWords: ['빠지직ㅡ!!', '백만볼트!!', '찌릿찌릿!!', '감전폭발!!'],
    hitWordsEn: ['ZZZZAPㅡ!!', '1,000,000 VOLTS!', 'ELECTROCUTED!', 'SHOCKED!!'],
    particleColors: ['#38BDF8', '#FEF08A', '#FDE047', '#FFFFFF'],
    particleShape: 'lightning',
    markType: 'burn_scorch',
    specialEffect: 'flood_electrocute',
    description: '유리 수조에 가두고 컬러 전선 다발을 물에 담가 뼈대가 보이도록 감전시킵니다',
    descriptionEn: 'Traps target in a water tank and dips live wires to flash their skeleton',
  },
  {
    id: 'giant_duct_tape',
    name: '초대형 청테이프 입봉쇄',
    nameEn: 'Giant Duct Tape Mouth Gag',
    category: 'special',
    categoryLabel: '수조 · 입봉쇄',
    damage: 25,
    rageGain: 15,
    sound: 'tape_seal',
    hitWords: ['쩍ㅡ!!', '입봉쇄!!', '읍읍!!', '잔소리차단!'],
    hitWordsEn: ['RIPㅡSLAP!!', 'MOUTH SEALED!', 'MMPHH!!', 'SHUT UP!!'],
    particleColors: ['#2563EB', '#3B82F6', '#93C5FD', '#E2E8F0'],
    particleShape: 'spark',
    markType: 'bandaid',
    specialEffect: 'seal_tape',
    description: '듣기 싫은 잔소리와 헛소리를 X자 대형 청테이프로 원천 봉쇄합니다',
    descriptionEn: 'Slaps heavy X-shaped blue duct tape across the mouth to silence nagging',
  },
  {
    id: 'iron_zipper',
    name: '강철 지퍼 & 자물쇠 잠금',
    nameEn: 'Steel Zipper & Padlock Gag',
    category: 'special',
    categoryLabel: '수조 · 입봉쇄',
    damage: 26,
    rageGain: 15,
    sound: 'zipper_lock',
    hitWords: ['드르륵ㅡ착!', '영구잠금!', '므읍읍!!', '입다물어!'],
    hitWordsEn: ['ZIIIIPㅡLOCK!', 'PADLOCKED!', 'MMMPH!!', 'SILENCED!'],
    particleColors: ['#94A3B8', '#CBD5E1', '#FBBF24', '#475569'],
    particleShape: 'spark',
    markType: 'crack',
    specialEffect: 'seal_zipper',
    description: '입에 강철 지퍼를 채우고 황금 자물쇠로 굳게 잠가버립니다',
    descriptionEn: 'Zips the mouth shut with steel teeth and locks it with a gold padlock',
  },

  // 3. 투척 · 오물 · 접시 깨기 (Splat & Shatter)
  {
    id: 'rotten_tomato',
    name: '물컹한 토마토 & 케이크 투척',
    nameEn: 'Rotten Tomato & Cake Splat',
    category: 'splat',
    categoryLabel: '오물 · 박살',
    damage: 22,
    rageGain: 12,
    sound: 'splat_wet',
    hitWords: ['철퍽!!', '푸슉!!', '얼굴범벅!!', '으악!!'],
    hitWordsEn: ['SPLAT!!', 'SQUISH!!', 'PIE IN FACE!', 'MESSY!!'],
    particleColors: ['#EF4444', '#DC2626', '#FFFBEB', '#FDE047'],
    particleShape: 'splat',
    markType: 'tomato',
    description: '얼굴 정중앙에 물컹한 토마토와 생크림을 한가득 덮어씌웁니다',
    descriptionEn: 'Splashes mushy tomatoes and whipped cream right across their face',
  },
  {
    id: 'mud_ink_bomb',
    name: '먹물 · 진흙 오물 폭탄',
    nameEn: 'Black Ink & Mud Bomb',
    category: 'splat',
    categoryLabel: '오물 · 박살',
    damage: 25,
    rageGain: 13,
    sound: 'splat_wet',
    hitWords: ['철푸덕!!', '먹물세례!', '진흙탕!!', '더럽게!'],
    hitWordsEn: ['SPLASH!!', 'INK BOMB!!', 'MUDDY MESS!', 'FILTHY!!'],
    particleColors: ['#1E293B', '#78350F', '#92400E', '#0F172A'],
    particleShape: 'splat',
    markType: 'mud',
    description: '시꺼먼 먹물과 진흙덩이를 던져 온몸을 흙탕물로 만듭니다',
    descriptionEn: 'Covers the target head-to-toe in black ink and sticky mud',
  },
  {
    id: 'ceramic_plate',
    name: '도자기 접시 · 찻잔 와장창',
    nameEn: 'Ceramic Plate Shatter',
    category: 'shatter',
    categoryLabel: '오물 · 박살',
    damage: 35,
    rageGain: 17,
    sound: 'shatter_ceramic',
    hitWords: ['와장창!!', '박살!!', '산산조각!', '쨍그랑!!'],
    hitWordsEn: ['SMASH!!', 'SHATTERED!!', 'CRASH!!', 'IN PIECES!'],
    particleColors: ['#F8FAFC', '#E2E8F0', '#CBD5E1', '#38BDF8'],
    particleShape: 'ceramic',
    markType: 'crack',
    description: '하얀 도자기 접시와 찻잔을 던져 수십 조각으로 시원하게 깨부숩니다',
    descriptionEn: 'Smashes porcelain plates and teacups into dozens of flying shards',
  },
];

const QUICK_SHOUTS_KO = [
  '개XX야!!',
  '씨XX아!!',
  '진짜 적당히 좀 해라!!',
  '니가 뭔데 이래라저래라야!!',
  '꼴도 보기 싫으니까 눈앞에서 사라져!!',
  '내 앞길 막지 말고 저리 비켜!!',
  '남 참견 그만하고 너나 잘해!!',
  '지랄하고 자빠졌네!!',
  '3대가 망해라!!',
];

const QUICK_SHOUTS_EN = [
  'You son of a b*tch!!',
  'You f*cking bastard!!',
  'Know when to stop!!',
  'Who are you to boss me around?!',
  'Get out of my sight right now!!',
  'Stop blocking my way and move!!',
  'Mind your own business!!',
  'What a load of bullshit!!',
  'Curse you for 3 generations!!',
];

type BinderTab = 'all' | 'firearms' | 'strike' | 'special' | 'splat';

interface CanvasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
  shape: WeaponItem['particleShape'] | 'bubble' | 'shell_casing';
  gravity: number;
}

interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
}

interface LightningBolt {
  points: { x: number; y: number }[];
  color: string;
  alpha: number;
  width: number;
}

interface BulletTracer {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  alpha: number;
  width: number;
}

interface DummyPhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scaleX: number;
  scaleY: number;
  targetX: number;
  nextDecisionTime: number;
  nextJumpTime: number;
  panicUntil: number;
  frozenUntil: number;
  walkPhase: number;
  facingDir: 1 | -1;
}

interface DummySandboxProps {
  stats: SessionStats;
  setStats: React.Dispatch<React.SetStateAction<SessionStats>>;
  lang: AppLanguage;
  onToggleLang: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isRotatedLandscape: boolean;
  /** 화면을 직접 돌린 각도 (90: 시계 방향, -90: 반시계 방향) */
  rotationDeg: 0 | 90 | -90;
  /** 가로 고정 버튼이 켜져 있는지 */
  isForcedLandscape: boolean;
  /** 세로로 든 휴대폰에서 세로 배치로 보여줄 때 true */
  isPortraitLayout: boolean;
  onToggleRotateLock: () => void;
  onOpenPaperModal: () => void;
}

// ============================================================================
// HIGH-DETAIL 3D-SHADED WEAPON ILLUSTRATIONS (Barrel points RIGHT along +X axis)
// ============================================================================
const HighDetailWeaponSvg: React.FC<{ weaponId: string; className?: string }> = ({
  weaponId,
  className = 'w-24 h-16',
}) => {
  switch (weaponId) {
    case 'ak47_rifle':
      return (
        <svg viewBox="0 0 220 95" className={className}>
          <defs>
            <linearGradient id="akSteel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="45%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="akWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#9A3412" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>
            <linearGradient id="akMag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="60%" stopColor="#9A3412" />
              <stop offset="100%" stopColor="#431407" />
            </linearGradient>
          </defs>
          {/* Wooden Buttstock with Rubber Buttplate & Sling Swivel */}
          <path
            d="M 8,42 L 60,32 L 60,50 L 14,68 C 8,68 6,55 8,42 Z"
            fill="url(#akWood)"
            stroke="#270E04"
            strokeWidth="2.5"
          />
          <rect x="5" y="42" width="5" height="25" rx="2" fill="#1E293B" />
          {/* Wooden Pistol Grip */}
          <path
            d="M 64,50 L 79,50 L 70,80 L 54,78 Z"
            fill="url(#akWood)"
            stroke="#270E04"
            strokeWidth="2.5"
          />
          {/* Trigger Guard & Curved Trigger */}
          <path
            d="M 78,50 L 94,50 L 92,62 L 76,62 Z"
            fill="none"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <path d="M 84,50 Q 82,58 87,60" fill="none" stroke="#94A3B8" strokeWidth="2.5" />
          {/* Curved Bakelite Banana Magazine with Ribs */}
          <path
            d="M 98,48 Q 108,76 132,88 L 114,92 Q 88,78 82,48 Z"
            fill="url(#akMag)"
            stroke="#270E04"
            strokeWidth="2.5"
          />
          <line x1="92" y1="62" x2="106" y2="58" stroke="#FDBA74" strokeWidth="1.5" opacity="0.5" />
          <line x1="99" y1="74" x2="114" y2="70" stroke="#FDBA74" strokeWidth="1.5" opacity="0.5" />
          {/* Stamped Steel Receiver & Ribbed Dust Cover */}
          <path
            d="M 58,26 L 130,26 L 134,50 L 58,50 Z"
            fill="url(#akSteel)"
            stroke="#090D16"
            strokeWidth="2.5"
          />
          <rect x="64" y="29" width="58" height="6" rx="2" fill="#94A3B8" opacity="0.35" />
          {/* Ejection Port & Bolt Carrier Handle */}
          <rect x="96" y="34" width="24" height="7" rx="2" fill="#CBD5E1" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="68" cy="44" r="2" fill="#94A3B8" />
          <circle cx="122" cy="44" r="2" fill="#94A3B8" />
          {/* Rear Sight Block */}
          <rect x="124" y="20" width="14" height="6" rx="1" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
          {/* Steel Barrel & Gas Tube */}
          <rect x="134" y="34" width="76" height="6" fill="url(#akSteel)" stroke="#090D16" strokeWidth="2" />
          <rect x="134" y="27" width="46" height="5" fill="#475569" stroke="#090D16" strokeWidth="1.5" />
          <path d="M 178,27 L 184,34 L 178,34 Z" fill="#334155" />
          {/* Wooden Upper & Lower Handguard with Vent Slots */}
          <rect x="134" y="26" width="40" height="8" rx="2" fill="url(#akWood)" stroke="#270E04" strokeWidth="2" />
          <rect x="134" y="35" width="42" height="12" rx="3" fill="url(#akWood)" stroke="#270E04" strokeWidth="2" />
          <rect x="142" y="33" width="6" height="3" rx="1" fill="#090D16" />
          <rect x="152" y="33" width="6" height="3" rx="1" fill="#090D16" />
          {/* Front Triangle Sight Post & Slanted Muzzle Brake */}
          <polygon points="194,18 202,34 190,34" fill="#1E293B" stroke="#090D16" strokeWidth="2" />
          <polygon points="208,32 218,30 215,41 208,41" fill="#334155" stroke="#090D16" strokeWidth="2" />
        </svg>
      );

    case 'uzi_smg':
      return (
        <svg viewBox="0 0 180 100" className={className}>
          <defs>
            <linearGradient id="uziBody" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="uziDark" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Folding Rear Stock */}
          <path d="M 12,32 L 38,32 L 38,40 L 16,46 Z" fill="url(#uziDark)" stroke="#090D16" strokeWidth="2" />
          {/* Extended Vertical Magazine & Grip */}
          <rect x="68" y="54" width="16" height="40" rx="2" fill="url(#uziDark)" stroke="#090D16" strokeWidth="2.5" />
          <path d="M 62,48 L 88,48 L 86,74 L 60,74 Z" fill="#1E293B" stroke="#090D16" strokeWidth="2.5" />
          {/* Trigger Guard */}
          <path d="M 86,48 L 104,48 L 100,62 L 86,62 Z" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          {/* Boxy Stamped Receiver with Cooling Ribs */}
          <rect x="34" y="22" width="96" height="28" rx="4" fill="url(#uziBody)" stroke="#0F172A" strokeWidth="2.5" />
          <rect x="42" y="26" width="54" height="6" rx="2" fill="#93C5FD" opacity="0.5" />
          <line x1="46" y1="38" x2="88" y2="38" stroke="#1E3A8A" strokeWidth="3" />
          <line x1="46" y1="44" x2="88" y2="44" stroke="#1E3A8A" strokeWidth="3" />
          {/* Top Cocking Handle & Sight Wings */}
          <rect x="74" y="13" width="16" height="9" rx="2" fill="url(#uziDark)" stroke="#090D16" strokeWidth="2" />
          <polygon points="40,22 46,15 52,22" fill="#1E293B" />
          <polygon points="116,22 122,15 128,22" fill="#1E293B" />
          {/* Barrel Nut & Suppressor / Heavy Barrel */}
          <rect x="130" y="27" width="12" height="18" rx="2" fill="#334155" stroke="#090D16" strokeWidth="2" />
          <rect x="142" y="30" width="32" height="12" rx="3" fill="url(#uziDark)" stroke="#090D16" strokeWidth="2.5" />
        </svg>
      );

    case 'green_pistol':
      return (
        <svg viewBox="0 0 165 100" className={className}>
          <defs>
            <linearGradient id="pistolSlide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="55%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#052E16" />
            </linearGradient>
            <linearGradient id="pistolGrip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          {/* Cocked Hammer */}
          <path d="M 28,24 L 18,16 L 22,32 Z" fill="#475569" stroke="#090D16" strokeWidth="2" />
          {/* Ergonomic Textured Grip & Magazine Baseplate */}
          <path
            d="M 30,44 L 68,44 L 54,88 L 20,86 C 18,72 24,58 30,44 Z"
            fill="url(#pistolGrip)"
            stroke="#090D16"
            strokeWidth="2.5"
          />
          <path d="M 32,52 L 56,52 L 46,80 L 26,79 Z" fill="#14532D" stroke="#052E16" strokeWidth="1.5" />
          <rect x="16" y="85" width="40" height="6" rx="2" fill="#090D16" />
          {/* Trigger Guard & Trigger */}
          <path d="M 66,44 L 94,44 L 90,62 L 62,62 Z" fill="none" stroke="#1E293B" strokeWidth="3" />
          <path d="M 76,44 Q 72,54 80,58" fill="none" stroke="#FBBF24" strokeWidth="3" />
          {/* Under-Barrel Tactical Laser Sight Module */}
          <rect x="94" y="44" width="36" height="12" rx="3" fill="#1E293B" stroke="#090D16" strokeWidth="2" />
          <circle cx="130" cy="50" r="3" fill="#EF4444" />
          {/* Heavy Metallic Slide with Serrations & Ejection Port */}
          <path
            d="M 26,20 L 142,20 C 146,20 148,24 148,30 L 148,44 L 26,44 Z"
            fill="url(#pistolSlide)"
            stroke="#052E16"
            strokeWidth="2.5"
          />
          <rect x="34" y="24" width="98" height="5" rx="2" fill="#86EFAC" opacity="0.55" />
          <rect x="76" y="22" width="26" height="8" rx="1.5" fill="#1E293B" />
          {/* Rear Slide Grip Serrations */}
          <line x1="36" y1="28" x2="34" y2="40" stroke="#052E16" strokeWidth="2.5" />
          <line x1="42" y1="28" x2="40" y2="40" stroke="#052E16" strokeWidth="2.5" />
          <line x1="48" y1="28" x2="46" y2="40" stroke="#052E16" strokeWidth="2.5" />
          {/* Glowing Sights & Compensator Tip */}
          <rect x="30" y="15" width="8" height="5" rx="1" fill="#0F172A" />
          <rect x="134" y="14" width="6" height="6" rx="1" fill="#F97316" />
          <rect x="148" y="25" width="10" height="14" rx="2" fill="#F97316" stroke="#7C2D12" strokeWidth="2" />
        </svg>
      );

    case 'double_shotgun':
      return (
        <svg viewBox="0 0 220 85" className={className}>
          <defs>
            <linearGradient id="sgBarrel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="40%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="sgWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="55%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>
          </defs>
          {/* Checkered Walnut Stock */}
          <path
            d="M 8,44 L 74,30 L 78,46 L 14,72 C 8,70 6,56 8,44 Z"
            fill="url(#sgWood)"
            stroke="#270E04"
            strokeWidth="2.5"
          />
          {/* Engraved Silver Receiver */}
          <path
            d="M 72,26 L 104,26 L 104,46 L 74,46 Z"
            fill="#CBD5E1"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <circle cx="88" cy="36" r="4" fill="#64748B" />
          {/* Double Triggers & Guard */}
          <path d="M 76,46 Q 86,58 98,46" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          {/* Twin Over-Under / Side-by-Side Heavy Steel Barrels */}
          <rect x="104" y="24" width="108" height="9" rx="2" fill="url(#sgBarrel)" stroke="#090D16" strokeWidth="2" />
          <rect x="104" y="33" width="108" height="9" rx="2" fill="url(#sgBarrel)" stroke="#090D16" strokeWidth="2" />
          <line x1="110" y1="27" x2="206" y2="27" stroke="#E2E8F0" strokeWidth="1.5" opacity="0.6" />
          {/* Walnut Forend Grip under Barrels */}
          <path
            d="M 104,41 L 158,41 L 152,51 L 104,50 Z"
            fill="url(#sgWood)"
            stroke="#270E04"
            strokeWidth="2"
          />
          {/* Brass Bead Front Sight */}
          <circle cx="206" cy="21" r="3" fill="#FBBF24" stroke="#78350F" strokeWidth="1.5" />
        </svg>
      );

    case 'frag_grenade':
      return (
        <svg viewBox="0 0 110 110" className={className}>
          <defs>
            <radialGradient id="grenadeBody" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="55%" stopColor="#3F6212" />
              <stop offset="100%" stopColor="#1A2E05" />
            </radialGradient>
          </defs>
          {/* Safety Lever Handle (Spoon) */}
          <path
            d="M 46,16 L 84,22 L 88,68 L 78,72 L 76,30 L 46,24 Z"
            fill="#64748B"
            stroke="#0F172A"
            strokeWidth="2.5"
          />
          {/* Cast Iron Pineapple Body */}
          <ellipse cx="54" cy="62" rx="30" ry="35" fill="url(#grenadeBody)" stroke="#142404" strokeWidth="3.5" />
          {/* Pineapple Segmentation Grooves */}
          <path d="M 26,50 Q 54,56 82,50" fill="none" stroke="#142404" strokeWidth="3.5" />
          <path d="M 24,64 Q 54,70 84,64" fill="none" stroke="#142404" strokeWidth="3.5" />
          <path d="M 28,78 Q 54,84 80,78" fill="none" stroke="#142404" strokeWidth="3.5" />
          <line x1="42" y1="30" x2="38" y2="94" stroke="#142404" strokeWidth="3.5" />
          <line x1="54" y1="28" x2="54" y2="96" stroke="#142404" strokeWidth="3.5" />
          <line x1="66" y1="30" x2="70" y2="94" stroke="#142404" strokeWidth="3.5" />
          {/* Metallic Fuse Neck */}
          <rect x="44" y="14" width="20" height="15" rx="2" fill="#94A3B8" stroke="#0F172A" strokeWidth="2.5" />
          {/* Gold Pull Pin Ring */}
          <circle cx="34" cy="22" r="10" fill="none" stroke="#FBBF24" strokeWidth="4" />
        </svg>
      );

    case 'cryo_freeze_gun':
      return (
        <svg viewBox="0 0 190 95" className={className}>
          <defs>
            <linearGradient id="cryoTank" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Rear Stock & Grip */}
          <path d="M 14,42 L 48,34 L 48,54 L 18,64 Z" fill="#1E293B" stroke="#090D16" strokeWidth="2.5" />
          <path d="M 56,52 L 74,52 L 66,84 L 48,82 Z" fill="#334155" stroke="#090D16" strokeWidth="2.5" />
          {/* Main Cryo Chassis */}
          <rect x="44" y="24" width="90" height="32" rx="8" fill="#0369A1" stroke="#082F49" strokeWidth="3" />
          {/* Glowing Liquid Nitrogen Core Chamber */}
          <rect x="56" y="30" width="52" height="20" rx="6" fill="url(#cryoTank)" stroke="#FFFFFF" strokeWidth="2" />
          {/* Cooling Coils & Emitter Cone */}
          <rect x="134" y="28" width="22" height="24" rx="3" fill="#38BDF8" stroke="#082F49" strokeWidth="2.5" />
          <polygon points="156,22 184,14 184,66 156,58" fill="url(#cryoTank)" stroke="#082F49" strokeWidth="2.5" />
        </svg>
      );

    case 'spiked_mace':
      return (
        <svg viewBox="0 0 170 105" className={className}>
          <defs>
            <radialGradient id="maceBall" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>
          {/* Leather-Wrapped Handle */}
          <rect x="10" y="64" width="64" height="12" rx="4" fill="#78350F" stroke="#270E04" strokeWidth="2.5" transform="rotate(-22 42 70)" />
          {/* Chain Links */}
          <ellipse cx="74" cy="48" rx="7" ry="4" fill="none" stroke="#94A3B8" strokeWidth="3.5" transform="rotate(-15 74 48)" />
          <ellipse cx="86" cy="44" rx="7" ry="4" fill="none" stroke="#CBD5E1" strokeWidth="3.5" transform="rotate(15 86 44)" />
          {/* Spikes around the Iron Sphere */}
          <polygon points="122,6 128,24 116,24" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <polygon points="122,90 128,72 116,72" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
          <polygon points="80,48 98,42 98,54" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <polygon points="164,48 146,42 146,54" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <polygon points="92,18 108,28 100,36" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <polygon points="152,18 136,28 144,36" fill="#E2E8F0" stroke="#0F172A" strokeWidth="2" />
          <polygon points="92,78 108,68 100,60" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
          <polygon points="152,78 136,68 144,60" fill="#94A3B8" stroke="#0F172A" strokeWidth="2" />
          {/* Heavy Iron Sphere */}
          <circle cx="122" cy="48" r="25" fill="url(#maceBall)" stroke="#0F172A" strokeWidth="3" />
          <polygon points="122,36 128,52 116,52" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );

    case 'battle_axe':
      return (
        <svg viewBox="0 0 180 105" className={className}>
          <defs>
            <linearGradient id="axeBlade" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="55%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          {/* Curved Hickory Handle */}
          <rect x="14" y="46" width="136" height="11" rx="4" fill="#92400E" stroke="#451A03" strokeWidth="2.5" transform="rotate(-14 82 52)" />
          {/* Double-Beveled Steel Axe Blade */}
          <path
            d="M 104,22 C 138,10 162,28 156,68 C 134,62 118,48 104,22 Z"
            fill="url(#axeBlade)"
            stroke="#0F172A"
            strokeWidth="3"
          />
          <path
            d="M 146,24 C 158,36 158,54 148,66"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
        </svg>
      );

    case 'circular_saw':
      return (
        <svg viewBox="0 0 110 110" className={className}>
          <defs>
            <radialGradient id="sawDisc" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>
          {/* Serrated Outer Saw Teeth */}
          <circle
            cx="55"
            cy="55"
            r="42"
            fill="url(#sawDisc)"
            stroke="#1E293B"
            strokeWidth="5"
            strokeDasharray="8 5"
          />
          <circle cx="55" cy="55" r="34" fill="none" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="55" cy="55" r="14" fill="#DC2626" stroke="#0F172A" strokeWidth="3" />
          <circle cx="55" cy="55" r="5" fill="#0F172A" />
        </svg>
      );

    case 'iron_pan':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          <defs>
            <radialGradient id="panIron" cx="45%" cy="40%" r="65%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0F172A" />
            </radialGradient>
          </defs>
          {/* 나무 손잡이 + 금속 목 */}
          <rect x="6" y="38" width="44" height="14" rx="7" fill="#92400E" stroke="#451A03" strokeWidth="2.5" />
          <line x1="14" y1="45" x2="42" y2="45" stroke="#B45309" strokeWidth="2" />
          <circle cx="12" cy="45" r="2.5" fill="#451A03" />
          <rect x="46" y="40" width="26" height="10" rx="3" fill="#334155" stroke="#090D16" strokeWidth="2.5" />
          {/* 팬 몸체 */}
          <ellipse cx="116" cy="45" rx="46" ry="36" fill="url(#panIron)" stroke="#090D16" strokeWidth="3.5" />
          <ellipse cx="116" cy="45" rx="35" ry="26" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
          <path d="M 92,30 Q 104,22 120,22" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    case 'underwater_generator':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 꼬인 전선 3가닥 */}
          <path d="M 4,58 C 30,70 44,30 72,44" fill="none" stroke="#DC2626" strokeWidth="7" strokeLinecap="round" />
          <path d="M 4,48 C 30,60 44,22 72,38" fill="none" stroke="#2563EB" strokeWidth="7" strokeLinecap="round" />
          <path d="M 4,68 C 30,80 44,40 72,50" fill="none" stroke="#FACC15" strokeWidth="7" strokeLinecap="round" />
          {/* 절연 손잡이 */}
          <rect x="68" y="30" width="40" height="30" rx="8" fill="#18181B" stroke="#000000" strokeWidth="3" />
          <rect x="74" y="36" width="28" height="6" rx="3" fill="#FACC15" />
          <text x="88" y="55" textAnchor="middle" fontSize="9" fontWeight="900" fill="#FACC15">⚡</text>
          {/* 피복 벗겨진 구리선 */}
          <path d="M 108,40 L 128,34 M 108,45 L 130,45 M 108,50 L 128,56" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          {/* 스파크 */}
          <path d="M 134,22 L 146,38 L 138,40 L 156,62" fill="none" stroke="#FEF08A" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 134,22 L 146,38 L 138,40 L 156,62" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="140" cy="45" r="11" fill="#FDE047" opacity="0.35" />
          <path d="M 150,28 l 10,-6 M 154,46 l 12,0 M 148,64 l 8,8" stroke="#FDE047" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'giant_duct_tape':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 당겨 뽑은 테이프 띠 */}
          <path d="M 70,72 L 158,58 L 162,74 L 74,86 Z" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2.5" />
          <path d="M 158,58 l 4,4 l -3,4 l 4,4 l -1,4" fill="none" stroke="#1E3A8A" strokeWidth="2" />
          <line x1="86" y1="77" x2="148" y2="67" stroke="#93C5FD" strokeWidth="2" opacity="0.7" />
          {/* 테이프 롤 */}
          <circle cx="54" cy="45" r="38" fill="#2563EB" stroke="#1E3A8A" strokeWidth="3.5" />
          <circle cx="54" cy="45" r="30" fill="none" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
          <circle cx="54" cy="45" r="22" fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.5" />
          <circle cx="54" cy="45" r="16" fill="#D6B48A" stroke="#7C4A1E" strokeWidth="3" />
          <circle cx="54" cy="45" r="10" fill="#FFF5E4" stroke="#7C4A1E" strokeWidth="2" />
          <path d="M 30,26 Q 40,16 56,14" fill="none" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        </svg>
      );

    case 'iron_zipper':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 지퍼 천 */}
          <rect x="6" y="30" width="118" height="30" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
          {/* 지퍼 이빨 */}
          <line x1="12" y1="45" x2="112" y2="45" stroke="#E2E8F0" strokeWidth="9" strokeDasharray="5 3" />
          <line x1="12" y1="45" x2="112" y2="45" stroke="#94A3B8" strokeWidth="1.5" />
          {/* 슬라이더 */}
          <path d="M 104,34 L 124,38 L 124,52 L 104,56 Z" fill="#CBD5E1" stroke="#334155" strokeWidth="2.5" />
          <rect x="122" y="41" width="10" height="8" rx="2" fill="#94A3B8" stroke="#334155" strokeWidth="2" />
          {/* 황금 자물쇠 */}
          <path d="M 136,44 L 136,30 A 12,12 0 0 1 160,30 L 160,44" fill="none" stroke="#64748B" strokeWidth="6" />
          <rect x="128" y="42" width="40" height="34" rx="7" fill="#FBBF24" stroke="#92400E" strokeWidth="3" />
          <rect x="131" y="45" width="34" height="6" rx="3" fill="#FDE68A" opacity="0.8" />
          <circle cx="148" cy="58" r="5" fill="#78350F" />
          <rect x="146" y="60" width="4" height="10" rx="1.5" fill="#78350F" />
        </svg>
      );

    case 'rotten_tomato':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 케이크 조각 */}
          <path d="M 8,74 L 70,74 L 70,42 L 8,58 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="2.5" />
          <path d="M 8,64 L 70,52" stroke="#F472B6" strokeWidth="4" />
          <path d="M 4,58 Q 12,48 22,54 Q 32,44 42,50 Q 54,38 66,42 Q 74,38 74,44 L 70,46 L 8,60 Z" fill="#FFFFFF" stroke="#D6D3D1" strokeWidth="2" />
          <circle cx="56" cy="36" r="7" fill="#DC2626" stroke="#7F1D1D" strokeWidth="2" />
          <path d="M 56,29 q 3,-6 8,-6" fill="none" stroke="#15803D" strokeWidth="2" strokeLinecap="round" />
          {/* 물컹한 토마토 */}
          <ellipse cx="120" cy="50" rx="38" ry="32" fill="#EF4444" stroke="#7F1D1D" strokeWidth="3.5" />
          <path d="M 96,40 Q 104,28 118,26" fill="none" stroke="#FCA5A5" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path d="M 134,60 q 6,10 2,18" fill="none" stroke="#B91C1C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="137" cy="80" r="3.5" fill="#B91C1C" />
          <path d="M 120,20 L 110,12 M 120,20 L 128,10 M 120,20 L 134,20 M 120,20 L 106,22" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <circle cx="120" cy="20" r="4" fill="#15803D" />
        </svg>
      );

    case 'mud_ink_bomb':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 바닥 오물 웅덩이 */}
          <path d="M 70,80 Q 80,70 96,76 Q 110,68 124,76 Q 142,70 150,80 Z" fill="#422006" opacity="0.8" />
          {/* 심지 */}
          <path d="M 40,22 Q 28,12 16,18" fill="none" stroke="#A16207" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 2" />
          <circle cx="14" cy="18" r="5" fill="#F97316" />
          <circle cx="14" cy="18" r="2.5" fill="#FEF08A" />
          <rect x="38" y="20" width="14" height="10" rx="2" fill="#57534E" stroke="#1C1917" strokeWidth="2" />
          {/* 먹물 풍선 폭탄 */}
          <circle cx="90" cy="44" r="36" fill="#18181B" stroke="#000000" strokeWidth="3" />
          <path d="M 54,44 Q 62,48 66,62 Q 70,72 74,62 Q 80,50 90,56 Q 96,76 102,60 Q 110,48 120,58 Q 124,68 126,50" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <path d="M 68,24 Q 78,14 92,12" fill="none" stroke="#71717A" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          {/* 튀는 방울 */}
          <circle cx="136" cy="30" r="6" fill="#18181B" />
          <circle cx="150" cy="44" r="4" fill="#78350F" />
          <circle cx="144" cy="18" r="3" fill="#18181B" />
          <circle cx="158" cy="30" r="2.5" fill="#78350F" />
        </svg>
      );

    case 'ceramic_plate':
      return (
        <svg viewBox="0 0 170 90" className={className}>
          {/* 접시 */}
          <ellipse cx="62" cy="54" rx="56" ry="26" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />
          <ellipse cx="62" cy="52" rx="38" ry="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <ellipse cx="62" cy="54" rx="48" ry="21" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="6 4" />
          <path d="M 50,50 q 6,-6 12,0 q 6,6 12,0" fill="none" stroke="#2563EB" strokeWidth="2" />
          {/* 금 간 자국 */}
          <path d="M 96,42 L 88,52 L 96,56 L 90,66" fill="none" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
          {/* 찻잔 */}
          <path d="M 116,26 L 160,26 L 154,58 Q 138,66 122,58 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="3" />
          <path d="M 158,32 Q 172,34 166,46 Q 162,52 154,50" fill="none" stroke="#94A3B8" strokeWidth="4" />
          <ellipse cx="138" cy="26" rx="22" ry="5" fill="#A16207" stroke="#94A3B8" strokeWidth="2" />
          <path d="M 120,38 L 156,38" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="5 3" />
          <ellipse cx="138" cy="64" rx="26" ry="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          {/* 튀는 파편 */}
          <path d="M 120,78 l 8,-4 l 2,6 Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.5" />
          <path d="M 150,80 l 6,-6 l 4,5 Z" fill="#DBEAFE" stroke="#64748B" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 160 90" className={className}>
          <rect x="12" y="40" width="56" height="10" rx="5" fill="#334155" stroke="#090D16" strokeWidth="2.5" />
          <ellipse cx="106" cy="45" rx="40" ry="32" fill="#1E293B" stroke="#090D16" strokeWidth="3.5" />
          <ellipse cx="106" cy="45" rx="30" ry="23" fill="#334155" stroke="#475569" strokeWidth="2" />
        </svg>
      );
  }
};

export const DummySandbox: React.FC<DummySandboxProps> = ({
  stats,
  setStats,
  lang,
  onToggleLang,
  isMuted,
  onToggleMute,
  isRotatedLandscape,
  rotationDeg,
  isForcedLandscape,
  isPortraitLayout,
  onToggleRotateLock,
  onOpenPaperModal,
}) => {
  const [dummyStyle, setDummyStyle] = useState<DummyStyle>('bear');
  const [targetName, setTargetName] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameClearedNotice, setNameClearedNotice] = useState<boolean>(false);

  const [isWeaponBinderOpen, setIsWeaponBinderOpen] = useState<boolean>(false);
  const [binderTab, setBinderTab] = useState<BinderTab>('all');

  const [isTankMode, setIsTankMode] = useState<boolean>(false);
  const [waterLevel, setWaterLevel] = useState<number>(52);
  const [isPouringWater, setIsPouringWater] = useState<boolean>(false);
  const [isChainedHanging, setIsChainedHanging] = useState<boolean>(false);
  const [isBoilingFire, setIsBoilingFire] = useState<boolean>(false);

  const [wireTip, setWireTip] = useState<{ x: number; y: number }>({ x: 58, y: 42 });
  const [isDraggingWire, setIsDraggingWire] = useState<boolean>(false);

  const [isElectrocuted, setIsElectrocuted] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [mouthSeal, setMouthSeal] = useState<MouthSealType>('none');

  const [selectedWeapon, setSelectedWeapon] = useState<WeaponItem>(WEAPONS[0]);
  // Side-mounted weapon position: 'right' (default, 88% X, 54% Y) or 'left' (12% X, 54% Y)
  const [weaponSide, setWeaponSide] = useState<'right' | 'left'>('right');
  const [damageMarks, setDamageMarks] = useState<DamageMark[]>([]);
  const [rageGauge, setRageGauge] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [dummyDamagePercent, setDummyDamagePercent] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingPopText[]>([]);
  const [shakeClass, setShakeClass] = useState<string>('');
  const [isUltimateActive, setIsUltimateActive] = useState<boolean>(false);
  const [shoutInput, setShoutInput] = useState<string>('');
  const [showShoutBar, setShowShoutBar] = useState<boolean>(false);

  const [aimCoords, setAimCoords] = useState<{ x: number; y: number }>({ x: 48, y: 52 });
  const [isFiringRecoil, setIsFiringRecoil] = useState<boolean>(false);

  const [dummyView, setDummyView] = useState<{
    x: number;
    y: number;
    rot: number;
    scaleX: number;
    scaleY: number;
    walkPhase: number;
    facingDir: 1 | -1;
    isPanicking: boolean;
  }>({
    x: 48,
    y: 62,
    rot: 0,
    scaleX: 1,
    scaleY: 1,
    walkPhase: 0,
    facingDir: 1,
    isPanicking: false,
  });

  // 토마토 & 케이크 투척: 번갈아 던지기 + 날아가는 투사체
  const throwToggleRef = useRef<boolean>(false);
  const [thrownItems, setThrownItems] = useState<
    { id: string; kind: 'tomato' | 'cake'; fx: number; fy: number; tx: number; ty: number }[]
  >([]);

  const [weaponSwing, setWeaponSwing] = useState<{
    active: boolean;
    x: number;
    y: number;
    id: number;
  }>({ active: false, x: 50, y: 50, id: 0 });

  const isKo = lang === 'ko';
  const quickShouts = isKo ? QUICK_SHOUTS_KO : QUICK_SHOUTS_EN;

  const arenaRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<CanvasParticle[]>([]);
  const shockwavesRef = useRef<ShockwaveRing[]>([]);
  const lightningBoltsRef = useRef<LightningBolt[]>([]);
  const bulletTracersRef = useRef<BulletTracer[]>([]);
  const comboTimerRef = useRef<number | null>(null);
  const electroTimerRef = useRef<number | null>(null);
  const freezeTimerRef = useRef<number | null>(null);
  const autoFireIntervalRef = useRef<number | null>(null);
  const cursorPosRef = useRef<{ x: number; y: number }>({ x: 48, y: 52 });

  const isTankModeRef = useRef<boolean>(isTankMode);
  const isChainedRef = useRef<boolean>(isChainedHanging);
  const waterLevelRef = useRef<number>(waterLevel);
  const weaponSideRef = useRef<'right' | 'left'>(weaponSide);
  const portraitLayoutRef = useRef<boolean>(isPortraitLayout);
  useEffect(() => {
    portraitLayoutRef.current = isPortraitLayout;
  }, [isPortraitLayout]);

  useEffect(() => {
    weaponSideRef.current = weaponSide;
  }, [weaponSide]);

  useEffect(() => {
    isTankModeRef.current = isTankMode;
    if (isTankMode) {
      physRef.current.x = 46;
      physRef.current.y = 58;
      physRef.current.vx = 0;
      physRef.current.vy = 0;
    }
  }, [isTankMode]);

  useEffect(() => {
    isChainedRef.current = isChainedHanging;
  }, [isChainedHanging]);

  useEffect(() => {
    waterLevelRef.current = waterLevel;
  }, [waterLevel]);

  const physRef = useRef<DummyPhysicsState>({
    x: 48,
    y: 62,
    vx: 0.45,
    vy: 0,
    rot: 0,
    vRot: 0,
    scaleX: 1,
    scaleY: 1,
    targetX: 65,
    nextDecisionTime: 0,
    nextJumpTime: 1200,
    panicUntil: 0,
    frozenUntil: 0,
    walkPhase: 0,
    facingDir: 1,
  });

  useEffect(() => {
    return () => {
      setTargetName('');
      if (autoFireIntervalRef.current) {
        window.clearInterval(autoFireIntervalRef.current);
      }
    };
  }, []);

  const getStagePctCoords = useCallback(
    (clientX: number, clientY: number): { pctX: number; pctY: number } => {
      const arena = arenaRef.current;
      if (!arena) return { pctX: 50, pctY: 50 };
      const rect = arena.getBoundingClientRect();

      if (isRotatedLandscape) {
        // 90°: 위쪽이 왼쪽으로 / -90°: 위쪽이 오른쪽으로 눕힌 휴대폰
        const pctX =
          rotationDeg === -90
            ? ((rect.bottom - clientY) / rect.height) * 100
            : ((clientY - rect.top) / rect.height) * 100;
        const pctY =
          rotationDeg === -90
            ? ((clientX - rect.left) / rect.width) * 100
            : ((rect.right - clientX) / rect.width) * 100;
        return {
          pctX: Math.max(2, Math.min(98, pctX)),
          pctY: Math.max(2, Math.min(98, pctY)),
        };
      } else {
        const pctX = ((clientX - rect.left) / rect.width) * 100;
        const pctY = ((clientY - rect.top) / rect.height) * 100;
        return {
          pctX: Math.max(2, Math.min(98, pctX)),
          pctY: Math.max(2, Math.min(98, pctY)),
        };
      }
    },
    [isRotatedLandscape, rotationDeg]
  );

  const triggerShake = useCallback((heavy: boolean) => {
    setShakeClass('');
    requestAnimationFrame(() => {
      setShakeClass(heavy ? 'animate-shake-heavy' : 'animate-shake-light');
    });
  }, []);

  // Spawn bullet tracer + ejecting brass shell casing from the SIDE-MOUNTED gun turret!
  const spawnBulletTracer = useCallback(
    (targetPctX: number, targetPctY: number, weapon: WeaponItem) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const side = weaponSideRef.current;
      const portrait = portraitLayoutRef.current;
      const startX = canvas.width * (portrait ? 0.5 : side === 'right' ? 0.84 : 0.16);
      const startY = canvas.height * (portrait ? 0.76 : 0.52);
      const endX = (targetPctX / 100) * canvas.width;
      const endY = (targetPctY / 100) * canvas.height;

      // Eject spinning brass shell casing from the side gun!
      particlesRef.current.push({
        x: startX,
        y: startY - 8,
        vx: (side === 'right' ? 1 : -1) * (2.5 + Math.random() * 2.5),
        vy: -(4.5 + Math.random() * 3),
        size: 7,
        color: '#FBBF24',
        rotation: Math.random() * Math.PI,
        vRot: 0.45,
        alpha: 1,
        shape: 'shell_casing',
        gravity: 0.42,
      });

      if (weapon.specialEffect === 'shotgun_spread') {
        for (let i = -2; i <= 2; i++) {
          bulletTracersRef.current.push({
            x1: startX,
            y1: startY,
            x2: endX + (Math.random() - 0.5) * 20,
            y2: endY + i * 22 + (Math.random() - 0.5) * 15,
            color: '#FBBF24',
            alpha: 0.95,
            width: 3,
          });
        }
      } else {
        bulletTracersRef.current.push({
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          color:
            weapon.specialEffect === 'freeze_ray'
              ? '#38BDF8'
              : weapon.specialEffect === 'bazooka_blast'
              ? '#EF4444'
              : '#FDE047',
          alpha: 1,
          width: weapon.specialEffect === 'bazooka_blast' ? 7 : 3.5,
        });
      }
    },
    []
  );

  const spawnLightningArcs = useCallback(
    (originPctX: number, originPctY: number, targetPctX: number, targetPctY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ox = (originPctX / 100) * canvas.width;
      const oy = (originPctY / 100) * canvas.height;
      const tx = (targetPctX / 100) * canvas.width;
      const ty = (targetPctY / 100) * canvas.height;

      const targets = [
        { x: tx, y: ty },
        { x: tx - 70, y: ty + 30 },
        { x: tx + 75, y: ty + 20 },
        { x: ox - 50, y: oy + 40 },
        { x: ox + 45, y: oy + 35 },
      ];

      targets.forEach((targ, idx) => {
        const segments = 7;
        const pts: { x: number; y: number }[] = [{ x: ox, y: oy }];
        for (let s = 1; s < segments; s++) {
          const t = s / segments;
          const jitter = (Math.random() - 0.5) * 38;
          pts.push({
            x: ox + (targ.x - ox) * t + jitter,
            y: oy + (targ.y - oy) * t + jitter,
          });
        }
        pts.push({ x: targ.x, y: targ.y });

        lightningBoltsRef.current.push({
          points: pts,
          color: idx % 2 === 0 ? '#38BDF8' : '#FEF08A',
          alpha: 1,
          width: idx === 0 ? 4.5 : 3,
        });
      });
    },
    []
  );

  const spawnParticlesAtPct = useCallback(
    (pctX: number, pctY: number, weapon: WeaponItem, countMultiplier = 1) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const originX = (pctX / 100) * canvas.width;
      const originY = (pctY / 100) * canvas.height;

      shockwavesRef.current.push({
        x: originX,
        y: originY,
        radius: 12,
        maxRadius:
          weapon.specialEffect === 'bazooka_blast'
            ? 190
            : weapon.category === 'shatter' || weapon.category === 'special'
            ? 145
            : 85,
        color: weapon.particleColors[0] || '#38BDF8',
        alpha: 0.9,
      });

      const baseCount =
        weapon.specialEffect === 'bazooka_blast'
          ? 34
          : weapon.category === 'shatter'
          ? 24
          : 16;
      const total = Math.floor(baseCount * countMultiplier);

      for (let i = 0; i < total; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 12;
        const color =
          weapon.particleColors[Math.floor(Math.random() * weapon.particleColors.length)];
        particlesRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3.5,
          size: 4 + Math.random() * 8,
          color,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.35,
          alpha: 1,
          shape: weapon.particleShape,
          gravity: isTankModeRef.current ? 0.12 : 0.38,
        });
      }
    },
    []
  );

  const triggerTankElectrocution = useCallback(
    (wireX: number, wireY: number) => {
      soundEngine.play('electric_zap');
      setIsElectrocuted(true);
      triggerShake(true);

      const ph = physRef.current;
      spawnLightningArcs(wireX, wireY, ph.x, ph.y);
      spawnParticlesAtPct(wireX, wireY, WEAPONS[10], 1.2);

      ph.vx = (Math.random() - 0.5) * 2.2;
      ph.vy = -1.2;
      ph.panicUntil = performance.now() + 2600;

      setRageGauge((prev) => Math.min(100, prev + 16));
      setDummyDamagePercent((prev) => Math.min(100, prev + 9));
      setCombo((prev) => prev + 1);

      setFloatingTexts((prev) => [
        ...prev.slice(-7),
        {
          id: `${Date.now()}-${Math.random()}`,
          x: ph.x,
          y: Math.max(18, ph.y - 16),
          text: isKo ? '빠지직ㅡ!! 수중 감전!!' : 'ZZZZAP!! TANK SHOCK!!',
          subText: '-48 HP',
          color: '#38BDF8',
        },
      ]);

      setStats((prev) => ({
        ...prev,
        totalHits: prev.totalHits + 1,
        maxCombo: Math.max(prev.maxCombo, combo + 1),
      }));

      if (electroTimerRef.current) window.clearTimeout(electroTimerRef.current);
      electroTimerRef.current = window.setTimeout(() => {
        setIsElectrocuted(false);
      }, 550);
    },
    [combo, isKo, setStats, spawnLightningArcs, spawnParticlesAtPct, triggerShake]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = (now: number) => {
      if (
        canvas.parentElement &&
        (canvas.width !== canvas.parentElement.offsetWidth ||
          canvas.height !== canvas.parentElement.offsetHeight)
      ) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }

      const ph = physRef.current;
      const inTank = isTankModeRef.current;
      const chained = isChainedRef.current;

      const LEFT_WALL_X = inTank ? 36 : 20;
      const RIGHT_WALL_X = inTank ? 56 : 76;
      const FLOOR_Y = inTank ? (chained ? 42 : 62) : 64;
      const CEILING_Y = inTank ? 28 : 20;

      const isPanicking = now < ph.panicUntil;
      const frozenActive = now < ph.frozenUntil;
      const isAirborne = ph.y < FLOOR_Y - 1.2 || Math.abs(ph.vy) > 0.22;

      if (inTank && waterLevelRef.current > 10 && Math.random() < 0.25) {
        particlesRef.current.push({
          x: (0.33 + Math.random() * 0.34) * canvas.width,
          y: 0.78 * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -(1.2 + Math.random() * 1.8),
          size: 4 + Math.random() * 6,
          color: 'rgba(224, 242, 254, 0.8)',
          rotation: 0,
          vRot: 0,
          alpha: 0.85,
          shape: 'bubble',
          gravity: -0.02,
        });
      }

      if (frozenActive) {
        ph.vx *= 0.65;
        ph.vy = ph.y < FLOOR_Y ? ph.vy + 0.18 : 0;
        if (ph.y > FLOOR_Y) ph.y = FLOOR_Y;
        ph.rot *= 0.8;
      } else if (chained && inTank) {
        ph.x += (47 - ph.x) * 0.15;
        ph.y += (39 - ph.y) * 0.15;
        ph.rot = Math.sin(now * 0.008) * 5;
        ph.walkPhase += 0.25;
      } else if (!isAirborne) {
        if (now > ph.nextDecisionTime) {
          let nextTarget =
            LEFT_WALL_X + 2 + Math.random() * (RIGHT_WALL_X - LEFT_WALL_X - 4);
          if (!inTank && Math.abs(nextTarget - ph.x) < 16) {
            nextTarget =
              ph.x < 48 ? 60 + Math.random() * 14 : 22 + Math.random() * 14;
          }
          if (!inTank && Math.abs(cursorPosRef.current.x - nextTarget) < 14) {
            nextTarget =
              cursorPosRef.current.x > 48
                ? 22 + Math.random() * 15
                : 58 + Math.random() * 15;
          }
          ph.targetX = nextTarget;
          ph.nextDecisionTime =
            now + (inTank ? 800 : isPanicking ? 260 : 520) + Math.random() * 450;
        }

        if (!inTank && now > ph.nextJumpTime) {
          ph.vy = -(1.85 + Math.random() * 1.15);
          ph.vx = (Math.random() > 0.5 ? 1 : -1) * (0.75 + Math.random() * 0.55);
          ph.scaleX = 0.88;
          ph.scaleY = 1.16;
          ph.nextJumpTime =
            now + (isPanicking ? 650 : 1250) + Math.random() * 950;
        }

        const dir = ph.targetX > ph.x ? 1 : -1;
        const desiredSpeed = inTank
          ? isPanicking
            ? 0.28
            : 0.14
          : isPanicking
          ? 0.85
          : 0.5;

        if (Math.abs(ph.targetX - ph.x) > 1.5) {
          ph.vx += (dir * desiredSpeed - ph.vx) * 0.16;
          ph.facingDir = dir;
          ph.walkPhase += isPanicking ? 0.45 : 0.26;
        } else {
          ph.vx *= 0.82;
        }

        ph.rot *= 0.78;
        ph.vRot *= 0.7;
      } else {
        ph.vy += inTank ? 0.09 : 0.14;
        ph.vx *= 0.988;
        ph.rot += ph.vRot;
      }

      ph.x += ph.vx;
      ph.y += ph.vy;

      if (ph.x <= LEFT_WALL_X) {
        ph.x = LEFT_WALL_X;
        ph.vx = Math.abs(ph.vx) * 0.82;
        ph.facingDir = 1;
        ph.targetX = RIGHT_WALL_X - 8;
      } else if (ph.x >= RIGHT_WALL_X) {
        ph.x = RIGHT_WALL_X;
        ph.vx = -Math.abs(ph.vx) * 0.82;
        ph.facingDir = -1;
        ph.targetX = LEFT_WALL_X + 8;
      }

      if (ph.y <= CEILING_Y) {
        ph.y = CEILING_Y;
        ph.vy = Math.abs(ph.vy) * 0.65;
      }

      if (ph.y >= FLOOR_Y) {
        ph.y = FLOOR_Y;
        if (ph.vy > 0.7) {
          ph.vy = -ph.vy * 0.45;
          ph.vx *= 0.85;
        } else {
          ph.vy = 0;
        }
      }

      ph.scaleX += (1 - ph.scaleX) * 0.22;
      ph.scaleY += (1 - ph.scaleY) * 0.22;

      setDummyView({
        x: ph.x,
        y: ph.y,
        rot: ph.rot,
        scaleX: ph.scaleX,
        scaleY: ph.scaleY,
        walkPhase: ph.walkPhase,
        facingDir: ph.facingDir,
        isPanicking,
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = bulletTracersRef.current.length - 1; i >= 0; i--) {
        const tr = bulletTracersRef.current[i];
        tr.alpha -= 0.15;
        if (tr.alpha <= 0) {
          bulletTracersRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tr.x1, tr.y1);
        ctx.lineTo(tr.x2, tr.y2);
        ctx.strokeStyle = tr.color;
        ctx.lineWidth = tr.width;
        ctx.shadowColor = tr.color;
        ctx.shadowBlur = 14;
        ctx.globalAlpha = Math.max(0, tr.alpha);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = lightningBoltsRef.current.length - 1; i >= 0; i--) {
        const bolt = lightningBoltsRef.current[i];
        bolt.alpha -= 0.06;
        if (bolt.alpha <= 0) {
          lightningBoltsRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        bolt.points.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.shadowColor = '#38BDF8';
        ctx.shadowBlur = 16;
        ctx.globalAlpha = Math.max(0, bolt.alpha);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.22;
        sw.alpha -= 0.045;
        if (sw.alpha <= 0) {
          shockwavesRef.current.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vRot;
        p.alpha -= p.shape === 'bubble' ? 0.01 : 0.018;

        if (p.alpha <= 0 || p.y < -20 || p.y > canvas.height + 20) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        if (p.shape === 'shell_casing') {
          // Brass bullet shell casing
          ctx.fillStyle = '#FBBF24';
          ctx.strokeStyle = '#92400E';
          ctx.lineWidth = 1;
          ctx.fillRect(-5, -2, 10, 4);
          ctx.strokeRect(-5, -2, 10, 4);
        } else if (p.shape === 'bubble') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (p.shape === 'shard' || p.shape === 'ceramic') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.85, p.size * 0.7);
          ctx.lineTo(-p.size * 0.9, p.size * 0.4);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'cotton') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const triggerNameClearedToast = () => {
    setNameClearedNotice(true);
    setTimeout(() => {
      setNameClearedNotice(false);
    }, 2600);
  };

  const handleClickWaterPipe = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.play('water_splash');
    setIsPouringWater(true);
    setWaterLevel((prev) => (prev >= 78 ? 35 : Math.min(82, prev + 26)));
    setTimeout(() => {
      setIsPouringWater(false);
    }, 950);
  };

  const handleClickRedLever = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextChained = !isChainedHanging;
    setIsChainedHanging(nextChained);
    soundEngine.play('metal_pan');
    setFloatingTexts((prev) => [
      ...prev.slice(-7),
      {
        id: `${Date.now()}`,
        x: physRef.current.x,
        y: physRef.current.y - 16,
        text: nextChained
          ? isKo
            ? '⛓️ 양손 사슬 수갑 구속!!'
            : '⛓️ CHAINED UP!!'
          : isKo
          ? '💦 수조 물속으로 투하!!'
          : '💦 DUNKED IN WATER!!',
        color: '#FBBF24',
      },
    ]);
  };

  const handleClickFireButton = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBoilingFire(true);
    soundEngine.playDestructionSound('fire', 1800);
    triggerShake(true);
    setRageGauge((prev) => Math.min(100, prev + 18));
    setDummyDamagePercent((prev) => Math.min(100, prev + 12));
    setStats((prev) => ({
      ...prev,
      totalHits: prev.totalHits + 1,
    }));
    setFloatingTexts((prev) => [
      ...prev.slice(-7),
      {
        id: `${Date.now()}`,
        x: physRef.current.x,
        y: physRef.current.y - 16,
        text: isKo ? '🔥 부글부글!! 수조 가열 폭파!!' : '🔥 BOILING TANK BLAST!!',
        subText: '-50 HP',
        color: '#EF4444',
      },
    ]);
    setTimeout(() => {
      setIsBoilingFire(false);
    }, 1800);
  };

  const applyHitToDummy = useCallback(
    (hitPctX: number, hitPctY: number, customShoutText?: string) => {
      if (isUltimateActive) return;

      const ph = physRef.current;

      // 토마토 & 케이크: 던질 때마다 번갈아 가며 토마토 / 케이크
      let weapon = selectedWeapon;
      if (selectedWeapon.id === 'rotten_tomato' && !customShoutText) {
        throwToggleRef.current = !throwToggleRef.current;
        const kind: 'tomato' | 'cake' = throwToggleRef.current ? 'tomato' : 'cake';
        if (kind === 'cake') {
          weapon = {
            ...selectedWeapon,
            hitWords: ['생크림 범벅!!', '케이크 철퍽!!', '달콤한 복수!!', '크림 폭탄!!'],
            hitWordsEn: ['CAKE IN FACE!!', 'CREAMED!!', 'SWEET REVENGE!!', 'PIE BOMB!!'],
            particleColors: ['#FFFBEB', '#FBCFE8', '#FDE68A', '#F472B6'],
            markType: 'cream',
          };
        }
        const id = `${Date.now()}-${Math.random()}`;
        setThrownItems((prev) => [
          ...prev.slice(-5),
          {
            id,
            kind,
            fx: portraitLayoutRef.current ? 50 : weaponSide === 'right' ? 88 : 12,
            fy: portraitLayoutRef.current ? 80 : 54,
            tx: hitPctX,
            ty: hitPctY,
          },
        ]);
        window.setTimeout(() => {
          setThrownItems((prev) => prev.filter((t) => t.id !== id));
        }, 420);
      }

      setIsFiringRecoil(true);
      setTimeout(() => setIsFiringRecoil(false), 90);

      if (
        weapon.specialEffect === 'flood_electrocute' ||
        weapon.specialEffect === 'electrocute'
      ) {
        if (isTankModeRef.current) {
          setWireTip({ x: 54, y: 58 });
          triggerTankElectrocution(54, 58);
          setTimeout(() => setWireTip({ x: 58, y: 42 }), 500);
          return;
        } else {
          soundEngine.play('electric_zap');
          setIsElectrocuted(true);
          spawnLightningArcs(hitPctX, hitPctY, ph.x, ph.y);
          if (electroTimerRef.current) window.clearTimeout(electroTimerRef.current);
          electroTimerRef.current = window.setTimeout(() => {
            setIsElectrocuted(false);
          }, 500);
        }
      }

      if (weapon.category === 'firearms' && !customShoutText) {
        spawnBulletTracer(hitPctX, hitPctY, weapon);
      }

      if (!isTankModeRef.current && !customShoutText) {
        const dx = Math.abs(hitPctX - ph.x);
        const dy = Math.abs(hitPctY - ph.y);
        const isWideBlast =
          weapon.specialEffect === 'shotgun_spread' ||
          weapon.specialEffect === 'bazooka_blast';
        const hitRadiusX = isWideBlast ? 20 : 12.5;
        const hitRadiusY = isWideBlast ? 26 : 19;

        if (dx > hitRadiusX || dy > hitRadiusY) {
          soundEngine.play(weapon.sound);
          spawnParticlesAtPct(hitPctX, hitPctY, weapon, 0.55);
          setWeaponSwing({
            active: true,
            x: hitPctX,
            y: hitPctY,
            id: Date.now() + Math.random(),
          });

          if (performance.now() >= ph.frozenUntil) {
            ph.vx = (ph.x > hitPctX ? 1 : -1) * 1.45;
            if (ph.y >= 60) {
              ph.vy = -2.1;
            }
            ph.panicUntil = performance.now() + 2200;
          }

          setFloatingTexts((prev) => [
            ...prev.slice(-7),
            {
              id: `${Date.now()}-${Math.random()}`,
              x: hitPctX,
              y: Math.max(15, hitPctY - 6),
              text: isKo ? '휙! (도망침! 조준해서 쏘세요!)' : 'MISS! (Aim at target!)',
              color: '#FDE68A',
            },
          ]);
          return;
        }
      }

      if (weapon.specialEffect === 'seal_tape') {
        setMouthSeal('duct_tape');
        soundEngine.play('tape_seal');
      } else if (weapon.specialEffect === 'seal_zipper') {
        setMouthSeal('zipper');
        soundEngine.play('zipper_lock');
      } else if (weapon.specialEffect === 'freeze_ray') {
        soundEngine.play('freeze_blast');
        ph.frozenUntil = performance.now() + 3200;
        setIsFrozen(true);
        if (freezeTimerRef.current) window.clearTimeout(freezeTimerRef.current);
        freezeTimerRef.current = window.setTimeout(() => {
          setIsFrozen(false);
        }, 3200);
      } else if (customShoutText) {
        soundEngine.play('shout_slam');
        soundEngine.play('shatter_ceramic');
      } else {
        soundEngine.play(weapon.sound);
      }

      spawnParticlesAtPct(
        ph.x,
        ph.y - 4,
        weapon,
        customShoutText ? 1.6 : 1.15
      );
      triggerShake(weapon.damage >= 25 || Boolean(customShoutText));

      setWeaponSwing({
        active: true,
        x: ph.x,
        y: ph.y - 4,
        id: Date.now() + Math.random(),
      });

      const offsetFromCenter = hitPctX - ph.x;
      const launchDir =
        Math.abs(offsetFromCenter) > 1.5
          ? offsetFromCenter > 0
            ? -1
            : 1
          : weaponSideRef.current === 'right'
          ? -1
          : 1;

      if (weapon.specialEffect === 'freeze_ray') {
        ph.vx = 0;
        ph.vy = 0;
      } else {
        const knockbackMult =
          weapon.specialEffect === 'bazooka_blast'
            ? 4.2
            : weapon.specialEffect === 'shotgun_spread'
            ? 3.4
            : isTankModeRef.current
            ? 1.4
            : 2.5;
        ph.vx = launchDir * knockbackMult;
        ph.vy = -(weapon.specialEffect === 'bazooka_blast'
          ? 3.8
          : isTankModeRef.current
          ? 1.5
          : 2.3);
        ph.vRot = launchDir * 14;
      }

      ph.scaleX = 1.25;
      ph.scaleY = 0.75;
      ph.panicUntil = performance.now() + 4000;

      const newMark: DamageMark = {
        id: `${Date.now()}-${Math.random()}`,
        x: 24 + Math.random() * 52,
        y: 18 + Math.random() * 62,
        rotation: Math.random() * 360,
        scale: 0.85 + Math.random() * 0.4,
        type: customShoutText ? 'crack' : weapon.markType,
      };
      setDamageMarks((prev) => [...prev.slice(-28), newMark]);

      const newCombo = combo + 1;
      setCombo(newCombo);
      if (comboTimerRef.current) window.clearTimeout(comboTimerRef.current);
      comboTimerRef.current = window.setTimeout(() => {
        setCombo(0);
      }, 2800);

      setRageGauge((prev) =>
        Math.min(100, prev + (customShoutText ? 22 : weapon.rageGain))
      );
      setDummyDamagePercent((prev) =>
        Math.min(100, prev + Math.ceil(weapon.damage / 4))
      );

      const wordsPool = isKo ? weapon.hitWords : weapon.hitWordsEn;
      const randomWord =
        mouthSeal !== 'none' && Math.random() < 0.45
          ? isKo
            ? '읍읍!! 므읍!! (입봉쇄됨)'
            : 'MMPHH!! (GAGGED!)'
          : wordsPool[Math.floor(Math.random() * wordsPool.length)];

      setFloatingTexts((prev) => [
        ...prev.slice(-7),
        {
          id: `${Date.now()}-${Math.random()}`,
          x: ph.x,
          y: Math.max(14, ph.y - 14),
          text: customShoutText ? `"${customShoutText}"` : randomWord,
          subText: `-${customShoutText ? 99 : weapon.damage} HP`,
          color: customShoutText
            ? '#F43F5E'
            : weapon.particleColors[0] || '#F97316',
          isShout: Boolean(customShoutText),
        },
      ]);

      setStats((prev) => ({
        ...prev,
        totalHits: prev.totalHits + 1,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        objectsShattered:
          weapon.category === 'shatter'
            ? prev.objectsShattered + 1
            : prev.objectsShattered,
        shoutsThrown: customShoutText ? prev.shoutsThrown + 1 : prev.shoutsThrown,
      }));
    },
    [
      combo,
      isKo,
      isUltimateActive,
      mouthSeal,
      selectedWeapon,
      setStats,
      spawnBulletTracer,
      spawnLightningArcs,
      spawnParticlesAtPct,
      triggerShake,
      triggerTankElectrocution,
      weaponSide,
    ]
  );

  const stopAutoFire = useCallback(() => {
    if (autoFireIntervalRef.current) {
      window.clearInterval(autoFireIntervalRef.current);
      autoFireIntervalRef.current = null;
    }
  }, []);

  const handlePointerDownArena = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isUltimateActive || isDraggingWire || isWeaponBinderOpen) return;
    const { pctX, pctY } = getStagePctCoords(e.clientX, e.clientY);
    cursorPosRef.current = { x: pctX, y: pctY };
    setAimCoords({ x: pctX, y: pctY });

    applyHitToDummy(pctX, pctY);

    if (selectedWeapon.specialEffect === 'auto_fire') {
      stopAutoFire();
      autoFireIntervalRef.current = window.setInterval(() => {
        applyHitToDummy(cursorPosRef.current.x, cursorPosRef.current.y);
      }, 105);
    }
  };

  const handlePointerMoveArena = (e: React.PointerEvent<HTMLDivElement>) => {
    const { pctX, pctY } = getStagePctCoords(e.clientX, e.clientY);
    cursorPosRef.current = { x: pctX, y: pctY };
    setAimCoords({ x: pctX, y: pctY });

    if (isDraggingWire) {
      const clampedX = Math.max(25, Math.min(82, pctX));
      const clampedY = Math.max(18, Math.min(78, pctY));
      setWireTip({ x: clampedX, y: clampedY });

      if (
        isTankMode &&
        waterLevel > 10 &&
        clampedX >= 30 &&
        clampedX <= 68 &&
        clampedY >= 46 &&
        !isElectrocuted
      ) {
        triggerTankElectrocution(clampedX, clampedY);
      }
    }
  };

  const handlePointerUpArena = () => {
    stopAutoFire();
    if (isDraggingWire) {
      setIsDraggingWire(false);
    }
  };

  const handleShoutSubmit = (textToThrow?: string) => {
    const finalShout = (textToThrow ?? shoutInput).trim();
    if (!finalShout) return;
    applyHitToDummy(physRef.current.x, physRef.current.y, finalShout);
    if (!textToThrow) {
      setShoutInput('');
    }
    setShowShoutBar(false);
  };

  const handleCycleMouthSeal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mouthSeal === 'none') {
      setMouthSeal('duct_tape');
      soundEngine.play('tape_seal');
    } else if (mouthSeal === 'duct_tape') {
      setMouthSeal('zipper');
      soundEngine.play('zipper_lock');
    } else {
      setMouthSeal('none');
    }
  };

  const handleCycleDummyStyle = () => {
    setDummyStyle((prev) =>
      prev === 'bear' ? 'bunny' : prev === 'bunny' ? 'crash_dummy' : 'bear'
    );
    soundEngine.play('squeak_hammer');
  };

  const handleTriggerUltimate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (rageGauge < 100 || isUltimateActive) return;
    stopAutoFire();
    setIsUltimateActive(true);
    setIsWeaponBinderOpen(false);
    soundEngine.play('ultimate_blast');
    triggerTankElectrocution(52, 56);

    const hadName = Boolean(targetName.trim());

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const ph = physRef.current;
        ph.vx = (i % 2 === 0 ? 1 : -1) * 4.5;
        ph.vy = -3.2;
        spawnLightningArcs(54, 48, ph.x, ph.y);
        spawnParticlesAtPct(ph.x, ph.y - 5, WEAPONS[4], 2.0);
        triggerShake(true);
      }, i * 140);
    }

    setStats((prev) => ({
      ...prev,
      totalHits: prev.totalHits + 12,
      ultimatesUnleashed: prev.ultimatesUnleashed + 1,
      objectsShattered: prev.objectsShattered + 6,
    }));

    setTimeout(() => {
      setRageGauge(0);
      setDummyDamagePercent(0);
      setDamageMarks([]);
      setTargetName('');
      setIsFrozen(false);
      physRef.current.frozenUntil = 0;
      if (hadName) {
        triggerNameClearedToast();
      }
      setIsUltimateActive(false);
    }, 1100);
  };

  const handleResetDummy = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    stopAutoFire();
    const hadName = Boolean(targetName.trim());
    setDamageMarks([]);
    setDummyDamagePercent(0);
    setCombo(0);
    setFloatingTexts([]);
    setTargetName('');
    setMouthSeal('none');
    setIsFrozen(false);
    physRef.current.frozenUntil = 0;
    setIsChainedHanging(false);
    setIsEditingName(false);
    if (hadName) {
      triggerNameClearedToast();
    }
    soundEngine.play('calm_chime');
  };

  const binderWeapons =
    binderTab === 'all'
      ? WEAPONS
      : binderTab === 'splat'
      ? WEAPONS.filter((w) => w.category === 'splat' || w.category === 'shatter')
      : WEAPONS.filter((w) => w.category === binderTab);

  const legSwing = Math.sin(dummyView.walkPhase) * 18;
  const electroJitterX = isElectrocuted ? (Math.random() - 0.5) * 16 : 0;
  const electroJitterY = isElectrocuted ? (Math.random() - 0.5) * 16 : 0;
  const baseDummyScale = isTankMode ? 1.0 : 0.62;

  // Calculate rotation angle for the SIDE-MOUNTED gun turret aiming horizontally at aimCoords!
  const mountX = isPortraitLayout ? 50 : weaponSide === 'right' ? 88 : 12;
  const mountY = isPortraitLayout ? 80 : 52;
  // 세로 배치: 화면 아래 가운데에서 조준점을 향해 회전 (화면 비율 반영)
  const roomGeo = roomGeometry(isPortraitLayout);
  const portraitAimDeg =
    Math.atan2(
      (aimCoords.y - mountY) * roomGeo.H,
      (aimCoords.x - mountX) * roomGeo.W
    ) *
    (180 / Math.PI);
  const portraitFlip = Math.abs(portraitAimDeg) > 90;
  const horizontalDist =
    weaponSide === 'right'
      ? Math.max(4, mountX - aimCoords.x)
      : Math.max(4, aimCoords.x - mountX);
  const sideTurretRotateDeg =
    Math.atan2(aimCoords.y - mountY, horizontalDist) * (180 / Math.PI);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* ============================================================
          UNDERGROUND CONCRETE STORAGE ROOM (B2)
         ============================================================ */}
      <div
        ref={arenaRef}
        onPointerDown={handlePointerDownArena}
        onPointerMove={handlePointerMoveArena}
        onPointerUp={handlePointerUpArena}
        onPointerCancel={handlePointerUpArena}
        onPointerLeave={handlePointerUpArena}
        className={`relative w-full h-full cursor-crosshair overflow-hidden ${shakeClass}`}
      >
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={isPortraitLayout ? '0 0 460 1000' : '0 0 1000 600'}
          preserveAspectRatio="none"
        >
          <BasementRoom portrait={isPortraitLayout} />

          {/* Faint Laser Sight Line from Side Gun Mount to Crosshair when using Firearms */}
          {!isTankMode && selectedWeapon.category === 'firearms' && (
            <line
              x1={(mountX / 100) * roomGeo.W}
              y1={(mountY / 100) * roomGeo.H}
              x2={(aimCoords.x / 100) * roomGeo.W}
              y2={(aimCoords.y / 100) * roomGeo.H}
              stroke="rgba(239, 68, 68, 0.35)"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          )}
        </svg>

        {/* 천장에 매달린 백열전구 (비율 고정, 살짝 흔들림) */}
        <svg
          className="absolute left-1/2 top-0 -translate-x-1/2 h-[19%] pointer-events-none z-[5]"
          viewBox="0 0 60 120"
          overflow="visible"
        >
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-4 30 0; 4 30 0; -4 30 0"
              dur="5s"
              repeatCount="indefinite"
            />
            <line x1="30" y1="0" x2="30" y2="78" stroke="#111315" strokeWidth="2.5" />
            <rect x="24" y="76" width="12" height="12" rx="2" fill="#3F3F46" stroke="#111315" strokeWidth="1.5" />
            <circle cx="30" cy="100" r="30" fill="#FDE68A" opacity="0.18" />
            <circle cx="30" cy="99" r="12" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
            <path d="M 26,96 q 4,6 8,0" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          </g>
        </svg>

        {/* ============================================================
            TOP HUD: GREEN KO BAR + LANGUAGE SWITCHER + NAME TAG + CONTROLS
           ============================================================ */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2.5 left-3 right-3 sm:top-3.5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-2 z-40 pointer-events-auto"
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setIsTankMode((prev) => !prev);
                setIsChainedHanging(false);
              }}
              className={`px-2.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1 border-2 shadow-lg transition-all cursor-pointer ${
                isTankMode
                  ? 'bg-sky-500 border-white text-white'
                  : 'bg-[#1C1E22]/90 border-[#52565C] text-sky-300 hover:bg-[#2A2D32]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>
                {isTankMode
                  ? isKo
                    ? '🌊 수조 닫기'
                    : '🌊 Close Tank'
                  : isKo
                  ? '🌊 유리수조'
                  : '🌊 Water Tank'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleCycleMouthSeal}
              className={`px-2.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1 border-2 shadow-lg transition-all cursor-pointer ${
                mouthSeal !== 'none'
                  ? 'bg-blue-600 border-white text-white'
                  : 'bg-[#1C1E22]/90 border-[#52565C] text-amber-200 hover:bg-[#2A2D32]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {mouthSeal === 'none'
                  ? isKo
                    ? '입봉쇄'
                    : 'Gag'
                  : mouthSeal === 'duct_tape'
                  ? isKo
                    ? '청테이프'
                    : 'Taped'
                  : isKo
                  ? '강철지퍼'
                  : 'Zipped'}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggleMute}
              className="p-2 rounded-2xl bg-[#1C1E22]/90 border-2 border-[#52565C] text-amber-200 shadow-lg cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={onToggleLang}
              className="px-2.5 py-1.5 rounded-2xl bg-[#1C1E22]/90 hover:bg-[#2A2D32] border-2 border-amber-400/80 text-xs font-black text-amber-200 flex items-center gap-1 shadow-lg cursor-pointer"
              title="한국어 / English 전환"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{isKo ? 'EN' : '한국어'}</span>
            </button>
          </div>

          {/* Center: Green KO Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex items-center bg-[#57534E] border-[3px] border-white rounded-full px-1.5 py-1 shadow-[0_4px_14px_rgba(0,0,0,0.6)] w-44 sm:w-60">
              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-lime-300 to-green-600 border-2 border-white shadow-md flex items-center justify-center shrink-0 z-10">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <div className="flex-1 h-3.5 bg-[#292524] rounded-full overflow-hidden -ml-2 pl-2 pr-8">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400 transition-all duration-150"
                  style={{ width: `${rageGauge}%` }}
                />
              </div>
              <button
                type="button"
                onClick={handleTriggerUltimate}
                className={`absolute -right-2 px-2.5 py-0.5 rounded-xl font-display font-black italic text-sm tracking-tighter border-2 border-white shadow-lg cursor-pointer ${
                  rageGauge >= 100
                    ? 'bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 text-white animate-bounce'
                    : 'bg-gradient-to-b from-amber-300 to-orange-500 text-white'
                }`}
              >
                KO {rageGauge >= 100 ? '⚡' : ''}
              </button>
            </div>

            {combo > 0 && (
              <div className="px-2.5 py-1 rounded-xl bg-orange-600 border-2 border-yellow-300 font-mono-num text-xs font-black text-white shadow-lg">
                {combo} HIT!
              </div>
            )}
          </div>

          {/* Right: Volatile Name Tag + Shout Input Toggle + Reset */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 bg-[#1C1E22]/90 border-2 border-[#52565C] px-2.5 py-1.5 rounded-2xl shadow-lg">
              <Tag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              {isEditingName ? (
                <input
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditingName(false);
                  }}
                  onBlur={() => setIsEditingName(false)}
                  autoFocus
                  maxLength={14}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={isKo ? '이름 입력(끝나면 소멸)' : 'Name (Auto-wiped)'}
                  className="w-28 bg-stone-900 border border-amber-400 rounded-lg px-2 py-0.5 text-xs text-white focus:outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-xs font-extrabold text-amber-200 hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {targetName.trim()
                    ? `${targetName}`
                    : isKo
                    ? '이름표 붙이기'
                    : 'Add Name Tag'}
                </button>
              )}

              {targetName.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setTargetName('');
                    triggerNameClearedToast();
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowShoutBar((prev) => !prev)}
              className="px-2.5 py-1.5 rounded-2xl bg-rose-700 hover:bg-rose-600 border-2 border-rose-300 text-xs font-extrabold text-white shadow-lg cursor-pointer"
            >
              {isKo ? '💬 욕·일갈 던지기' : '💬 Throw Shout'}
            </button>

            <button
              type="button"
              onClick={handleResetDummy}
              className="px-2.5 py-1.5 rounded-2xl bg-[#1C1E22]/90 hover:bg-stone-800 border-2 border-[#52565C] text-xs font-extrabold text-emerald-300 flex items-center gap-1 shadow-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isKo ? '끝내기·이름소멸' : 'End & Wipe'}
              </span>
            </button>
          </div>
        </div>

        {/* Universal Shout / Curse Bar when toggled */}
        {showShoutBar && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-[#16181B]/95 border-2 border-amber-500 p-3 rounded-2xl shadow-2xl flex flex-col gap-2 w-[92%] max-w-xl pointer-events-auto"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={shoutInput}
                onChange={(e) => setShoutInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleShoutSubmit();
                }}
                placeholder={
                  isKo
                    ? '직접 던질 욕이나 사이다 일갈을 입력하세요!'
                    : 'Type any curse or shout to slam onto the target!'
                }
                className="flex-1 bg-stone-900 border border-amber-500/60 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleShoutSubmit()}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isKo ? '투척' : 'Throw'}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {quickShouts.map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleShoutSubmit(phrase)}
                  className="px-2.5 py-1 text-xs font-bold bg-stone-800 hover:bg-rose-900 text-amber-200 border border-amber-500/30 rounded-lg cursor-pointer"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        )}

        {nameClearedNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-950/95 border border-emerald-500/60 text-emerald-200 text-xs font-semibold px-4 py-2 rounded-xl shadow-lg pointer-events-none whitespace-nowrap">
            {isKo
              ? '✓ 인형에 붙였던 이름표가 기록 없이 완전히 소멸되었습니다'
              : '✓ Target name tag has been permanently wiped without a trace'}
          </div>
        )}

        {/* ============================================================
            OVERHEAD 3 PIPES + DANGLING ELECTRIC WIRE (When Glass Tank Mode is ON)
           ============================================================ */}
        {isTankMode && (
          <>
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[440px] h-[24%] flex justify-between items-start px-6 z-20 pointer-events-auto"
            >
              <button
                type="button"
                onClick={handleClickWaterPipe}
                className="group relative flex flex-col items-center cursor-pointer focus:outline-none"
              >
                <div className="w-11 sm:w-13 h-20 sm:h-24 bg-gradient-to-r from-sky-500 via-cyan-300 to-sky-600 border-x-2 border-sky-800 shadow-inner" />
                <div className="w-14 sm:w-16 h-6 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 rounded-sm border-2 border-slate-700 shadow-md group-hover:scale-105 transition-transform" />
                <div className="w-16 sm:w-18 h-3.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 rounded-full border border-slate-800" />
                <span className="mt-1 px-2 py-0.5 rounded bg-sky-950/85 border border-sky-400/50 text-[10px] font-bold text-sky-200 whitespace-nowrap">
                  {isKo ? '💧 물 틀기' : '💧 Pour Water'}
                </span>

                {isPouringWater && (
                  <div className="absolute top-28 left-1/2 -translate-x-1/2 w-8 h-64 bg-gradient-to-b from-cyan-300/90 via-sky-400/80 to-cyan-200/40 rounded-full animate-pulse pointer-events-none z-10" />
                )}
              </button>

              <div className="flex flex-col items-center pointer-events-none">
                <div
                  className="w-11 sm:w-13 h-18 sm:h-22 border-x-2 border-slate-600"
                  style={{
                    background:
                      'repeating-linear-gradient(to bottom, #CBD5E1 0px, #94A3B8 5px, #64748B 10px)',
                  }}
                />
                <div className="w-14 sm:w-16 h-6 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 rounded-sm border-2 border-slate-700 shadow-md" />
                <div className="w-16 sm:w-18 h-3 bg-slate-800 rounded-full" />
              </div>

              <button
                type="button"
                onClick={handleClickWaterPipe}
                className="group relative flex flex-col items-center cursor-pointer"
              >
                <div className="w-11 sm:w-13 h-20 sm:h-24 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 border-x-2 border-black relative overflow-hidden">
                  <div className="absolute top-2 -left-2 right-0 bg-yellow-400 text-black text-[9px] font-black tracking-tighter px-2 py-0.5 -rotate-12 border-y border-black">
                    DANGER
                  </div>
                </div>
                <div className="w-14 sm:w-16 h-6 bg-gradient-to-r from-slate-500 via-slate-300 to-slate-600 rounded-sm border-2 border-slate-700 shadow-md" />
                <div className="w-16 sm:w-18 h-3.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 rounded-full border border-slate-800" />
              </button>
            </div>

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d={`M 68,0 C 72,18 ${wireTip.x + 8},${wireTip.y - 16} ${wireTip.x},${wireTip.y}`}
                fill="none"
                stroke="rgba(56, 189, 248, 0.45)"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d={`M 67.2,0 C 71,18 ${wireTip.x + 6},${wireTip.y - 16} ${wireTip.x - 0.7},${wireTip.y}`}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="0.9"
              />
              <path
                d={`M 68,0 C 72,18 ${wireTip.x + 7},${wireTip.y - 16} ${wireTip.x},${wireTip.y}`}
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.0"
              />
              <path
                d={`M 68.8,0 C 73,18 ${wireTip.x + 8},${wireTip.y - 16} ${wireTip.x + 0.7},${wireTip.y}`}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="0.85"
              />
            </svg>

            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsDraggingWire(true);
                triggerTankElectrocution(wireTip.x, wireTip.y);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setWireTip({ x: 53, y: 58 });
                triggerTankElectrocution(53, 58);
              }}
              style={{
                left: `${wireTip.x}%`,
                top: `${wireTip.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-40 cursor-grab active:cursor-grabbing pointer-events-auto group"
            >
              <div className="w-16 h-16 rounded-full border-4 border-white/80 bg-sky-400/25 flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(56,189,248,0.9)]">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-cyan-300/60 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-200 fill-yellow-300" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-3 bg-white text-slate-900 rounded-full p-1.5 border-2 border-slate-900 shadow-lg flex items-center gap-1">
                <Hand className="w-4 h-4 fill-white" />
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-cyan-200 text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap border border-cyan-400/40">
                {isKo ? '⚡전선 끌어서 물에 담그기' : '⚡Drag Wire into Water'}
              </div>
            </div>
          </>
        )}

        {/* ============================================================
            THE TARGET DUMMY (1. Bear | 2. Knit Bunny | 3. Crash Test Dummy)
           ============================================================ */}
        <div
          className="absolute w-44 h-60 sm:w-56 sm:h-72 flex items-center justify-center pointer-events-none z-20"
          style={{
            left: `${dummyView.x}%`,
            top: `${dummyView.y}%`,
            transform: `translate3d(calc(-50% + ${electroJitterX}px), calc(-50% + ${electroJitterY}px), 0) rotate(${
              dummyView.rot
            }deg) scale(${dummyView.scaleX * baseDummyScale}, ${
              dummyView.scaleY * baseDummyScale
            })`,
          }}
        >
          {isTankMode && isChainedHanging && (
            <>
              <div
                className="absolute -top-44 left-[18%] w-2.5 h-52 pointer-events-none"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, #94A3B8 0px, #475569 6px, #1E293B 12px)',
                }}
              />
              <div
                className="absolute -top-44 right-[18%] w-2.5 h-52 pointer-events-none"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, #94A3B8 0px, #475569 6px, #1E293B 12px)',
                }}
              />
            </>
          )}

          {isFrozen && (
            <div className="absolute -inset-4 rounded-3xl bg-sky-300/45 border-4 border-cyan-100/90 backdrop-blur-[1px] shadow-[0_0_30px_rgba(56,189,248,0.8)] z-35 flex items-start justify-end p-2">
              <Snowflake className="w-7 h-7 text-white animate-spin" />
            </div>
          )}

          {isElectrocuted && (
            <div className="absolute -inset-5 rounded-full bg-cyan-300/45 border-4 border-yellow-300 animate-ping" />
          )}

          {targetName.trim() && (
            <div
              className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 z-30 px-3 py-1 bg-[#FFFBEB] border-2 border-rose-700 rounded shadow-lg text-center max-w-[155px] truncate"
              style={{
                transform: `translate(-50%, -50%) rotate(${
                  dummyDamagePercent > 50 ? -9 : dummyDamagePercent > 20 ? 5 : -2
                }deg)`,
              }}
            >
              <div className="text-[9px] font-bold text-rose-700 leading-none mb-0.5">
                {isKo ? '타격 표적' : 'TARGET'}
              </div>
              <div className="text-sm font-extrabold text-slate-950 tracking-tight truncate">
                {targetName}
              </div>
            </div>
          )}

          <svg
            viewBox="0 0 240 310"
            overflow="visible"
            className="w-full h-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
          >
            {isElectrocuted ? (
              <g>
                <rect x="74" y="205" width="34" height="72" rx="17" fill="#082F49" stroke="#38BDF8" strokeWidth="4" />
                <rect x="132" y="205" width="34" height="72" rx="17" fill="#082F49" stroke="#38BDF8" strokeWidth="4" />
                <rect x="26" y="112" width="58" height="30" rx="15" fill="#082F49" stroke="#38BDF8" strokeWidth="4" />
                <rect x="156" y="112" width="58" height="30" rx="15" fill="#082F49" stroke="#38BDF8" strokeWidth="4" />
                <rect x="66" y="104" width="108" height="116" rx="38" fill="#082F49" stroke="#FEF08A" strokeWidth="4" />
                <ElectrocutedEars style={dummyStyle} />
                <circle cx="120" cy="66" r="48" fill="#082F49" stroke="#FEF08A" strokeWidth="4" />
                <g stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
                  <circle cx="120" cy="60" r="28" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="3" />
                  <circle cx="108" cy="56" r="7" fill="#090D16" stroke="none" />
                  <circle cx="132" cy="56" r="7" fill="#090D16" stroke="none" />
                  <line x1="108" y1="78" x2="132" y2="78" stroke="#090D16" strokeWidth="4" strokeDasharray="4 4" />
                  <line x1="120" y1="92" x2="120" y2="195" stroke="#FEF08A" strokeWidth="6" strokeDasharray="6 5" />
                  <path d="M92,120 Q120,130 148,120" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                  <path d="M88,142 Q120,152 152,142" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                  <path d="M94,164 Q120,174 146,164" fill="none" stroke="#FFFFFF" strokeWidth="5" />
                  <line x1="38" y1="126" x2="78" y2="126" />
                  <line x1="162" y1="126" x2="202" y2="126" />
                  <line x1="91" y1="210" x2="91" y2="266" />
                  <line x1="149" y1="210" x2="149" y2="266" />
                </g>
              </g>
            ) : dummyStyle === 'bear' ? (
              <BearFigure legSwing={legSwing} hanging={isChainedHanging} />
            ) : dummyStyle === 'bunny' ? (
              <BunnyFigure legSwing={legSwing} hanging={isChainedHanging} />
            ) : (
              <CrashDummyFigure legSwing={legSwing} hanging={isChainedHanging} />
            )}

            {!isElectrocuted && (
              <g>
                {mouthSeal === 'duct_tape' ? (
                  <g>
                    <rect
                      x="84"
                      y="70"
                      width="72"
                      height="18"
                      rx="3"
                      fill="#2563EB"
                      stroke="#1E3A8A"
                      strokeWidth="2.5"
                      transform="rotate(-14 120 79)"
                    />
                    <rect
                      x="84"
                      y="70"
                      width="72"
                      height="18"
                      rx="3"
                      fill="#3B82F6"
                      stroke="#1E3A8A"
                      strokeWidth="2.5"
                      transform="rotate(14 120 79)"
                    />
                  </g>
                ) : mouthSeal === 'zipper' ? (
                  <g>
                    <rect x="86" y="71" width="68" height="16" rx="4" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
                    <line x1="90" y1="79" x2="150" y2="79" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="4 4" />
                    <rect x="144" y="74" width="14" height="16" rx="3" fill="#FBBF24" stroke="#92400E" strokeWidth="2" />
                  </g>
                ) : (
                  <g>
                    <path
                      d="M 102,77 Q 120,69 138,77 Q 142,90 120,90 Q 98,90 102,77 Z"
                      fill="#7F1D1D"
                      stroke="#27272A"
                      strokeWidth="3"
                    />
                    <line
                      x1="107"
                      y1="77"
                      x2="133"
                      y2="77"
                      stroke="#F8FAFC"
                      strokeWidth="3.5"
                      strokeDasharray="5 2"
                    />
                  </g>
                )}
              </g>
            )}
          </svg>

          {damageMarks.map((mark) => (
            <div
              key={mark.id}
              className="absolute pointer-events-none"
              style={{
                left: `${mark.x}%`,
                top: `${mark.y}%`,
                transform: `translate(-50%, -50%) rotate(${mark.rotation}deg) scale(${mark.scale})`,
              }}
            >
              {mark.type === 'bullet_hole' && (
                <div className="w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-amber-400/80 shadow-inner" />
              )}
              {mark.type === 'laser_burn' && (
                <div className="w-6 h-2.5 rounded-full bg-rose-500 border border-white shadow-[0_0_8px_#F43F5E]" />
              )}
              {mark.type === 'ice_frost' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-200/75 border-2 border-white rotate-45" />
              )}
              {mark.type === 'burn_scorch' && (
                <div className="w-8 h-8 rounded-full bg-slate-950/75 border border-yellow-400/50" />
              )}
              {mark.type === 'bandaid' && (
                <div className="w-8 h-3 bg-amber-200 border border-amber-700 rounded-full" />
              )}
              {mark.type === 'bump' && (
                <div className="w-5 h-5 rounded-full bg-rose-500/85 border border-rose-800" />
              )}
              {mark.type === 'tomato' && (
                <div className="w-9 h-8 rounded-full bg-red-600/85" />
              )}
              {mark.type === 'cream' && (
                <div className="w-10 h-9 rounded-full bg-amber-50/95 border border-pink-300" />
              )}
              {mark.type === 'ink' && (
                <div className="w-10 h-10 rounded-full bg-slate-950/90" />
              )}
              {mark.type === 'mud' && (
                <div className="w-9 h-8 rounded-full bg-amber-950/90" />
              )}
            </div>
          ))}
        </div>

        {/* ============================================================
            BOLTED GLASS WATER TANK + FRONT PANEL (When Glass Tank Mode is ON)
           ============================================================ */}
        {isTankMode && (
          <div className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[360px] sm:w-[490px] h-[58%] pointer-events-none z-25 flex flex-col justify-end">
            <div className="relative w-full h-full bg-cyan-100/15 border-x-[12px] border-b-[12px] border-[#4F63C6] rounded-b-lg shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2.5 border-t-2 border-cyan-200/70 bg-gradient-to-b from-white/30 to-transparent" />

              <div
                className={`absolute left-0 right-0 bottom-0 transition-all duration-300 ${
                  isElectrocuted
                    ? 'bg-gradient-to-b from-cyan-200/85 via-sky-300/85 to-blue-400/90 shadow-[inset_0_0_50px_#FEF08A]'
                    : isBoilingFire
                    ? 'bg-gradient-to-b from-orange-400/70 via-cyan-400/70 to-red-600/80 animate-pulse'
                    : 'bg-gradient-to-b from-cyan-300/55 via-sky-400/65 to-blue-600/75'
                }`}
                style={{ height: `${waterLevel}%` }}
              >
                <div className="w-full h-3.5 bg-cyan-200/75 border-y border-white/65" />
              </div>

              {isBoilingFire && (
                <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-red-600 via-orange-500 to-transparent animate-pulse flex items-center justify-around">
                  <Flame className="w-8 h-8 text-yellow-300 animate-bounce" />
                  <Flame className="w-10 h-10 text-orange-200 animate-bounce" />
                  <Flame className="w-8 h-8 text-yellow-300 animate-bounce" />
                </div>
              )}
            </div>

            <div className="absolute left-0.5 top-4 bottom-4 flex flex-col justify-between py-2">
              {[0, 1, 2].map((b) => (
                <div
                  key={b}
                  className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-700"
                />
              ))}
            </div>
            <div className="absolute right-0.5 top-4 bottom-4 flex flex-col justify-between py-2">
              {[0, 1, 2].map((b) => (
                <div
                  key={b}
                  className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-700"
                />
              ))}
            </div>

            <div
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-52 sm:w-60 h-22 bg-gradient-to-b from-[#9CA3AF] to-[#6B7280] border-4 border-[#4B5563] rounded-xl shadow-2xl flex items-center justify-around px-4 pointer-events-auto z-30"
            >
              <button
                type="button"
                onClick={handleClickFireButton}
                className="w-14 h-14 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 p-1.5 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-900 flex items-center justify-center shadow-inner">
                  <Flame className="w-6 h-6 text-white fill-white" />
                </div>
              </button>

              <button
                type="button"
                onClick={handleClickRedLever}
                className="relative w-12 h-16 bg-slate-300 border-2 border-slate-500 rounded-lg flex items-center justify-center cursor-pointer group"
              >
                <div className="w-3 h-11 bg-slate-800 rounded-full" />
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-12 h-4 bg-gradient-to-b from-red-500 to-red-700 border-2 border-red-900 rounded-full shadow-lg transition-all duration-200 ${
                    isChainedHanging ? 'top-1' : 'bottom-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================
            SIDE-MOUNTED (RIGHT OR LEFT) HIGH-DETAIL AIMING WEAPON TURRET + LASER CROSSHAIR
           ============================================================ */}
        {!isTankMode && (
          <>
            {/* Live Red Crosshair Reticle following pointer */}
            <div
              className="absolute pointer-events-none z-35"
              style={{
                left: `${aimCoords.x}%`,
                top: `${aimCoords.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-11 h-11 rounded-full border-2 border-red-500/90 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.8)]">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              </div>
            </div>

            {/* Side-Mounted Weapon (Right or Left Side of the Horizontal Screen!) */}
            <div
              className={`absolute pointer-events-none z-35 transition-transform duration-75 ${
                isPortraitLayout
                  ? 'left-1/2 top-[80%]'
                  : `top-[52%] -translate-y-1/2 ${weaponSide === 'right' ? 'right-2 sm:right-5' : 'left-2 sm:left-5'}`
              }`}
              style={
                isPortraitLayout
                  ? {
                      transform: `translate(-50%, -50%) rotate(${portraitAimDeg}deg) translateX(${
                        isFiringRecoil ? '-14px' : '0px'
                      }) scaleY(${portraitFlip ? -1 : 1})`,
                      transformOrigin: 'center center',
                    }
                  : {
                      transform: `translate(${
                        isFiringRecoil
                          ? weaponSide === 'right'
                            ? '16px'
                            : '-16px'
                          : '0px'
                      }, -50%) scaleX(${weaponSide === 'right' ? -1 : 1}) rotate(${sideTurretRotateDeg}deg)`,
                      transformOrigin: 'center center',
                    }
              }
            >
              <div className="relative flex items-center">
                <HighDetailWeaponSvg
                  weaponId={selectedWeapon.id}
                  className="w-36 h-24 sm:w-48 sm:h-28 drop-shadow-[0_14px_18px_rgba(0,0,0,0.75)]"
                />
                {/* Fiery Multi-Layered Muzzle Flash at Barrel Tip when Firing */}
                {isFiringRecoil && selectedWeapon.category === 'firearms' && (
                  <div className="-ml-3 w-16 h-14 rounded-full bg-gradient-to-r from-white via-yellow-300 to-orange-600 blur-[1px] animate-ping" />
                )}
              </div>
            </div>

            {/* Quick Side-Switch Button (우측 거치 ↔ 좌측 거치) — 세로 배치에서는 숨김 */}
            {!isPortraitLayout && (
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setWeaponSide((prev) => (prev === 'right' ? 'left' : 'right'));
              }}
              className={`absolute top-[68%] z-40 px-2.5 py-1 rounded-xl bg-[#16181B]/90 hover:bg-[#2A2D32] border border-amber-500/60 text-[10px] font-extrabold text-amber-200 flex items-center gap-1 shadow-lg cursor-pointer pointer-events-auto ${
                weaponSide === 'right' ? 'right-3 sm:right-6' : 'left-3 sm:left-6'
              }`}
              title="무기 거치 위치 좌/우 변경"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-400" />
              <span>
                {weaponSide === 'right'
                  ? isKo
                    ? '좌측으로 이동'
                    : 'Move Left'
                  : isKo
                  ? '우측으로 이동'
                  : 'Move Right'}
              </span>
            </button>
            )}
          </>
        )}

        {/* 토마토 / 케이크 투사체 */}
        {thrownItems.map((t) => (
          <div
            key={t.id}
            className="absolute pointer-events-none z-30 animate-throw-fly"
            style={
              {
                '--fx': `${t.fx}%`,
                '--fy': `${t.fy}%`,
                '--tx': `${t.tx}%`,
                '--ty': `${t.ty}%`,
              } as React.CSSProperties
            }
          >
            <div className="-translate-x-1/2 -translate-y-1/2 animate-throw-spin">
              {t.kind === 'tomato' ? (
                <svg viewBox="0 0 40 40" className="w-14 h-14 drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]">
                  <circle cx="20" cy="22" r="15" fill="#EF4444" stroke="#7F1D1D" strokeWidth="2.5" />
                  <path d="M 11,17 Q 14,11 20,10" fill="none" stroke="#FCA5A5" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 20,8 L 15,4 M 20,8 L 25,3 M 20,8 L 27,9" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 44 40" className="w-16 h-14 drop-shadow-[0_6px_6px_rgba(0,0,0,0.5)]">
                  <path d="M 4,34 L 40,34 L 40,14 L 4,24 Z" fill="#FDE68A" stroke="#92400E" strokeWidth="2" />
                  <path d="M 4,29 L 40,21" stroke="#F472B6" strokeWidth="3" />
                  <path d="M 2,24 Q 8,17 14,21 Q 20,14 26,18 Q 32,10 40,13 L 40,15 L 4,25 Z" fill="#FFFFFF" stroke="#D6D3D1" strokeWidth="1.5" />
                  <circle cx="31" cy="10" r="4.5" fill="#DC2626" stroke="#7F1D1D" strokeWidth="1.5" />
                </svg>
              )}
            </div>
          </div>
        ))}

        {/* Active Weapon Impact Flash */}
        {weaponSwing.active && (
          <div
            key={weaponSwing.id}
            className="absolute pointer-events-none z-30 animate-ping"
            style={{
              left: `${weaponSwing.x}%`,
              top: `${weaponSwing.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-amber-400/50 border-2 border-yellow-200" />
          </div>
        )}

        {/* Floating Impact Words */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`absolute pointer-events-none text-center ${ft.isShout ? 'z-50' : 'z-40'}`}
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className={ft.isShout ? 'animate-shout-pop' : 'animate-float-up'}>
            <div
              className={`font-display font-extrabold tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] ${
                ft.isShout
                  ? 'text-xl sm:text-2xl bg-rose-600 text-white px-4 py-2 rounded-2xl border-[3px] border-rose-200 max-w-[80vw] break-keep shadow-[0_0_24px_rgba(244,63,94,0.7)]'
                  : 'text-xl sm:text-2xl'
              }`}
              style={{ color: ft.isShout ? '#FFFFFF' : ft.color }}
            >
              {ft.text}
            </div>
            {ft.subText && (
              <div className="font-mono-num text-xs font-bold text-white drop-shadow">
                {ft.subText}
              </div>
            )}
            </div>
          </div>
        ))}

        {/* High-FPS Particle, Tracer & Lightning Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />

        {/* ============================================================
            BOTTOM-LEFT: SILVER WIRE-MESH TRASH BIN (Opens Burn/Shred Diary!)
           ============================================================ */}
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setTargetName('');
            onOpenPaperModal();
          }}
          className="absolute bottom-2 left-3 sm:left-5 z-40 group flex flex-col items-center cursor-pointer pointer-events-auto"
        >
          <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex flex-col items-center">
            <div className="w-full h-4 rounded-full bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-2 border-slate-600 shadow-md z-10" />
            <div
              className="w-[84%] flex-1 -mt-2 rounded-b-xl border-x-2 border-b-4 border-slate-500 shadow-xl group-hover:scale-105 transition-transform"
              style={{
                background:
                  'repeating-linear-gradient(45deg, rgba(203,213,225,0.45) 0px, rgba(203,213,225,0.45) 2px, rgba(71,85,105,0.35) 2px, rgba(71,85,105,0.35) 7px), repeating-linear-gradient(-45deg, rgba(203,213,225,0.45) 0px, rgba(203,213,225,0.45) 2px, rgba(30,41,59,0.5) 2px, rgba(30,41,59,0.5) 7px)',
              }}
            />
          </div>
          <span className="-mt-2 px-2 py-0.5 rounded-lg bg-[#16181B]/95 border border-amber-500/60 text-[10px] font-extrabold text-amber-200 shadow">
            {isKo ? '🔥일기소각·파쇄' : '🔥Burn & Shred'}
          </span>
        </button>

        {/* ============================================================
            BOTTOM-RIGHT: STITCHED RED GUN PATCH & BLUE CHARACTER PATCH
           ============================================================ */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2.5 right-3 sm:right-5 z-40 flex items-center gap-2.5 pointer-events-auto"
        >
          {/* 휴대폰을 세로로 들었을 때만 보이는 "가로로 고정" 버튼 */}
          {(isPortraitLayout || isRotatedLandscape) && (
          <button
            type="button"
            onClick={onToggleRotateLock}
            className="px-2.5 py-1.5 rounded-xl bg-[#1C1E22]/90 border border-[#52565C] text-[11px] font-bold text-amber-200 flex items-center gap-1 shadow-lg cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>
              {isForcedLandscape
                ? isKo
                  ? '가로 고정 해제'
                  : 'Unlock'
                : isKo
                ? '가로 고정'
                : 'Lock Wide'}
            </span>
          </button>
          )}

          {/* Stitched Red Gun Patch Button */}
          <button
            type="button"
            onClick={() => setIsWeaponBinderOpen(true)}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-red-500 to-red-700 p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.65)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-full h-full rounded-xl border-2 border-dashed border-red-200/80 flex flex-col items-center justify-center">
              <svg viewBox="0 0 64 44" className="w-10 h-7 fill-white drop-shadow">
                <path d="M8,10 L52,10 L52,22 L30,22 L24,38 L10,38 L16,22 L8,22 Z" />
              </svg>
              <span className="text-[10px] font-black text-white leading-none mt-0.5">
                {isKo ? '무기선택' : 'WEAPONS'}
              </span>
            </div>
          </button>

          {/* Stitched Blue Character Patch Button (Cycles: 솜뭉치 곰 -> 뜨개 토끼 -> 충돌 테스트 더미) */}
          <button
            type="button"
            onClick={handleCycleDummyStyle}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-sky-500 to-blue-700 p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.65)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="w-full h-full rounded-xl border-2 border-dashed border-sky-200/80 flex flex-col items-center justify-center text-white">
              <User className="w-6 h-6 stroke-[2.5]" />
              <span className="text-[9px] sm:text-[10px] font-black leading-tight text-center mt-0.5">
                {dummyStyle === 'bear'
                  ? isKo
                    ? '솜뭉치 곰'
                    : 'Bear'
                  : dummyStyle === 'bunny'
                  ? isKo
                    ? '뜨개 토끼'
                    : 'Bunny'
                  : isKo
                  ? '더미'
                  : 'Dummy'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ============================================================
          FOLDER-STYLE "AVAILABLE WEAPONS" BINDER MODAL
         ============================================================ */}
      {isWeaponBinderOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setIsWeaponBinderOpen(false)}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl flex flex-col"
          >
            <div className="flex items-end gap-1.5 px-4 overflow-x-auto">
              {[
                { id: 'all', label: isKo ? 'ALL 전체' : 'ALL' },
                { id: 'firearms', label: isKo ? '🔫 총기 · 폭탄' : '🔫 Guns & Bombs' },
                { id: 'strike', label: isKo ? '🔨 철퇴 · 도끼 · 톱' : '🔨 Melee & Saw' },
                { id: 'special', label: isKo ? '⚡ 수조감전 · 봉쇄' : '⚡ Tank & Gag' },
                { id: 'splat', label: isKo ? '🍅 오물 · 접시박살' : '🍅 Splat & Smash' },
              ].map((tab) => {
                const active = binderTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBinderTab(tab.id as BinderTab)}
                    className={`px-4 py-2 rounded-t-2xl font-extrabold text-xs sm:text-sm border-t-4 border-x-4 transition-all whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#FCE7C8] border-[#9A5B25] text-[#5C2B0C] pb-3 -mb-1 z-10'
                        : 'bg-[#D69E66] border-[#7C4218] text-[#4A2107] hover:bg-[#E3AF7A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="relative bg-[#FCE7C8] border-[6px] border-[#9A5B25] rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
              <button
                type="button"
                onClick={() => setIsWeaponBinderOpen(false)}
                className="absolute -top-4 -right-4 w-11 h-11 rounded-full bg-gradient-to-b from-red-500 to-red-700 border-4 border-white text-white flex items-center justify-center shadow-xl hover:scale-105 cursor-pointer z-20"
              >
                <X className="w-6 h-6 stroke-[3]" />
              </button>

              <div className="mx-auto mb-4 px-6 py-1.5 rounded-2xl bg-[#E5B887] border-2 border-[#B87D4B] text-center max-w-xs shadow-inner">
                <span className="font-display font-black text-sm sm:text-base text-white drop-shadow-[0_2px_2px_rgba(92,43,12,0.8)]">
                  {isKo ? '무기 선택 (Available Weapons)' : 'Available Weapons'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[54vh] overflow-y-auto p-1">
                {binderWeapons.map((weapon) => {
                  const isSelected = selectedWeapon.id === weapon.id;
                  return (
                    <button
                      key={weapon.id}
                      type="button"
                      onClick={() => {
                        setSelectedWeapon(weapon);
                        if (weapon.specialEffect === 'flood_electrocute') {
                          setIsTankMode(true);
                        } else if (weapon.specialEffect === 'seal_tape') {
                          setMouthSeal('duct_tape');
                        } else if (weapon.specialEffect === 'seal_zipper') {
                          setMouthSeal('zipper');
                        }
                        soundEngine.play(weapon.sound);
                        setIsWeaponBinderOpen(false);
                      }}
                      className={`group relative rounded-2xl p-3 flex flex-col items-center justify-between border-4 transition-all cursor-pointer shadow-md hover:-translate-y-0.5 ${
                        isSelected
                          ? 'bg-[#FFFBEB] border-red-500 ring-4 ring-red-400/40'
                          : 'bg-[#FFF5E4] border-[#D5A370] hover:border-[#9A5B25]'
                      }`}
                    >
                      <div className="text-[11px] font-black text-[#5C2B0C] text-center line-clamp-1">
                        {isKo ? weapon.name : weapon.nameEn}
                      </div>

                      <div className="my-2 flex items-center justify-center h-16">
                        <HighDetailWeaponSvg
                          weaponId={weapon.id}
                          className="w-24 h-16 group-hover:scale-110 transition-transform"
                        />
                      </div>

                      <div className="w-full px-2 py-0.5 rounded-lg bg-[#E5B887]/60 text-[10px] font-extrabold text-[#7C3F16] text-center">
                        {isKo ? `파괴력 ${weapon.damage}` : `DMG ${weapon.damage}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
