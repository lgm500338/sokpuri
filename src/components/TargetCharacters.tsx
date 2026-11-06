/**
 * 속풀이 해방구 — 타격 캐릭터 3종 (솜뭉치 곰 · 뜨개 토끼 · 충돌 테스트 더미)
 *
 * 모든 캐릭터는 DummySandbox의 SVG 좌표계(viewBox 0 0 240 310)를 공유합니다.
 *  - 다리 피벗: (96, 205) / (144, 205)
 *  - 팔 피벗:   (70, 118) / (170, 118)
 *  - 눈 위치:   (103, 56) / (137, 56)
 *  - 입 영역:   y 70~90 (입 / 청테이프 / 지퍼는 DummySandbox가 공통으로 덧그림)
 *
 * © 2026 아이디어믹스랩. All rights reserved.
 */

import React from 'react';

interface FigureProps {
  legSwing: number;
  hanging: boolean;
}

const armTransform = (side: -1 | 1, legSwing: number, hanging: boolean, base = 15, mult = 0.7) =>
  side < 0
    ? hanging
      ? 'rotate(55 70 118)'
      : `rotate(${-base - legSwing * mult} 70 118)`
    : hanging
    ? 'rotate(-55 170 118)'
    : `rotate(${base + legSwing * mult} 170 118)`;

/* ------------------------------------------------------------------ */
/* A. 솜뭉치 곰                                                        */
/* ------------------------------------------------------------------ */
const BEAR = { fur: '#9CA3AF', furDark: '#6B7280', inner: '#F5E6D3', line: '#374151' };

