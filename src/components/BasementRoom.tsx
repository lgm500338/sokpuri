/**
 * 속풀이 해방구 — 지하 2층 콘크리트 창고 배경
 *
 * 가로(1000×600)와 세로(460×1000) 두 비율로 그립니다.
 * 안쪽 벽 아래선(바닥선)은 두 비율 모두 화면 높이의 79% 지점이라
 * 캐릭터가 걷는 높이가 같습니다.
 *
 * © 2026 아이디어믹스랩. All rights reserved.
 */

import React from 'react';

export const ROOM_LANDSCAPE = { W: 1000, H: 600, L: 150, R: 850, T: 75, B: 475 };
export const ROOM_PORTRAIT = { W: 460, H: 1000, L: 46, R: 414, T: 90, B: 790 };

export const roomGeometry = (portrait: boolean) => (portrait ? ROOM_PORTRAIT : ROOM_LANDSCAPE);

export const BasementRoom: React.FC<{ portrait: boolean }> = ({ portrait }) => {
  const { W, H, L, R, T, B } = roomGeometry(portrait);
  const bw = R - L;
  const bh = B - T;
  const cols = portrait ? 2 : 4;
  const rows = portrait ? 5 : 3;
  const cw = bw / cols;
  const rh = bh / rows;

  // 거푸집 폼타이 구멍
  const ties: React.ReactNode[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x0 = L + c * cw;
      const y0 = T + r * rh;
      [0.25, 0.75].forEach((fx) =>
        [0.25, 0.75].forEach((fy) =>
          ties.push(<circle key={`${c}-${r}-${fx}-${fy}`} cx={x0 + cw * fx} cy={y0 + rh * fy} r="4" />)
        )
      );
    }
  }

  const pipeY = T + 21;
  const vPipeX = R - (portrait ? 40 : 66);
  const valveY = T + bh * 0.56;
  const boxX = L + (portrait ? 18 : 46);
  const boxY = T + bh * (portrait ? 0.42 : 0.44);
  const conduitX = boxX + 26;
  const drumX = L + 10;
  const floorMid = (B + H) / 2;

  return (
    <g>
      <defs>
        {/* 노출 콘크리트 질감 */}
        <filter id="concreteNoise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="stainBlur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="backWallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B6F76" />
          <stop offset="55%" stopColor="#80858C" />
          <stop offset="100%" stopColor="#5A5E64" />
        </linearGradient>
        <linearGradient id="leftWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2F3237" />
          <stop offset="100%" stopColor="#4B4F55" />
        </linearGradient>
        <linearGradient id="rightWallGrad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2F3237" />
          <stop offset="100%" stopColor="#4B4F55" />
        </linearGradient>
        <linearGradient id="ceilingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C1E22" />
          <stop offset="100%" stopColor="#34373C" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#53575C" />
          <stop offset="100%" stopColor="#2A2C30" />
        </linearGradient>
        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="45%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="pipeGradV" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9CA3AF" />
          <stop offset="45%" stopColor="#6B7280" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
        <linearGradient id="rustStreak" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="bulbGlow" cx="50%" cy="22%" r="62%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.34" />
          <stop offset="45%" stopColor="#FCD34D" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="roomVignette" cx="50%" cy="45%" r="75%">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
        </radialGradient>
        <pattern id="hazardStripe" width="28" height="12" patternUnits="userSpaceOnUse" patternTransform="skewX(-35)">
          <rect width="14" height="12" fill="#EAB308" />
          <rect x="14" width="14" height="12" fill="#1C1917" />
        </pattern>
        <pattern id="drainGrate" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#111315" />
          <rect x="1" width="3" height="8" fill="#4B5563" />
        </pattern>
      </defs>

      {/* 방 기본 면 */}
      <polygon points={`0,0 ${W},0 ${R},${T} ${L},${T}`} fill="url(#ceilingGrad)" stroke="#111315" strokeWidth="3" />
      <polygon points={`${L},${B} ${R},${B} ${W},${H} 0,${H}`} fill="url(#floorGrad)" stroke="#111315" strokeWidth="3" />
      <polygon points={`0,0 ${L},${T} ${L},${B} 0,${H}`} fill="url(#leftWallGrad)" stroke="#111315" strokeWidth="3" />
      <polygon points={`${W},0 ${R},${T} ${R},${B} ${W},${H}`} fill="url(#rightWallGrad)" stroke="#111315" strokeWidth="3" />
      <rect x={L} y={T} width={bw} height={bh} fill="url(#backWallGrad)" stroke="#2A2C30" strokeWidth="4" />

      {/* 콘크리트 질감 */}
      <rect x={L} y={T} width={bw} height={bh} fill="#000000" filter="url(#concreteNoise)" opacity="0.22" />
      <polygon points={`0,0 ${L},${T} ${L},${B} 0,${H}`} fill="#000000" filter="url(#concreteNoise)" opacity="0.25" />
      <polygon points={`${W},0 ${R},${T} ${R},${B} ${W},${H}`} fill="#000000" filter="url(#concreteNoise)" opacity="0.25" />
      <polygon points={`${L},${B} ${R},${B} ${W},${H} 0,${H}`} fill="#000000" filter="url(#concreteNoise)" opacity="0.3" />

      {/* 거푸집 줄눈 + 폼타이 구멍 */}
      <g stroke="#4B4F55" strokeWidth="2" opacity="0.7">
        {Array.from({ length: rows - 1 }, (_, i) => (
          <line key={`r${i}`} x1={L} y1={T + rh * (i + 1)} x2={R} y2={T + rh * (i + 1)} />
        ))}
        {Array.from({ length: cols - 1 }, (_, i) => (
          <line key={`c${i}`} x1={L + cw * (i + 1)} y1={T} x2={L + cw * (i + 1)} y2={B} />
        ))}
      </g>
      <g fill="#3F4349">{ties}</g>

      {/* 녹물 · 물 얼룩 */}
      <rect x={L + bw * 0.12} y={T + 43} width="26" height={bh * 0.48} fill="url(#rustStreak)" filter="url(#stainBlur)" />
      <rect x={L + bw * 0.64} y={T + 43} width="18" height={bh * 0.35} fill="url(#rustStreak)" filter="url(#stainBlur)" />
      <rect x={vPipeX - 14} y={T + 43} width="30" height={bh * 0.58} fill="url(#rustStreak)" filter="url(#stainBlur)" />
      <ellipse cx={L + bw * 0.4} cy={B - 20} rx={bw * 0.17} ry="26" fill="#1F2937" opacity="0.35" filter="url(#stainBlur)" />

      {/* 천장 콘크리트 보 */}
      <polygon
        points={`${W / 2 - W * 0.08},0 ${W / 2 + W * 0.08},0 ${W / 2 + W * 0.06},${T} ${W / 2 - W * 0.06},${T}`}
        fill="#25282C"
        stroke="#111315"
        strokeWidth="2"
      />

      {/* 배관 2줄 */}
      <rect x={L} y={pipeY} width={bw} height="14" fill="url(#pipeGrad)" stroke="#1F2937" strokeWidth="1.5" />
      <rect x={L} y={pipeY + 20} width={bw} height="9" fill="url(#pipeGrad)" stroke="#1F2937" strokeWidth="1.2" />
      {(portrait ? [0.12, 0.88] : [0.086, 0.357, 0.657, 0.929]).map((f) => (
        <g key={f}>
          <rect x={L + bw * f - 5} y={pipeY - 4} width="10" height="22" rx="2" fill="#4B5563" stroke="#111315" strokeWidth="1.5" />
          <rect x={L + bw * f - 7} y={pipeY + 16} width="14" height="16" rx="2" fill="#374151" stroke="#111315" strokeWidth="1.2" />
        </g>
      ))}

      {/* 세로 배관 + 빨간 밸브 */}
      <rect x={vPipeX - 8} y={pipeY + 14} width="16" height={B - pipeY - 14} fill="url(#pipeGradV)" stroke="#1F2937" strokeWidth="1.5" />
      <rect x={vPipeX - 12} y={valveY - 50} width="24" height="12" rx="2" fill="#4B5563" stroke="#111315" strokeWidth="1.5" />
      <g transform={`translate(${vPipeX} ${valveY})`}>
        <circle r="17" fill="none" stroke="#B91C1C" strokeWidth="5" />
        <line x1="-17" y1="0" x2="17" y2="0" stroke="#B91C1C" strokeWidth="4" />
        <line x1="0" y1="-17" x2="0" y2="17" stroke="#B91C1C" strokeWidth="4" />
        <circle r="5" fill="#7F1D1D" />
      </g>

      {/* 전기 분전함 + 전선관 */}
      <rect x={conduitX} y={pipeY + 29} width="6" height={boxY - pipeY - 29} fill="#52565C" />
      <rect x={conduitX} y={boxY + 78} width="6" height={B - boxY - 78} fill="#52565C" />
      <rect x={boxX} y={boxY} width="60" height="78" rx="3" fill="#4B5563" stroke="#1F2937" strokeWidth="2.5" />
      <rect x={boxX + 6} y={boxY + 6} width="48" height="66" rx="2" fill="none" stroke="#6B7280" strokeWidth="1.5" />
      <path
        d={`M ${boxX + 30},${boxY + 20} l -8,16 h 10 l -8,16`}
        fill="none"
        stroke="#FACC15"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* 층 표시 스텐실 */}
      <text
        x={W / 2}
        y={T + (portrait ? 150 : 115)}
        textAnchor="middle"
        fontFamily="'Outfit', 'Noto Sans KR', sans-serif"
        fontSize={portrait ? 56 : 46}
        fontWeight="800"
        fill="#E5E7EB"
        opacity="0.16"
        letterSpacing="6"
      >
        B2
      </text>

      {/* 안전 띠 */}
      <rect x={L} y={B - 17} width={bw} height="12" fill="url(#hazardStripe)" opacity="0.85" />
      <line x1={L} y1={B - 17} x2={R} y2={B - 17} stroke="#111315" strokeWidth="1.5" />

      {/* 바닥 줄눈 */}
      <g stroke="#1F2124" strokeWidth="2" opacity="0.6">
        {(portrait ? [0.5] : [0.25, 0.5, 0.75]).map((f) => (
          <line key={f} x1={L + bw * f} y1={B} x2={W * f} y2={H} />
        ))}
        <line x1={L * 0.66} y1={floorMid} x2={W - L * 0.66} y2={floorMid} />
      </g>

      {/* 배수구 */}
      <rect
        x={W / 2 - (portrait ? 40 : 45)}
        y={H - (H - B) * 0.42}
        width={portrait ? 80 : 90}
        height="22"
        rx="3"
        fill="url(#drainGrate)"
        stroke="#111315"
        strokeWidth="2.5"
      />

      {/* 드럼통 2개 */}
      <g>
        <rect x={drumX} y={B - 67} width="44" height="62" rx="4" fill="#1D4ED8" stroke="#0F172A" strokeWidth="2.5" />
        <rect x={drumX} y={B - 55} width="44" height="5" fill="#1E3A8A" />
        <rect x={drumX} y={B - 23} width="44" height="5" fill="#1E3A8A" />
        <ellipse cx={drumX + 22} cy={B - 67} rx="22" ry="5" fill="#2563EB" stroke="#0F172A" strokeWidth="2" />
        <rect x={drumX + 48} y={B - 55} width="40" height="50" rx="4" fill="#9A3412" stroke="#431407" strokeWidth="2.5" />
        <rect x={drumX + 48} y={B - 43} width="40" height="4" fill="#7C2D12" />
        <ellipse cx={drumX + 68} cy={B - 55} rx="20" ry="4.5" fill="#C2410C" stroke="#431407" strokeWidth="2" />
      </g>

      {/* 전구 불빛 + 가장자리 어둡게 */}
      <rect x="0" y="0" width={W} height={H} fill="url(#bulbGlow)" />
      <rect x="0" y="0" width={W} height={H} fill="url(#roomVignette)" />
    </g>
  );
};
