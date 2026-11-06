/**
 * 속풀이 해방구 — 단계별 미션 10종 + 속풀이 완료 결과 화면
 *
 * 저장하지 않습니다. 진행 상황은 이 화면이 열려 있는 동안만 살아 있고,
 * 앱을 닫거나 "처음부터 다시"를 누르면 모두 사라집니다.
 *
 * © 2026 아이디어믹스랩. All rights reserved.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trophy, Play, RotateCcw, Download, Target, Timer } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { SessionStats } from '../types/catharsis';

/* ------------------------------------------------------------------ */
/* 미션 정의                                                           */
/* ------------------------------------------------------------------ */

type MissionKind =
  | 'hits'
  | 'combo'
  | 'weapon_hits'
  | 'distinct_weapons'
  | 'sealed_hits'
  | 'shouts'
  | 'electro'
  | 'ultimate';

interface MissionDef {
  kind: MissionKind;
  target: number;
  seconds: number;
  weaponId?: string;
  ko: string;
  en: string;
}

export const MISSIONS: MissionDef[] = [
  { kind: 'hits', target: 20, seconds: 20, ko: '20번 때리기', en: 'Land 20 hits' },
  { kind: 'combo', target: 30, seconds: 30, ko: '30콤보 달성', en: 'Reach a 30 combo' },
  {
    kind: 'weapon_hits',
    target: 10,
    seconds: 40,
    weaponId: 'rotten_tomato',
    ko: '토마토·케이크로 10번 맞히기',
    en: 'Hit 10 times with Tomato & Cake',
  },
  { kind: 'distinct_weapons', target: 5, seconds: 60, ko: '무기 5종류 써보기', en: 'Hit with 5 different weapons' },
  { kind: 'sealed_hits', target: 15, seconds: 40, ko: '입 봉쇄하고 15번 때리기', en: 'Land 15 hits while gagged' },
  { kind: 'shouts', target: 3, seconds: 60, ko: '욕·일갈 3번 던지기', en: 'Throw 3 shouts' },
  { kind: 'combo', target: 50, seconds: 30, ko: '50콤보 달성', en: 'Reach a 50 combo' },
  { kind: 'electro', target: 3, seconds: 60, ko: '유리 수조에서 감전 3번', en: 'Electrocute in the tank 3 times' },
  { kind: 'ultimate', target: 2, seconds: 90, ko: 'KO 필살기 2번', en: 'Unleash KO 2 times' },
  { kind: 'combo', target: 100, seconds: 60, ko: '최종: 100콤보 달성', en: 'FINAL: Reach a 100 combo' },
];

/** 회차가 올라갈수록 제한 시간이 줄어듭니다 (2회차 80%, 3회차 60%, 최소 50%) */
const timeLimitMs = (def: MissionDef, round: number) =>
  Math.round(def.seconds * 1000 * Math.max(0.5, 1 - 0.2 * (round - 1)));

export type MissionEvent =
  | { type: 'hit'; weaponId: string; combo: number; sealed: boolean }
  | { type: 'shout' }
  | { type: 'electro' }
  | { type: 'ultimate' };

type ToastKind = 'success' | 'fail' | 'master' | null;

export interface MissionView {
  index: number;
  round: number;
  def: MissionDef;
  progress: number;
  started: boolean;
  remainingMs: number;
  limitMs: number;
  toast: ToastKind;
  clearedTotal: number;
}

/* ------------------------------------------------------------------ */
/* 미션 진행 훅                                                         */
/* ------------------------------------------------------------------ */