export const BearFigure: React.FC<FigureProps> = ({ legSwing, hanging }) => {
  const { fur, furDark, inner, line } = BEAR;

  const leg = (px: number, fx: number, dir: 1 | -1) => (
    <g transform={`rotate(${dir * legSwing} ${px} 205)`}>
      <rect x={px - 15} y="196" width="30" height="62" rx="15" fill={fur} stroke={line} strokeWidth="3.5" />
      <ellipse cx={fx} cy="262" rx="20" ry="15" fill={fur} stroke={line} strokeWidth="3.5" />
      <ellipse cx={fx} cy="264" rx="11" ry="8" fill={inner} stroke={line} strokeWidth="2" />
    </g>
  );

  const arm = (side: -1 | 1) => {
    const sx = side < 0 ? 78 : 162;
    const ex = side < 0 ? 34 : 206;
    return (
      <g transform={armTransform(side, legSwing, hanging)}>
        <line x1={sx} y1="122" x2={ex} y2="152" stroke={line} strokeWidth="27" strokeLinecap="round" />
        <line x1={sx} y1="122" x2={ex} y2="152" stroke={fur} strokeWidth="20" strokeLinecap="round" />
        <circle cx={ex} cy="154" r="9" fill={inner} stroke={line} strokeWidth="2" />
      </g>
    );
  };

  return (
    <g>
      {leg(96, 90, 1)}
      {leg(144, 150, -1)}
      {arm(-1)}
      {arm(1)}

      {/* 몸통 + 배 + 꿰맨 하트 패치 */}
      <ellipse cx="120" cy="160" rx="50" ry="56" fill={fur} stroke={line} strokeWidth="3.5" />
      <ellipse cx="120" cy="168" rx="32" ry="36" fill={inner} stroke={line} strokeWidth="2.5" />
      <path
        d="M 120,176 C 104,164 106,150 114,150 C 118,150 120,154 120,156 C 120,154 122,150 126,150 C 134,150 136,164 120,176 Z"
        fill="#F472B6"
        stroke="#9D174D"
        strokeWidth="2.5"
      />
      <path d="M 106,150 l -4,-4 M 108,170 l -5,3" stroke="#9D174D" strokeWidth="2" strokeLinecap="round" />

      {/* 귀 */}
      <circle cx="80" cy="26" r="20" fill={fur} stroke={line} strokeWidth="3.5" />
      <circle cx="80" cy="26" r="10" fill={inner} />
      <circle cx="160" cy="26" r="20" fill={fur} stroke={line} strokeWidth="3.5" />
      <circle cx="160" cy="26" r="10" fill={inner} />

      {/* 머리 */}
      <circle cx="120" cy="60" r="46" fill={fur} stroke={line} strokeWidth="3.5" />
      <path
        d="M 92,30 q 6,-6 12,0 M 128,24 q 6,-6 12,0 M 146,36 q 5,-5 10,1"
        fill="none"
        stroke={furDark}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="120" cy="74" rx="26" ry="19" fill={inner} stroke={line} strokeWidth="2.5" />
      <ellipse cx="120" cy="64" rx="7" ry="5" fill="#1F2937" />
      <circle cx="103" cy="52" r="6.5" fill="#111827" />
      <circle cx="105" cy="50" r="2" fill="#FFFFFF" />
      <circle cx="137" cy="52" r="6.5" fill="#111827" />
      <circle cx="139" cy="50" r="2" fill="#FFFFFF" />
      <ellipse cx="88" cy="70" rx="7" ry="4" fill="#F9A8D4" opacity="0.7" />
      <ellipse cx="152" cy="70" rx="7" ry="4" fill="#F9A8D4" opacity="0.7" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* B. 뜨개 토끼                                                        */
/* ------------------------------------------------------------------ */
const BUNNY = {
  wool: '#FDF2F8',
  pink: '#F9A8D4',
  teal: '#5EEAD4',
  tealLight: '#99F6E4',
  tealDark: '#0F766E',
  line: '#831843',
};

const stripeRects = (x: number, y: number, w: number, h: number, step: number, color: string) => {
  const out: React.ReactNode[] = [];
  for (let yy = y + step; yy < y + h; yy += step * 2) {
    out.push(<rect key={yy} x={x} y={yy} width={w} height={step} fill={color} />);
  }
  return out;
};

export const BunnyFigure: React.FC<FigureProps> = ({ legSwing, hanging }) => {
  const { wool, pink, teal, tealLight, tealDark, line } = BUNNY;

  const leg = (px: number, clipId: string, fx: number, dir: 1 | -1) => (
    <g transform={`rotate(${dir * legSwing} ${px} 205)`}>
      <rect x={px - 15} y="196" width="30" height="64" rx="14" fill={wool} />
      <g clipPath={`url(#${clipId})`}>{stripeRects(px - 15, 196, 30, 64, 8, teal)}</g>
      <rect x={px - 15} y="196" width="30" height="64" rx="14" fill="none" stroke={tealDark} strokeWidth="3" />
      <ellipse cx={fx} cy="266" rx="19" ry="12" fill={pink} stroke={line} strokeWidth="3" />
    </g>
  );

  const arm = (side: -1 | 1) => {
    const sx = side < 0 ? 78 : 162;
    const ex = side < 0 ? 36 : 204;
    return (
      <g transform={armTransform(side, legSwing, hanging)}>
        <line x1={sx} y1="120" x2={ex} y2="150" stroke={tealDark} strokeWidth="20" strokeLinecap="round" />
        <line
          x1={sx}
          y1="120"
          x2={ex}
          y2="150"
          stroke={wool}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="7 7"
        />
        <circle cx={ex} cy="152" r="13" fill={pink} stroke={line} strokeWidth="3" />
      </g>
    );
  };

  // 니트 V 무늬
  const knitV: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 86 + c * 14;
      const y = 124 + r * 20;
      knitV.push(
        <path
          key={`${r}-${c}`}
          d={`M ${x},${y} l 7,8 l 7,-8`}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.45"
        />
      );
    }
  }

  return (
    <g>
      <defs>
        <clipPath id="sokpuri-bunny-leg-l">
          <rect x="81" y="196" width="30" height="64" rx="14" />
        </clipPath>
        <clipPath id="sokpuri-bunny-leg-r">
          <rect x="129" y="196" width="30" height="64" rx="14" />
        </clipPath>
        <clipPath id="sokpuri-bunny-body">
          <ellipse cx="120" cy="160" rx="46" ry="54" />
        </clipPath>
      </defs>

      {leg(96, 'sokpuri-bunny-leg-l', 92, 1)}
      {leg(144, 'sokpuri-bunny-leg-r', 148, -1)}
      {arm(-1)}
      {arm(1)}

      {/* 줄무늬 니트 몸통 */}
      <ellipse cx="120" cy="160" rx="46" ry="54" fill={teal} />
      <g clipPath="url(#sokpuri-bunny-body)">
        {stripeRects(70, 106, 100, 110, 11, tealLight)}
        {knitV}
      </g>
      <ellipse cx="120" cy="160" rx="46" ry="54" fill="none" stroke={tealDark} strokeWidth="3.5" />
      <circle cx="120" cy="198" r="7" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />

      {/* 긴 귀 (오른쪽 귀에 꿰맨 자국) */}
      <g transform="rotate(-10 98 30)">
        <ellipse cx="98" cy="-2" rx="15" ry="40" fill={wool} stroke={line} strokeWidth="3.5" />
        <ellipse cx="98" cy="2" rx="7" ry="28" fill={pink} />
      </g>
      <g transform="rotate(14 142 30)">
        <ellipse cx="142" cy="-2" rx="15" ry="40" fill={wool} stroke={line} strokeWidth="3.5" />
        <ellipse cx="142" cy="2" rx="7" ry="28" fill={pink} />
        <path d="M 130,-24 l 24,10" stroke={line} strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* 머리 */}
      <ellipse cx="120" cy="62" rx="44" ry="42" fill={wool} stroke={line} strokeWidth="3.5" />
      <path d="M 82,46 q 6,6 0,12 M 158,46 q -6,6 0,12" fill="none" stroke={pink} strokeWidth="2.5" />
      {/* X자 단추 눈 */}
      <path d="M 96,50 l 14,12 M 110,50 l -14,12" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
      <path d="M 130,50 l 14,12 M 144,50 l -14,12" stroke="#1F2937" strokeWidth="4" strokeLinecap="round" />
      <path d="M 116,66 l 4,4 l 4,-4 Z" fill={pink} stroke={line} strokeWidth="1.5" />
      <ellipse cx="88" cy="74" rx="7" ry="4" fill={pink} opacity="0.8" />
      <ellipse cx="152" cy="74" rx="7" ry="4" fill={pink} opacity="0.8" />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* C. 충돌 테스트 더미                                                  */
/* ------------------------------------------------------------------ */
const DUMMY = { yellow: '#FACC15', yellowDark: '#EAB308', line: '#1C1917', gray: '#3F3F46' };

const CrashMarker: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={DUMMY.yellow} stroke={DUMMY.line} strokeWidth="2.5" />
    <path d={`M ${cx},${cy} L ${cx + r},${cy} A ${r} ${r} 0 0 1 ${cx},${cy + r} Z`} fill={DUMMY.line} />
    <path d={`M ${cx},${cy} L ${cx - r},${cy} A ${r} ${r} 0 0 1 ${cx},${cy - r} Z`} fill={DUMMY.line} />
  </g>
);

