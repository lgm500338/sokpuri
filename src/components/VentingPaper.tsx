import React, { useState, useRef, useEffect } from 'react';
import {
  Flame,
  Scissors,
  ShieldCheck,
  Sparkles,
  Trash2,
  CheckCircle2,
  PenTool,
  ArrowLeft,
} from 'lucide-react';
import { SessionStats, AppLanguage } from '../types/catharsis';
import { soundEngine } from '../utils/soundEngine';

type DestructionState = 'writing' | 'burning' | 'shredding' | 'cleansed';

const ANGER_STAMP_PHRASES_KO = [
  '개XX야!!',
  '씨XX아!!',
  '진짜 적당히 좀 해라!! 참아주는 것도 오늘까지만이야!!',
  '니가 뭔데 내 인생에 이래라저래라야!! 남 참견 그만하고 너나 잘해!!',
  '꼴도 보기 싫으니까 내 눈앞에서 영원히 사라져버려!!',
  '내 앞길 막지 말고 저리 비켜!! 지랄하고 자빠졌네 진짜!!',
  '앞에서는 웃고 뒤에서는 사람 속 긁는 인간들 3대가 망해라!!',
  '오늘 쌓인 스트레스와 거지 같은 기억들, 이 종이랑 같이 다 불타서 없어져라!!',
];

const ANGER_STAMP_PHRASES_EN = [
  'You son of a b*tch!!',
  'You f*cking bastard!!',
  'Know when to stop!! My patience ends right here, right now!!',
  'Who do you think you are to boss me around?! Mind your own business!!',
  'Get out of my sight and disappear forever!!',
  'Stop blocking my way and move!! What a load of bullshit!!',
  'Fake-smiling toxic people driving me crazy — curse you for 3 generations!!',
  'Every single frustration from today, burn to ashes with this paper right now!!',
];

interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  isAsh: boolean;
}

interface VentingPaperProps {
  stats: SessionStats;
  setStats: React.Dispatch<React.SetStateAction<SessionStats>>;
  lang: AppLanguage;
  onBackToRoom: () => void;
}