export const useMissionSystem = (paused: boolean) => {
  const indexRef = useRef(0);
  const roundRef = useRef(1);
  const progressRef = useRef(0);
  const weaponSetRef = useRef<Set<string>>(new Set());
  const startRef = useRef<number | null>(null);
  const pausedAccumRef = useRef(0);
  const pausedSinceRef = useRef<number | null>(null);
  const busyRef = useRef(false); // 성공/실패 연출 중에는 이벤트 무시
  const clearedRef = useRef(0);
  const weaponCountsRef = useRef<Record<string, number>>({});
  const timeoutsRef = useRef<number[]>([]);

  const [view, setView] = useState<MissionView>(() => ({
    index: 0,
    round: 1,
    def: MISSIONS[0],
    progress: 0,
    started: false,
    remainingMs: timeLimitMs(MISSIONS[0], 1),
    limitMs: timeLimitMs(MISSIONS[0], 1),
    toast: null,
    clearedTotal: 0,
  }));

  const elapsed = () => {
    if (startRef.current === null) return 0;
    const now = performance.now();
    const pausedNow = pausedSinceRef.current !== null ? now - pausedSinceRef.current : 0;
    return now - startRef.current - pausedAccumRef.current - pausedNow;
  };

  const refresh = useCallback((toast?: ToastKind) => {
    const def = MISSIONS[indexRef.current];
    const limit = timeLimitMs(def, roundRef.current);
    setView((prev) => ({
      index: indexRef.current,
      round: roundRef.current,
      def,
      progress: Math.min(def.target, progressRef.current),
      started: startRef.current !== null,
      remainingMs: Math.max(0, limit - elapsed()),
      limitMs: limit,
      toast: toast === undefined ? prev.toast : toast,
      clearedTotal: clearedRef.current,
    }));
  }, []);

  const resetCurrent = () => {
    progressRef.current = 0;
    weaponSetRef.current = new Set();
    startRef.current = null;
    pausedAccumRef.current = 0;
    pausedSinceRef.current = paused ? performance.now() : null;
  };

  const later = (fn: () => void, ms: number) => {
    timeoutsRef.current.push(window.setTimeout(fn, ms));
  };

  const succeed = useCallback(() => {
    busyRef.current = true;
    clearedRef.current += 1;
    const isLast = indexRef.current === MISSIONS.length - 1;
    soundEngine.play('calm_chime');
    refresh(isLast ? 'master' : 'success');
    later(() => {
      if (isLast) {
        indexRef.current = 0;
        roundRef.current += 1;
      } else {
        indexRef.current += 1;
      }
      resetCurrent();
      busyRef.current = false;
      refresh(null);
    }, isLast ? 2600 : 1700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const fail = useCallback(() => {
    busyRef.current = true;
    soundEngine.play('squeak_hammer');
    refresh('fail');
    later(() => {
      resetCurrent();
      busyRef.current = false;
      refresh(null);
    }, 1600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const emit = useCallback(
    (ev: MissionEvent) => {
      if (ev.type === 'hit' && ev.weaponId !== 'shout') {
        weaponCountsRef.current[ev.weaponId] = (weaponCountsRef.current[ev.weaponId] || 0) + 1;
      }
      if (busyRef.current) return;
      const def = MISSIONS[indexRef.current];

      let counts = false;
      switch (def.kind) {
        case 'hits':
          if (ev.type === 'hit') {
            progressRef.current += 1;
            counts = true;
          }
          break;
        case 'combo':
          if (ev.type === 'hit') {
            progressRef.current = Math.max(progressRef.current, ev.combo);
            counts = true;
          }
          break;
        case 'weapon_hits':
          if (ev.type === 'hit') {
            counts = true;
            if (ev.weaponId === def.weaponId) progressRef.current += 1;
          }
          break;
        case 'distinct_weapons':
          if (ev.type === 'hit') {
            counts = true;
            if (ev.weaponId !== 'shout') weaponSetRef.current.add(ev.weaponId);
            progressRef.current = weaponSetRef.current.size;
          }
          break;
        case 'sealed_hits':
          if (ev.type === 'hit') {
            counts = true;
            if (ev.sealed) progressRef.current += 1;
          }
          break;
        case 'shouts':
          if (ev.type === 'shout' || ev.type === 'hit') counts = true;
          if (ev.type === 'shout') progressRef.current += 1;
          break;
        case 'electro':
          if (ev.type === 'electro' || ev.type === 'hit') counts = true;
          if (ev.type === 'electro') progressRef.current += 1;
          break;
        case 'ultimate':
          if (ev.type === 'ultimate' || ev.type === 'hit') counts = true;
          if (ev.type === 'ultimate') progressRef.current += 1;
          break;
      }

      // 첫 행동부터 시간이 흐르기 시작
      if (counts && startRef.current === null) {
        startRef.current = performance.now();
        pausedAccumRef.current = 0;
        pausedSinceRef.current = null;
      }

      if (progressRef.current >= def.target) {
        succeed();
      } else {
        refresh();
      }
    },
    [refresh, succeed]
  );

  // 일시정지 (결과 화면 · 무기 서랍이 열려 있는 동안)
  useEffect(() => {
    const now = performance.now();
    if (paused) {
      if (pausedSinceRef.current === null) pausedSinceRef.current = now;
    } else if (pausedSinceRef.current !== null) {
      if (startRef.current !== null) pausedAccumRef.current += now - pausedSinceRef.current;
      pausedSinceRef.current = null;
    }
  }, [paused]);

  // 시간 흐름 확인
  useEffect(() => {
    const id = window.setInterval(() => {
      if (busyRef.current || startRef.current === null) return;
      const def = MISSIONS[indexRef.current];
      if (elapsed() >= timeLimitMs(def, roundRef.current)) {
        fail();
      } else {
        refresh();
      }
    }, 150);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fail, refresh]);

  useEffect(
    () => () => {
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    },
    []
  );

  const resetAll = useCallback(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];
    indexRef.current = 0;
    roundRef.current = 1;
    clearedRef.current = 0;
    weaponCountsRef.current = {};
    busyRef.current = false;
    resetCurrent();
    refresh(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const topWeaponId = () => {
    const entries = Object.entries(weaponCountsRef.current);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  };

  return { view, emit, resetAll, topWeaponId };
};

/* ------------------------------------------------------------------ */
/* 미션 카드 + 성공/실패 연출                                            */
/* ------------------------------------------------------------------ */

export const MissionHud: React.FC<{ view: MissionView; isKo: boolean; portrait: boolean }> = ({
  view,
  isKo,
  portrait,
}) => {
  const { def, progress, started, remainingMs, limitMs, index, round, toast } = view;
  const timePct = Math.max(0, Math.min(100, (remainingMs / limitMs) * 100));
  const progPct = Math.min(100, (progress / def.target) * 100);
  const secs = Math.ceil(remainingMs / 1000);
  const urgent = started && remainingMs < 6000;

  return (
    <>
      <div
        className={`absolute z-40 pointer-events-none ${
          portrait ? 'left-3 top-[148px] w-[min(240px,70vw)] opacity-95' : 'left-3 sm:left-5 top-[60px] sm:top-[68px] w-[250px] sm:w-[280px]'
        }`}
      >
        <div
          className={`rounded-2xl border-2 bg-[#16181B]/90 backdrop-blur-sm px-3 py-2 shadow-[0_8px_20px_rgba(0,0,0,0.55)] ${
            urgent ? 'border-rose-500 animate-pulse' : 'border-amber-500/80'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-[10px] font-black tracking-wider">
            <span className="flex items-center gap-1 text-amber-400">
              <Target className="w-3 h-3" />
              MISSION {index + 1}/{MISSIONS.length}
              {round > 1 && (
                <span className="ml-1 px-1.5 rounded bg-amber-500 text-[#16181B]">
                  {isKo ? `${round}회차` : `R${round}`}
                </span>
              )}
            </span>
            <span className={`flex items-center gap-1 font-mono-num ${urgent ? 'text-rose-400' : 'text-slate-300'}`}>
              <Timer className="w-3 h-3" />
              {secs}s
            </span>
          </div>
          <div className="mt-0.5 text-[13px] font-extrabold text-white leading-snug">{isKo ? def.ko : def.en}</div>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-[width] duration-150"
                style={{ width: `${progPct}%` }}
              />
            </div>
            <span className="font-mono-num text-[11px] font-black text-amber-200 w-12 text-right">
              {progress}/{def.target}
            </span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${urgent ? 'bg-rose-500' : 'bg-sky-400'} transition-[width] duration-150`}
              style={{ width: `${timePct}%` }}
            />
          </div>
          {!started && !toast && (
            <div className="mt-1 text-[10px] text-slate-400 font-semibold">
              {isKo ? '첫 타격부터 시간이 흘러요' : 'Timer starts on your first hit'}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="absolute inset-0 z-[60] pointer-events-none flex items-center justify-center">
          <div className="animate-mission-toast text-center px-6">
            {toast === 'success' && (
              <>
                <div className="text-4xl sm:text-5xl font-black text-yellow-300 drop-shadow-[0_6px_0_#92400E] [text-shadow:0_0_30px_rgba(250,204,21,0.8)]">
                  {isKo ? '미션 성공!' : 'MISSION CLEAR!'}
                </div>
                <div className="mt-2 text-sm font-extrabold text-white drop-shadow">
                  {isKo ? '다음 미션 준비…' : 'Next mission…'}
                </div>
              </>
            )}
            {toast === 'fail' && (
              <>
                <div className="text-3xl sm:text-4xl font-black text-rose-400 drop-shadow-[0_5px_0_#7F1D1D]">
                  {isKo ? '아깝다!' : 'SO CLOSE!'}
                </div>
                <div className="mt-2 text-sm font-extrabold text-white drop-shadow">
                  {isKo ? '같은 미션 다시 도전' : 'Try the same mission again'}
                </div>
              </>
            )}
            {toast === 'master' && (
              <>
                <Trophy className="w-14 h-14 mx-auto text-yellow-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.9)]" />
                <div className="mt-1 text-4xl sm:text-5xl font-black text-yellow-300 drop-shadow-[0_6px_0_#92400E]">
                  {isKo ? '속풀이 마스터!' : 'RAGE MASTER!'}
                </div>
                <div className="mt-2 text-sm font-extrabold text-white drop-shadow">
                  {isKo ? `${view.round + 1}회차 시작 · 시간이 더 짧아져요` : `Round ${view.round + 1} · less time!`}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* 속풀이 완료 결과 화면                                                */
/* ------------------------------------------------------------------ */

interface ResultProps {
  isKo: boolean;
  stats: SessionStats;
  topWeaponName: string | null;
  missionView: MissionView;
  onContinue: () => void;
  onRestart: () => void;
}

const stressDrop = (stats: SessionStats, cleared: number) =>
  Math.min(
    99,
    30 +
      Math.round(
        stats.totalHits * 0.15 + stats.maxCombo * 0.1 + cleared * 4 + stats.shoutsThrown * 2 + stats.ultimatesUnleashed * 3
      )
  );

const drawResultCard = async (
  isKo: boolean,
  pct: number,
  rows: [string, string][],
  stageLabel: string
): Promise<Blob | null> => {
  const W = 1080;
  const H = 1350;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  if (!g) return null;
  try {
    await document.fonts?.ready;
  } catch {
    /* 폰트 준비 실패해도 계속 */
  }
  const font = "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif";
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#1C1E22');
  bg.addColorStop(1, '#0B0D10');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  g.strokeStyle = '#F97316';
  g.lineWidth = 14;
  g.strokeRect(30, 30, W - 60, H - 60);
  // 안전 띠
  for (let x = -40; x < W; x += 60) {
    g.fillStyle = '#EAB308';
    g.beginPath();
    g.moveTo(x, H - 120);
    g.lineTo(x + 30, H - 120);
    g.lineTo(x + 60, H - 90);
    g.lineTo(x + 30, H - 90);
    g.closePath();
    g.fill();
  }
  g.textAlign = 'center';
  g.fillStyle = '#FDBA74';
  g.font = `800 40px ${font}`;
  g.fillText(isKo ? '속풀이 해방구' : 'SOKPURI', W / 2, 140);
  g.fillStyle = '#FFFFFF';
  g.font = `900 84px ${font}`;
  g.fillText(isKo ? '오늘의 속풀이 완료!' : 'Rage Released!', W / 2, 260);
  g.fillStyle = '#FACC15';
  g.font = `900 200px ${font}`;
  g.fillText(`-${pct}%`, W / 2, 500);
  g.fillStyle = '#CBD5E1';
  g.font = `700 40px ${font}`;
  g.fillText(isKo ? '스트레스 감소' : 'stress released', W / 2, 565);
  g.textAlign = 'left';
  rows.forEach(([k, v], i) => {
    const y = 690 + i * 92;
    g.fillStyle = '#94A3B8';
    g.font = `700 40px ${font}`;
    g.fillText(k, 130, y);
    g.textAlign = 'right';
    g.fillStyle = '#FFFFFF';
    g.font = `900 46px ${font}`;
    g.fillText(v, W - 130, y);
    g.textAlign = 'left';
  });
  g.textAlign = 'center';
  g.fillStyle = '#FBBF24';
  g.font = `800 38px ${font}`;
  g.fillText(stageLabel, W / 2, H - 180);
  g.fillStyle = '#64748B';
  g.font = `600 26px ${font}`;
  g.fillText('sokpuri.vercel.app', W / 2, H - 140);
  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/png'));
};

export const ResultOverlay: React.FC<ResultProps> = ({
  isKo,
  stats,
  topWeaponName,
  missionView,
  onContinue,
  onRestart,
}) => {
  const cleared = missionView.clearedTotal;
  const [pct] = useState(() => stressDrop(stats, cleared));
  const [saveNote, setSaveNote] = useState<string | null>(null);

  const stageLabel = isKo
    ? `미션 ${missionView.round > 1 ? `${missionView.round}회차 ` : ''}${missionView.index + 1}단계 도전 중 · 총 ${cleared}개 성공`
    : `Mission ${missionView.index + 1}${missionView.round > 1 ? ` (R${missionView.round})` : ''} · ${cleared} cleared`;

  const rows: [string, string][] = [
    [isKo ? '총 타격' : 'Total hits', `${stats.totalHits}${isKo ? '회' : ''}`],
    [isKo ? '최고 콤보' : 'Best combo', `${stats.maxCombo}`],
    [isKo ? '가장 많이 쓴 무기' : 'Favorite weapon', topWeaponName ?? '-'],
    [isKo ? '던진 욕·일갈' : 'Shouts thrown', `${stats.shoutsThrown}${isKo ? '번' : ''}`],
    [isKo ? 'KO 필살기' : 'KO unleashed', `${stats.ultimatesUnleashed}${isKo ? '번' : ''}`],
  ];

  const handleSave = async () => {
    const blob = await drawResultCard(isKo, pct, rows, stageLabel);
    if (!blob) return;
    const file = new File([blob], 'sokpuri-result.png', { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    try {
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({ files: [file], title: isKo ? '오늘의 속풀이 완료!' : 'Rage Released!' });
        return;
      }
    } catch {
      /* 공유 취소 등 → 다운로드로 */
    }
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sokpuri-result.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setSaveNote(isKo ? '결과 이미지를 저장했어요' : 'Saved!');
    } catch {
      setSaveNote(isKo ? '이 화면에서는 저장할 수 없어요' : 'Saving is not available here');
    }
  };

  return (
    <div
      className="absolute inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-[2px] p-3"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="animate-result-pop relative w-full max-w-md max-h-full overflow-y-auto rounded-3xl border-4 border-orange-500 bg-gradient-to-b from-[#1C1E22] to-[#0B0D10] p-5 sm:p-6 text-center shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
        <div className="text-xs font-black tracking-[0.25em] text-orange-300">KO!</div>
        <div className="mt-1 text-2xl sm:text-3xl font-black text-white">
          {isKo ? '오늘의 속풀이 완료!' : 'Rage Released!'}
        </div>
        <div className="mt-2 font-mono-num text-6xl sm:text-7xl font-black text-yellow-300 [text-shadow:0_0_30px_rgba(250,204,21,0.55)]">
          -{pct}%
        </div>
        <div className="text-xs font-bold text-slate-400">{isKo ? '스트레스 감소' : 'stress released'}</div>

        <div className="mt-4 grid grid-cols-1 gap-1.5 text-left">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-3 py-2">
              <span className="text-xs font-bold text-slate-400">{k}</span>
              <span className="text-sm font-black text-white truncate ml-3">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 text-[11px] font-bold text-amber-300">{stageLabel}</div>

        <div className="mt-4 grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-3 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-700 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            {isKo ? '계속 때리기' : 'Keep Smashing'}
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="py-2.5 rounded-2xl bg-slate-800 border border-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {isKo ? '처음부터 다시' : 'Start Over'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 rounded-2xl bg-slate-800 border border-amber-500/60 text-amber-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {isKo ? '결과 이미지 저장' : 'Save Image'}
            </button>
          </div>
          {saveNote && <div className="text-[11px] text-slate-400">{saveNote}</div>}
          <div className="text-[10px] text-slate-500">
            {isKo ? '결과는 어디에도 저장되지 않고, 닫으면 사라져요' : 'Nothing is stored. It vanishes when you leave.'}
          </div>
        </div>
      </div>
    </div>
  );
};
