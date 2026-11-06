/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Hammer, Flame, RotateCcw, Globe } from 'lucide-react';
import { DummySandbox } from './components/DummySandbox';
import { VentingPaper } from './components/VentingPaper';
import { SessionStats, AppLanguage } from './types/catharsis';
import { soundEngine } from './utils/soundEngine';

type ActiveModalView = 'none' | 'paper';

export default function App() {
  const [activeModal, setActiveModal] = useState<ActiveModalView>('none');
  const [lang, setLang] = useState<AppLanguage>('ko');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sessionResetKey, setSessionResetKey] = useState<number>(0);

  // 휴대폰 방향을 그대로 따라갑니다: 가로로 들면 가로 배치, 세우면 세로 배치.
  // "가로회전" 버튼을 켜면 세로로 들어도 화면을 90도 돌려 가로 배치로 고정합니다.
  const [isPortraitScreen, setIsPortraitScreen] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerHeight > window.innerWidth
  );
  const [forceLandscape, setForceLandscape] = useState<boolean>(false);
  const [isOrientationFading, setIsOrientationFading] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortraitScreen(window.innerHeight > window.innerWidth);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const effectiveRotatedLandscape = forceLandscape && isPortraitScreen;
  const isPortraitLayout = isPortraitScreen && !effectiveRotatedLandscape;

  // 가로 ↔ 세로가 바뀌는 순간 살짝 페이드
  const layoutKey = isPortraitLayout ? 'portrait' : 'landscape';
  const prevLayoutKeyRef = useRef(layoutKey);
  useEffect(() => {
    if (prevLayoutKeyRef.current === layoutKey) return;
    prevLayoutKeyRef.current = layoutKey;
    setIsOrientationFading(true);
    const t = window.setTimeout(() => setIsOrientationFading(false), 60);
    return () => window.clearTimeout(t);
  }, [layoutKey]);

  const [stats, setStats] = useState<SessionStats>({
    totalHits: 0,
    maxCombo: 0,
    objectsShattered: 0,
    ultimatesUnleashed: 0,
    shoutsThrown: 0,
    papersBurned: 0,
    papersShredded: 0,
  });

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.play('calm_chime');
    }
  };

  const handleResetAllSession = () => {
    setStats({
      totalHits: 0,
      maxCombo: 0,
      objectsShattered: 0,
      ultimatesUnleashed: 0,
      shoutsThrown: 0,
      papersBurned: 0,
      papersShredded: 0,
    });
    setSessionResetKey((prev) => prev + 1);
    setActiveModal('none');
    soundEngine.play('calm_chime');
  };

  return (
    <div
      key={sessionResetKey}
      className="fixed inset-0 overflow-hidden bg-[#2B1508] text-slate-100"
    >
      {/* Wrapper that automatically rotates 90 degrees into Landscape when on a portrait screen */}
      <div
        style={{
          ...(effectiveRotatedLandscape
            ? {
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '100vh',
                height: '100vw',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                transformOrigin: 'center center',
              }
            : {
                width: '100vw',
                height: '100vh',
              }),
          opacity: isOrientationFading ? 0 : 1,
          transition: isOrientationFading ? 'none' : 'opacity 320ms ease-out',
        }}
      >
        <DummySandbox
          stats={stats}
          setStats={setStats}
          lang={lang}
          onToggleLang={() => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'))}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isRotatedLandscape={effectiveRotatedLandscape}
          isPortraitLayout={isPortraitLayout}
          onToggleRotateLock={() => setForceLandscape((prev) => !prev)}
          onOpenPaperModal={() => setActiveModal('paper')}
        />
      </div>

      {/* Full-Screen Overlay Modal for Venting Paper (Burn & Shred) */}
      {activeModal === 'paper' && (
        <div className="fixed inset-0 z-50 bg-[#0F141C] overflow-y-auto flex flex-col">
          <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 border-b border-slate-800 bg-[#0F141C]/95 sticky top-0 z-40 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveModal('none')}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>
                {lang === 'ko' ? '밀실 타격장으로 돌아가기' : 'Back to Smash Room'}
              </span>
            </button>

            <nav className="flex items-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveModal('none')}
                className="px-3 py-2 rounded-lg text-slate-400 hover:text-white flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Hammer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === 'ko' ? '밀실 타격장' : 'Smash Room'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveModal('paper')}
                className="px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer bg-orange-500/20 text-orange-300 border border-orange-500/40"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ko' ? '불태우는 일기·파쇄장' : 'Burn & Shred Diary'}
                </span>
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLang((prev) => (prev === 'ko' ? 'en' : 'ko'))}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'ko' ? 'ENG' : '한국어'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetAllSession}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {lang === 'ko' ? '흔적 전체 비우기' : 'Wipe All Traces'}
                </span>
              </button>
            </div>
          </header>

          <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-6">
            <VentingPaper
              stats={stats}
              setStats={setStats}
              lang={lang}
              onBackToRoom={() => setActiveModal('none')}
            />
          </main>
        </div>
      )}
    </div>
  );
}