const Bolt: React.FC<{ cx: number; cy: number; r: number; ring?: string; core?: string }> = ({
  cx,
  cy,
  r,
  ring = DUMMY.line,
  core = '#A1A1AA',
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={ring} stroke="#000000" strokeWidth="2" />
    <circle cx={cx} cy={cy} r={r * 0.4} fill={core} />
  </g>
);

export const CrashDummyFigure: React.FC<FigureProps> = ({ legSwing, hanging }) => {
  const { yellow, yellowDark, line, gray } = DUMMY;

  const leg = (px: number, x: number, footX: number, dir: 1 | -1) => (
    <g transform={`rotate(${dir * legSwing} ${px} 205)`}>
      <rect x={x} y="200" width="28" height="46" rx="10" fill={yellow} stroke={line} strokeWidth="3" />
      <line x1={x + 4} y1="214" x2={x + 24} y2="214" stroke={line} strokeWidth="2.5" />
      <Bolt cx={px} cy={247} r={9} />
      <rect x={x + 1} y="252" width="26" height="32" rx="9" fill={yellow} stroke={line} strokeWidth="3" />
      <ellipse cx={footX} cy="289" rx="21" ry="10" fill={gray} stroke="#000000" strokeWidth="2.5" />
    </g>
  );

  return (
    <g>
      {leg(96, 82, 90, 1)}
      {leg(144, 130, 150, -1)}

      <g transform={armTransform(-1, legSwing, hanging, 12, 0.8)}>
        <rect x="42" y="114" width="25" height="40" rx="10" fill={yellow} stroke={line} strokeWidth="2.5" transform="rotate(24 54 134)" />
        <Bolt cx={40} cy={148} r={8} />
        <rect x="24" y="146" width="20" height="32" rx="8" fill={yellow} stroke={line} strokeWidth="2.5" transform="rotate(18 34 162)" />
        <circle cx="26" cy="178" r="12" fill={gray} stroke="#000000" strokeWidth="2.5" />
        <Bolt cx={68} cy={118} r={13} ring={gray} core={yellow} />
      </g>
      <g transform={armTransform(1, legSwing, hanging, 12, 0.8)}>
        <rect x="173" y="114" width="25" height="40" rx="10" fill={yellow} stroke={line} strokeWidth="2.5" transform="rotate(-24 186 134)" />
        <Bolt cx={200} cy={148} r={8} />
        <rect x="196" y="146" width="20" height="32" rx="8" fill={yellow} stroke={line} strokeWidth="2.5" transform="rotate(-18 206 162)" />
        <circle cx="214" cy="178" r="12" fill={gray} stroke="#000000" strokeWidth="2.5" />
        <Bolt cx={172} cy={118} r={13} ring={gray} core={yellow} />
      </g>

      {/* 몸통 */}
      <path d="M 66,106 L 174,106 L 160,198 L 80,198 Z" fill={yellow} stroke={line} strokeWidth="3.5" />
      <path d="M 66,106 L 174,106 L 171,122 L 69,122 Z" fill={yellowDark} stroke={line} strokeWidth="2.5" />
      <path d="M 84,150 Q 120,158 156,150" fill="none" stroke={line} strokeWidth="2.5" opacity="0.55" />
      <path d="M 86,166 Q 120,174 154,166" fill="none" stroke={line} strokeWidth="2.5" opacity="0.55" />
      <CrashMarker cx={120} cy={140} r={15} />
      <rect x="78" y="190" width="84" height="18" rx="5" fill={gray} stroke="#000000" strokeWidth="2.5" />
      <Bolt cx={96} cy={199} r={4.5} core={yellow} />
      <Bolt cx={144} cy={199} r={4.5} core={yellow} />
      <text
        x="120"
        y="186"
        textAnchor="middle"
        fontFamily="ui-monospace, 'JetBrains Mono', monospace"
        fontSize="11"
        fontWeight="900"
        fill={line}
      >
        TEST
      </text>

      {/* 목 */}
      <rect x="108" y="88" width="24" height="22" rx="5" fill={gray} stroke="#000000" strokeWidth="2.5" />
      <line x1="108" y1="95" x2="132" y2="95" stroke="#71717A" strokeWidth="2" />
      <line x1="108" y1="102" x2="132" y2="102" stroke="#71717A" strokeWidth="2" />

      {/* 머리 */}
      <ellipse cx="120" cy="58" rx="41" ry="43" fill={yellow} stroke={line} strokeWidth="3.5" />
      <path d="M 120,15 L 120,40" stroke={line} strokeWidth="3" />
      <path d="M 84,40 Q 120,30 156,40" fill="none" stroke={line} strokeWidth="2.5" opacity="0.45" />
      <CrashMarker cx={80} cy={60} r={10} />
      <CrashMarker cx={160} cy={60} r={10} />
      <circle cx="103" cy="56" r="7" fill={line} />
      <circle cx="105" cy="54" r="2.2" fill="#FFFFFF" />
      <circle cx="137" cy="56" r="7" fill={line} />
      <circle cx="139" cy="54" r="2.2" fill="#FFFFFF" />
    </g>
  );
};

/** 감전 모드 실루엣에 덧붙일 캐릭터별 귀/머리 장식 (감전 색상) */
export const ElectrocutedEars: React.FC<{ style: 'bear' | 'bunny' | 'crash_dummy' }> = ({ style }) => {
  const fill = '#082F49';
  const stroke = '#FEF08A';
  if (style === 'bear') {
    return (
      <g>
        <circle cx="80" cy="26" r="20" fill={fill} stroke={stroke} strokeWidth="4" />
        <circle cx="160" cy="26" r="20" fill={fill} stroke={stroke} strokeWidth="4" />
      </g>
    );
  }
  if (style === 'bunny') {
    return (
      <g>
        <ellipse cx="98" cy="-2" rx="15" ry="40" fill={fill} stroke={stroke} strokeWidth="4" transform="rotate(-10 98 30)" />
        <ellipse cx="142" cy="-2" rx="15" ry="40" fill={fill} stroke={stroke} strokeWidth="4" transform="rotate(14 142 30)" />
      </g>
    );
  }
  return (
    <g>
      <circle cx="74" cy="62" r="10" fill={fill} stroke={stroke} strokeWidth="4" />
      <circle cx="166" cy="62" r="10" fill={fill} stroke={stroke} strokeWidth="4" />
    </g>
  );
};