export const VentingPaper: React.FC<VentingPaperProps> = ({
  stats,
  setStats,
  lang,
  onBackToRoom,
}) => {
  const [ventText, setVentText] = useState<string>('');
  const [destructionState, setDestructionState] = useState<DestructionState>('writing');
  const [lastMode, setLastMode] = useState<'burn' | 'shred'>('burn');
  const [progress, setProgress] = useState<number>(0);

  const fireCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fireParticlesRef = useRef<FireParticle[]>([]);

  const isKo = lang === 'ko';
  const stampPhrases = isKo ? ANGER_STAMP_PHRASES_KO : ANGER_STAMP_PHRASES_EN;

  useEffect(() => {
    if (destructionState !== 'burning') return;

    const canvas = fireCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 640;
    canvas.height = canvas.parentElement?.clientHeight || 480;

    let animId: number;
    const startTime = performance.now();
    const duration = 3100;

    const renderFire = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const burnFrontY = canvas.height * (1 - pct / 105);

      for (let i = 0; i < 14; i++) {
        const isAsh = Math.random() < 0.35;
        const colors = isAsh
          ? ['#1E293B', '#334155', '#94A3B8', '#F97316']
          : ['#FEF08A', '#FBBF24', '#F97316', '#EF4444', '#DC2626'];

        fireParticlesRef.current.push({
          x: Math.random() * canvas.width,
          y: burnFrontY + (Math.random() * 60 - 20),
          vx: (Math.random() - 0.5) * 3.5,
          vy: -(2.5 + Math.random() * 5.5),
          size: isAsh ? 4 + Math.random() * 6 : 14 + Math.random() * 24,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.95,
          isAsh,
        });
      }

      for (let i = fireParticlesRef.current.length - 1; i >= 0; i--) {
        const fp = fireParticlesRef.current[i];
        fp.x += fp.vx + Math.sin(now * 0.01 + i) * 0.8;
        fp.y += fp.vy;
        fp.size *= fp.isAsh ? 0.99 : 0.96;
        fp.alpha -= fp.isAsh ? 0.015 : 0.026;

        if (fp.alpha <= 0 || fp.size < 1) {
          fireParticlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, fp.alpha);
        ctx.fillStyle = fp.color;
        ctx.beginPath();
        if (fp.isAsh) {
          ctx.fillRect(fp.x, fp.y, fp.size, fp.size * 0.6);
        } else {
          ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < duration) {
        animId = requestAnimationFrame(renderFire);
      } else {
        fireParticlesRef.current = [];
        setVentText('');
        setDestructionState('cleansed');
        soundEngine.play('calm_chime');
      }
    };

    animId = requestAnimationFrame(renderFire);
    return () => cancelAnimationFrame(animId);
  }, [destructionState]);

  useEffect(() => {
    if (destructionState !== 'shredding') return;

    let animId: number;
    const startTime = performance.now();
    const duration = 3000;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed < duration) {
        animId = requestAnimationFrame(step);
      } else {
        setVentText('');
        setDestructionState('cleansed');
        soundEngine.play('calm_chime');
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [destructionState]);

  const handleStartBurn = () => {
    if (!ventText.trim() || destructionState !== 'writing') return;
    setLastMode('burn');
    setProgress(0);
    setDestructionState('burning');
    soundEngine.playDestructionSound('fire', 3100);
    setStats((prev) => ({
      ...prev,
      papersBurned: prev.papersBurned + 1,
    }));
  };

  const handleStartShred = () => {
    if (!ventText.trim() || destructionState !== 'writing') return;
    setLastMode('shred');
    setProgress(0);
    setDestructionState('shredding');
    soundEngine.playDestructionSound('shredder', 3000);
    setStats((prev) => ({
      ...prev,
      papersShredded: prev.papersShredded + 1,
    }));
  };

  const handleAppendStamp = (phrase: string) => {
    if (destructionState !== 'writing') return;
    setVentText((prev) => (prev ? `${prev}\n${phrase}` : phrase));
    soundEngine.play('slap_swatter');
  };

  const handleNewPaper = () => {
    setVentText('');
    setProgress(0);
    setDestructionState('writing');
  };

  const shredStrips = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="flex flex-col min-h-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
      {/* Main Paper Writing & Destruction Chamber (8 cols) */}
      <div className="lg:col-span-8 bg-[#151C28] border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-orange-400" />
              <span>
                {isKo
                  ? '비공개 감정 쓰레기통 (불태우기 & 파쇄기)'
                  : 'Private Rage Note (Burn & Shredder)'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isKo
                ? '누구에게도 말 못 한 분노, 욕설, 스트레스를 필터링 없이 적고 흔적 없이 날려버리세요.'
                : 'Write down any anger, curses, or daily stress unfiltered, then incinerate or shred it completely.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isKo
                ? '서버 무저장 · 소멸 즉시 100% 영구 삭제'
                : 'Zero Storage · 100% Wiped on Destruction'}
            </span>
          </div>
        </div>

        {/* Center Paper Stage */}
        <div className="my-5 relative min-h-[380px] flex items-center justify-center">
          {destructionState === 'cleansed' ? (
            <div className="w-full max-w-lg mx-auto text-center py-12 px-6 rounded-2xl bg-[#0F141C] border border-slate-800 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-100">
                  {lastMode === 'burn'
                    ? isKo
                      ? '한 줌의 검은 재가 되어 흔적도 없이 날아갔습니다'
                      : 'Burned to ashes without leaving a single trace!'
                    : isKo
                    ? '갈기갈기 파쇄되어 먼지처럼 사라졌습니다'
                    : 'Shredded into tiny pieces and wiped away!'}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isKo
                    ? '적으셨던 모든 글자는 기기와 메모리 어디에도 남지 않고 완벽히 소멸했습니다.'
                    : 'Every word you wrote has been permanently erased from memory.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleNewPaper}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isKo ? '새 종이 꺼내서 더 쏟아내기' : 'Write on a New Sheet'}
                </button>
                <button
                  type="button"
                  onClick={onBackToRoom}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {isKo ? '밀실 타격장으로 돌아가기' : 'Back to Smash Room'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full max-w-2xl">
              <div
                className={`relative rounded-xl bg-[#FBF7F0] text-slate-900 shadow-2xl border-2 border-[#E2D5C1] p-5 sm:p-7 transition-all duration-150 overflow-hidden ${
                  destructionState === 'burning' ? 'animate-shake-light' : ''
                }`}
                style={{
                  clipPath:
                    destructionState === 'burning'
                      ? `inset(0% 0% ${Math.min(100, progress * 1.02)}% 0%)`
                      : undefined,
                  filter:
                    destructionState === 'burning'
                      ? `sepia(${Math.min(1, progress / 40)}) brightness(${Math.max(
                          0.15,
                          1 - progress / 110
                        )}) contrast(1.25)`
                      : undefined,
                  transform:
                    destructionState === 'shredding'
                      ? `translateY(${Math.min(180, progress * 2.2)}px) scaleY(${Math.max(
                          0.05,
                          1 - progress / 105
                        )})`
                      : undefined,
                  opacity:
                    destructionState === 'shredding' && progress > 85
                      ? Math.max(0, (100 - progress) / 15)
                      : 1,
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-rose-300/70 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">
                    {isKo
                      ? '속풀이 해방 노트 — 누구도 볼 수 없는 비밀 종이'
                      : 'Secret Rage Pad — Zero History'}
                  </span>
                  <span className="font-mono-num">
                    {isKo ? `글자 수: ${ventText.length}자` : `${ventText.length} chars`}
                  </span>
                </div>

                <textarea
                  value={ventText}
                  onChange={(e) => setVentText(e.target.value)}
                  disabled={destructionState !== 'writing'}
                  rows={8}
                  placeholder={
                    isKo
                      ? '여기에 나를 열받게 한 사람, 짜증 나는 일, 하고 싶은 욕설을 마음껏 적으세요.\n(적으신 내용은 어디에도 저장되지 않으며 불태우기나 파쇄하기를 누르면 즉시 영구 소멸됩니다)'
                      : 'Type everything that pissed you off today — toxic people, unfair bosses, or raw curses.\n(Nothing is ever saved or transmitted. Burning or shredding wipes it permanently.)'
                  }
                  className="w-full bg-transparent text-stone-900 placeholder:text-stone-400 text-base sm:text-lg font-medium leading-relaxed resize-none focus:outline-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(transparent, transparent 31px, rgba(214, 201, 180, 0.55) 31px, rgba(214, 201, 180, 0.55) 32px)',
                    lineHeight: '32px',
                  }}
                />

                {destructionState === 'burning' && (
                  <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black via-orange-600 to-transparent pointer-events-none" />
                )}
              </div>

              {destructionState === 'shredding' && (
                <div className="mt-2 relative">
                  <div className="w-full h-9 bg-slate-900 border-2 border-slate-600 rounded-lg flex items-center justify-between px-4 shadow-xl z-20 relative">
                    <span className="text-xs font-mono-num font-bold text-amber-400 flex items-center gap-2">
                      <Scissors className="w-4 h-4 animate-spin" />
                      <span>
                        {isKo
                          ? `고출력 파쇄 칼날 가동 중... (${Math.round(progress)}%)`
                          : `High-Power Shredder Running... (${Math.round(progress)}%)`}
                      </span>
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs text-slate-400">SHREDDING</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-20 gap-1 px-2 pt-1 h-44 overflow-hidden">
                    {shredStrips.map((idx) => {
                      const offset = ((idx * 17) % 35) + progress * 1.6;
                      const rot = (idx % 2 === 0 ? 1 : -1) * ((idx * 3) % 18);
                      return (
                        <div
                          key={idx}
                          className="bg-[#FBF7F0] border-x border-stone-300 text-[9px] text-stone-700 overflow-hidden select-none rounded-b"
                          style={{
                            height: '130px',
                            transform: `translate3d(0, ${offset}px, 0) rotate(${rot}deg)`,
                            opacity: Math.max(0, 1 - progress / 95),
                          }}
                        >
                          {ventText.slice(idx * 4, idx * 4 + 18) || '####'}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {destructionState === 'burning' && (
                <canvas
                  ref={fireCanvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-30"
                />
              )}
            </div>
          )}
        </div>

        {/* Bottom Destruction Action Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            disabled={!ventText.trim() || destructionState !== 'writing'}
            onClick={() => setVentText('')}
            className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isKo ? '백지로 지우기' : 'Clear Sheet'}</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 sm:justify-end">
            <button
              type="button"
              disabled={!ventText.trim() || destructionState !== 'writing'}
              onClick={handleStartBurn}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                ventText.trim() && destructionState === 'writing'
                  ? 'bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 text-white shadow-lg shadow-orange-600/25 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Flame className="w-5 h-5" />
              <span>
                {isKo ? '불붙여서 활활 태워버리기 (소각)' : 'Burn to Ashes (Incinerate)'}
              </span>
            </button>

            <button
              type="button"
              disabled={!ventText.trim() || destructionState !== 'writing'}
              onClick={handleStartShred}
              className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                ventText.trim() && destructionState === 'writing'
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:scale-[1.02] cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Scissors className="w-5 h-5" />
              <span>
                {isKo ? '파쇄기에 갈기갈기 갈아버리기' : 'Shred into Pieces'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Universal Anger Stamps & Destruction Stats (4 cols) */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-5">
        <div className="bg-[#151C28] border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>
                  {isKo ? '빠른 분노 문장 스탬프' : 'Quick Rage Stamps'}
                </span>
              </h3>
              <span className="text-xs text-slate-400">
                {isKo ? '클릭 시 종이에 입력' : 'Tap to insert'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {isKo
                ? '손으로 일일이 치기조차 귀찮을 때는 아래 문장을 눌러 종이에 바로 찍어낸 뒤 통째로 불태우거나 갈아버리세요.'
                : 'Tap any phrase below to stamp it onto the paper, then burn or shred it all at once.'}
            </p>

            <div className="space-y-2.5">
              {stampPhrases.map((phrase, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={destructionState !== 'writing'}
                  onClick={() => handleAppendStamp(phrase)}
                  className="w-full text-left p-3 rounded-xl bg-[#0F141C] hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 text-xs text-slate-200 leading-relaxed transition-all cursor-pointer disabled:opacity-50"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-200">
              {isKo ? '완벽한 익명 보장' : '100% Private & Volatile'}
            </div>
            <p className="leading-relaxed">
              {isKo
                ? '이 노트는 서버나 기기에 절대 저장되지 않으며, 소각·파쇄 즉시 메모리에서 영구 삭제됩니다.'
                : 'Nothing is ever stored on any server or device. Everything vanishes permanently once destroyed.'}
            </p>
          </div>
        </div>

        <div className="bg-[#151C28] border border-slate-800 rounded-2xl p-4">
          <div className="text-xs font-semibold text-slate-200 mb-3">
            {isKo ? '소멸시킨 감정 쓰레기 기록' : 'Destroyed Notes in Session'}
          </div>
          <div className="grid grid-cols-2 gap-3 text-center bg-[#0F141C] p-3.5 rounded-xl border border-slate-800/80">
            <div>
              <div className="font-mono-num text-xl font-bold text-orange-400">
                {stats.papersBurned}
                {isKo ? '장' : ''}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isKo ? '불태운 종이' : 'Burned'}
              </div>
            </div>
            <div className="border-l border-slate-800">
              <div className="font-mono-num text-xl font-bold text-indigo-400">
                {stats.papersShredded}
                {isKo ? '장' : ''}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {isKo ? '파쇄한 종이' : 'Shredded'}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <footer className="mt-8 pt-4 pb-2 border-t border-slate-800/60 text-center text-[11px] text-slate-500 font-medium tracking-wide">
        {isKo
          ? '© 2026 아이디어믹스랩. All rights reserved.'
          : '© 2026 IdeaFusionLab. All rights reserved.'}
      </footer>
    </div>
  );
};
