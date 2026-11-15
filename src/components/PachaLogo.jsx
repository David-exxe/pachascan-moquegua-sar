import React from 'react';

export default function PachaLogo({ size = 44 }) {
  return (
    <svg
      width={size * 2.35}
      height={size}
      viewBox="0 0 235 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PACHA SCAN Official Emblem"
    >
      <defs>
        <linearGradient id="magmaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9e2c" />
          <stop offset="50%" stopColor="#ff5424" />
          <stop offset="100%" stopColor="#e62e2d" />
        </linearGradient>
        <linearGradient id="peakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f5e6d8" />
        </linearGradient>
      </defs>

      {/* Andean Snow-Capped Mountain Crown */}
      <path
        d="M36 27L66 7L84 18L102 6L134 27L113 21L101 13L85 23L66 13L50 22L36 27Z"
        fill="url(#peakGrad)"
      />
      <path
        d="M66 7L75 15L66 13L57 16L66 7ZM102 6L111 15L101 13L92 16L102 6Z"
        fill="#ff6a2b"
        opacity="0.85"
      />

      {/* Three Radar Signal Arcs (Top Right) */}
      <path
        d="M158 24C167 24 174 31 174 40"
        stroke="url(#magmaGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M158 14C173 14 185 26 185 40"
        stroke="url(#magmaGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M158 4C179 4 196 20 196 40"
        stroke="url(#magmaGrad)"
        strokeWidth="3.8"
        strokeLinecap="round"
      />

      {/* PACHA Wordmark in Warm Andean Cream */}
      <text
        x="12"
        y="56"
        fill="#f7ede2"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="800"
        fontSize="31"
        letterSpacing="1.5"
      >
        PACHA
      </text>

      {/* Inner Flame Accent inside the first 'A' */}
      <path
        d="M47 45C47 41 50 38 50 38C50 38 53 41 53 45C53 47 51.6 48.5 50 48.5C48.4 48.5 47 47 47 45Z"
        fill="url(#magmaGrad)"
      />

      {/* SCAN Wordmark in Magma Orange */}
      <text
        x="38"
        y="86"
        fill="url(#magmaGrad)"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="800"
        fontSize="31"
        letterSpacing="2"
      >
        SCAN
      </text>
    </svg>
  );
}
